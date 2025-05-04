import React from 'react';
import { Modal, Card, Row, Col, Badge } from 'react-bootstrap';
import { getColorClassForNutrient,getLabelForNutrient } from '../../../utils/nutritionUtils';



const IngredientDetails = ({ show, onHide, ingredient }) => {
  if (!ingredient) return null;

  console.log({ingredient})

  return (
    <Modal show={show} onHide={onHide} centered size="md">
      <Modal.Body className="p-4">
        <h2 className="text-center mb-4">{ingredient.name}</h2>

        {/* Catégorie */}
        {ingredient.category && (
          <div className="text-center mb-3">
            <span className="badge bg-secondary">{ingredient.category}</span>
          </div>
        )}

        {/* Propriétés nutritionnelles */}
        {ingredient.nutritionalProperties?.length > 0 && (
          <>
            <h6 className="text-uppercase text-muted">Propriétés nutritionnelles</h6>
            <div className="d-flex flex-wrap gap-2 mb-3">
              {ingredient.nutritionalProperties.map((prop, idx) => (
                <Badge key={idx} bg="primary" className="text-capitalize">{prop}</Badge>
              ))}
            </div>
          </>
        )}

        {/* Propriétés diététiques */}
        {ingredient.dietaryProperties?.length > 0 && (
          <>
            <h6 className="text-uppercase text-muted">Propriétés diététiques</h6>
            <div className="d-flex flex-wrap gap-2 mb-3">
              {ingredient.dietaryProperties.map((prop, idx) => (
                <Badge key={idx} bg="success" className="text-capitalize">{prop}</Badge>
              ))}
            </div>
          </>
        )}

        {/* Macronutriments */}
        <h6 className="text-uppercase text-muted">Macronutriments (pour 100g)</h6>
        <Row className="text-center mb-3">
          {['calories', 'proteins', 'carbs', 'fats'].map((nutrient, idx) => (
            <Col xs={3} key={idx}>
              <div className={`rounded-circle d-flex align-items-center justify-content-center ${getColorClassForNutrient(nutrient)}`} style={{ width: 40, height: 40, margin: '0 auto' }}>
                <small className="text-white">{getLabelForNutrient(nutrient)}</small>
              </div>
              <small className="d-block mt-1">
                {nutrient === 'calories' 
                  ? `${ingredient.nutritionPer100g?.calories} kcal`
                  : `${ingredient.nutritionPer100g?.[nutrient]} g`
                }
              </small>
            </Col>
          ))}
        </Row>

        {/* Unités disponibles */}
        <h6 className="text-uppercase text-muted">Unités disponibles</h6>
        <div className="d-flex flex-wrap gap-2">
          {ingredient.units?.map((unit, idx) => (
           <div key={idx}> {unit}</div>
          ))}
        </div>

        {/* Recettes utilisant cet ingrédient */}
        {ingredient.usedInRecipes?.length > 0 && (
          <>
            <h6 className="text-uppercase text-muted mt-4">Utilisé dans les recettes</h6>
            <ul className="ps-3">
              {ingredient.usedInRecipes.map((rec, idx) => (
                <li key={idx}>
                  <strong>{rec.recipeTitle}</strong>
                </li>
              ))}
            </ul>
          </>
        )}

      </Modal.Body>
    </Modal>
  );
};

export default IngredientDetails;
