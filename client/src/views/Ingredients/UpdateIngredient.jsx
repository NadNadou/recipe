import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Spinner, Alert, InputGroup, ListGroup, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Search } from 'react-feather';
import { updateIngredient } from '../../redux/action/MetaData';
import ingredientsApi from '../../api/ingredients';

const UpdateIngredient = ({ show, close, ingredient }) => {
  const dispatch = useDispatch();

  const cookingUnits = useSelector(state => state.metadataReducer.cookingUnits);
  const nutritionalProperties = useSelector(state => state.metadataReducer.nutritionalProperties);

  const [ingredientData, setIngredientData] = useState({
    name: '',
    defaultUnit: 'g',
    units: ['g'],
    unitConversions: { g: 1 },
    nutritionPer100g: { calories: 0, proteins: 0, carbs: 0, fats: 0 },
    nutritionalProperties: [],
  });

  // OpenFoodFacts enrichment state
  const [enrichLoading, setEnrichLoading] = useState(false);
  const [enrichError, setEnrichError] = useState(null);
  const [enrichResults, setEnrichResults] = useState(null);
  const [customSearchTerm, setCustomSearchTerm] = useState('');

  useEffect(() => {
    if (ingredient) {
      setIngredientData({
        name: ingredient.name || '',
        defaultUnit: ingredient.defaultUnit || 'g',
        units: ingredient.units || ['g'],
        unitConversions: ingredient.unitConversions || { g: 1 },
        nutritionPer100g: ingredient.nutritionPer100g || { calories: 0, proteins: 0, carbs: 0, fats: 0 },
        nutritionalProperties: ingredient.nutritionalProperties || [],
      });
      setCustomSearchTerm('');
      setEnrichError(null);
      setEnrichResults(null);
    }
  }, [ingredient]);

  const handleChange = (field, value) => {
    setIngredientData(prev => ({ ...prev, [field]: value }));
  };

  const handleNutritionChange = (field, value) => {
    setIngredientData(prev => ({
      ...prev,
      nutritionPer100g: { ...prev.nutritionPer100g, [field]: parseFloat(value) || 0 }
    }));
  };

  const toggleArrayValue = (arrayName, value) => {
    setIngredientData(prev => {
      const currentArray = prev[arrayName];
      const updated = currentArray.includes(value)
        ? currentArray.filter(v => v !== value)
        : [...currentArray, value];
      return { ...prev, [arrayName]: updated };
    });
  };

  const handleSubmit = async () => {
    if (!ingredient || !ingredient._id) return;
    await dispatch(updateIngredient(ingredient._id, ingredientData));
    close();
  };

  const handleSearchNutrition = async () => {
    setEnrichLoading(true);
    setEnrichError(null);
    setEnrichResults(null);

    try {
      const searchTerm = customSearchTerm.trim() || ingredientData.name;
      const response = await ingredientsApi.searchNutritionMultiple(searchTerm);
      const { results } = response.data;

      if (results && results.length > 0) {
        setEnrichResults(results);
      } else {
        setEnrichError('Aucune donnée trouvée');
      }
    } catch (err) {
      setEnrichError(err.response?.data?.message || 'Aucune donnée trouvée');
    } finally {
      setEnrichLoading(false);
    }
  };

  const handleSelectNutritionResult = (result) => {
    setIngredientData(prev => ({
      ...prev,
      nutritionPer100g: {
        calories: result.nutritionPer100g.calories,
        proteins: result.nutritionPer100g.proteins,
        carbs: result.nutritionPer100g.carbs,
        fats: result.nutritionPer100g.fats,
      }
    }));
    setEnrichResults(null);
    setEnrichError(null);
  };

  return (
    <Modal show={show} onHide={close} centered>
      <Modal.Header closeButton>
        <Modal.Title>Modifier l'ingrédient</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nom</Form.Label>
            <Form.Control
              onChange={e => handleChange('name', e.target.value)}
              defaultValue={ingredientData.name}
              placeholder={ingredientData.name}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Unité par défaut</Form.Label>
            <Form.Select
              value={ingredientData.defaultUnit}
              onChange={e => handleChange('defaultUnit', e.target.value)}
            >
              {cookingUnits.map((unit, index) => (
                <option key={index} value={unit.label}>{unit.label}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <h6>Macronutriments (pour 100g)</h6>

          {/* Nutrition search */}
          <div className="mb-3 p-3 bg-light rounded">
            <Form.Label className="small text-muted mb-2">
              Rechercher des données nutritionnelles
            </Form.Label>
            <InputGroup size="sm">
              <Form.Control
                placeholder={ingredientData.name || "Terme de recherche..."}
                value={customSearchTerm}
                onChange={e => setCustomSearchTerm(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleSearchNutrition(); } }}
              />
              <Button
                variant="outline-primary"
                onClick={handleSearchNutrition}
                disabled={enrichLoading}
              >
                {enrichLoading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <><Search size={14} className="me-1" /> Rechercher</>
                )}
              </Button>
            </InputGroup>
            {enrichError && (
              <Alert variant="warning" className="mt-2 mb-0 py-1 small">
                {enrichError}
              </Alert>
            )}
            {enrichResults && enrichResults.length > 0 && (
              <ListGroup className="mt-2" style={{ maxHeight: '240px', overflowY: 'auto' }}>
                {enrichResults.map((result, index) => (
                  <ListGroup.Item
                    key={index}
                    action
                    onClick={() => handleSelectNutritionResult(result)}
                    className="py-2 px-3"
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="me-2" style={{ flex: 1, minWidth: 0 }}>
                        <div className="fw-semibold text-truncate" style={{ fontSize: '0.85rem' }}>
                          {result.productName}
                        </div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                          {result.nutritionPer100g.calories} kcal
                          {' | P: '}{result.nutritionPer100g.proteins}g
                          {' | G: '}{result.nutritionPer100g.carbs}g
                          {' | L: '}{result.nutritionPer100g.fats}g
                        </div>
                      </div>
                      <Badge
                        bg={result.source === 'USDA' ? 'primary' : 'success'}
                        className="ms-1 align-self-center"
                        style={{ fontSize: '0.65rem' }}
                      >
                        {result.source === 'OpenFoodFacts' ? 'OFF' : result.source}
                      </Badge>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </div>

          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Calories</Form.Label>
                <Form.Control
                  type="number"
                  value = {ingredientData.nutritionPer100g && ingredientData.nutritionPer100g.calories !== undefined 
                    ? ingredientData.nutritionPer100g.calories 
                    : 0}
                  onChange={e => handleNutritionChange('calories', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Protéines</Form.Label>
                <Form.Control
                  type="number"
                  value = {ingredientData.nutritionPer100g && ingredientData.nutritionPer100g.proteins !== undefined 
                    ? ingredientData.nutritionPer100g.proteins 
                    : 0}
                  onChange={e => handleNutritionChange('proteins', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Glucides</Form.Label>
                <Form.Control
                  type="number"
                  value = {ingredientData.nutritionPer100g && ingredientData.nutritionPer100g.carbs !== undefined 
                    ? ingredientData.nutritionPer100g.carbs 
                    : 0}
                  onChange={e => handleNutritionChange('carbs', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Lipides</Form.Label>
                <Form.Control
                  type="number"
                  value={ingredientData.nutritionPer100g && ingredientData.nutritionPer100g.fats !== undefined 
                    ? ingredientData.nutritionPer100g.fats 
                    : 0}
                  onChange={e => handleNutritionChange('fats', e.target.value)}
                />

              </Form.Group>
            </Col>
          </Row>

          <h6 className="mt-4">Propriétés nutritionnelles</h6>
          {nutritionalProperties.map((prop, index) => (
            <Form.Check
              key={index}
              type="checkbox"
              label={prop.label}
              checked={ingredientData.nutritionalProperties.includes(prop.label)}
              onChange={() => toggleArrayValue('nutritionalProperties', prop.label)}
            />
          ))}

        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={close}>Annuler</Button>
        <Button variant="primary" onClick={handleSubmit}>Mettre à jour</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateIngredient;
