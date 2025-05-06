import React, { useState,useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { createIngredient } from '../../redux/action/MetaData';

const CreateNewIngredient = ({ show, close }) => {
  const dispatch = useDispatch();

  const cookingUnits = useSelector(state=> state.metadataReducer.cookingUnits);
  const nutritionalProperties = useSelector(state => state.metadataReducer.nutritionalProperties);

  const [ingredientData, setIngredientData] = useState({
    name: '',
    defaultUnit: 'g',
    units: ['g'],
    unitConversions: { g: 1 },
    nutritionPer100g: {
      calories: 0,
      proteins: 0,
      carbs: 0,
      fats: 0
    },
    nutritionalProperties: [],
  });

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
    await dispatch(createIngredient(ingredientData));
    close();
    setIngredientData({
      name: '',
      defaultUnit: 'g',
      units: ['g'],
      unitConversions: { g: 1 },
      nutritionPer100g: { calories: 0, proteins: 0, carbs: 0, fats: 0 },
      nutritionalProperties: [],
    });
  };

  return (
    <Modal show={show} onHide={close} centered>
      <Modal.Header closeButton>
        <Modal.Title>New ingredient</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={ingredientData.name}
              onChange={e => handleChange('name', e.target.value)}
              placeholder="Ex: Floor"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Default unit</Form.Label>
            <Form.Select
              value={ingredientData.defaultUnit}
              onChange={e => handleChange('defaultUnit', e.target.value)}
            >
              {cookingUnits.map((unit,index)=><option key={index} value={unit.label}>{unit.label}</option>)}
            </Form.Select>
          </Form.Group>

          <h6>Macronutriments (per 100g)</h6>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Calories</Form.Label>
                <Form.Control
                  type="number"
                  value={ingredientData.nutritionPer100g.calories}
                  onChange={e => handleNutritionChange('calories', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Proteins</Form.Label>
                <Form.Control
                  type="number"
                  value={ingredientData.nutritionPer100g.proteins}
                  onChange={e => handleNutritionChange('proteins', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Carbs</Form.Label>
                <Form.Control
                  type="number"
                  value={ingredientData.nutritionPer100g.carbs}
                  onChange={e => handleNutritionChange('carbs', e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Fats</Form.Label>
                <Form.Control
                  type="number"
                  value={ingredientData.nutritionPer100g.fats}
                  onChange={e => handleNutritionChange('fats', e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <h6 className="mt-4">Nutritional properties</h6>
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
        <Button variant="secondary" onClick={close}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit}>Create</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateNewIngredient;
