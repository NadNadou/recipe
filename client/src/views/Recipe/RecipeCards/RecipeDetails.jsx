import React, {useEffect,useState} from 'react';
import { Modal, Card, Table, Row, Col } from 'react-bootstrap';
import { Clock, Coffee,Loader} from 'react-feather';
import avatar2 from '../../../assets/img/avatar2.jpg';
import { getColorClassForNutrient } from '../../../utils/nutritionUtils';

const RecipeDetails = ({ show, onHide, recipe }) => {
  if (!recipe) return null;

    const [portionCount, setPortionCount] = useState(recipe.servings || 2);
    const [baseIngredients, setBaseIngredients] = useState([]);

    useEffect(() => {
      if (recipe) {
        setBaseIngredients(recipe.recipeIngredients);
        setPortionCount(recipe.servings || 2);
      }
    }, [recipe]);
    
  return (
    <Modal show={show} onHide={onHide} centered size="xl" dialogClassName="recipe-detail-modal">
      <Modal.Body className="p-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h2>{recipe.title}</h2>
            <div className="text-muted d-flex gap-3">
              <span><Clock size={16} /> {recipe.prepTime} min</span>
              <span><Coffee size={16} /> {recipe.cookTime} min</span>
              {recipe.restTime && <span><Loader size={16} /> {recipe.restTime} min</span>}
            </div>
            <div className="mt-2">
              {recipe.tagIds?.map((tag, idx) => (
                <span key={idx} className="badge bg-secondary me-1">{tag.label}</span>
              ))}
            </div>
          </div>
          <img src={recipe.image || avatar2} alt={recipe.title} style={{ width: 200, borderRadius: 10 }} />
        </div>

        {/* Description */}
        <Card className="mb-4">
          <Card.Header className="fw-bold fs-6">À propos de la recette</Card.Header>
          <Card.Body>
            <p>{recipe.description}</p>
          </Card.Body>
        </Card>



        <Row>
        {/* Ingrédients */}
          <Col md={5}>
            <Card className="mb-4">
              <Card.Header className="fw-bold fs-6">Ingrédients 
                {/* (pour {recipe.servings} personnes) */}
                
                
                </Card.Header>
                <Card.Body>
  <div className="d-flex align-items-center gap-3 mb-3">
    <span>Pour :</span>
    <strong>{portionCount} Portion{portionCount > 1 ? 's' : ''}</strong>
    <button className="btn btn-outline-secondary" onClick={() => setPortionCount(p => Math.max(1, p - 1))}>−</button>
    <button className="btn btn-outline-secondary" onClick={() => setPortionCount(p => p + 1)}>+</button>
  </div>

  <ul className="recipe-list mb-0">
    {recipe.recipeIngredients?.map((ing, i) => {
      const baseQuantity = ing.quantity || 0;
      const baseServings = recipe.servings || 1;
      const adjustedQuantity = ((baseQuantity * portionCount) / baseServings).toFixed(2);

      return (
        <li key={i}>
          {ing.ingredientId?.name || ing.name} : {adjustedQuantity} {ing.unit}
        </li>
      );
    })}
  </ul>
</Card.Body>

            </Card>

            <Card className="mb-4">
              <Card.Header className="fw-bold fs-6">Matériel</Card.Header>
              <Card.Body>
                <ul className="recipe-list mb-0">
                  {recipe.equipmentIds?.map((eq, i) => (
                    <li key={i}>{eq.name}</li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          </Col>

          {/* Macronutriments */}
          <Col md={7}>
            {recipe.nutrition && (
              <Card className="mb-4">
                <Card.Header className="fw-bold fs-6">Macronutriments</Card.Header>

                <Card.Body>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th></th>
                        <th>Par portion</th>
                        <th>Pour 100g</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <span className={`badge badge-primary badge-indicator badge-indicator-lg me-2 ${getColorClassForNutrient("calories")}`} />
                          Calories
                        </td>
                        <td>{recipe.nutrition.caloriesPerPortion} kcal</td>
                        <td>{recipe.nutrition.caloriesPer100g} kcal</td>
                      </tr>
                      <tr>
                        <td>
                          <span className={`badge badge-primary badge-indicator badge-indicator-lg me-2 ${getColorClassForNutrient("proteins")}`} />
                          Protéines
                        </td>
                        <td>{recipe.nutrition.proteinsPerPortion} g</td>
                        <td>{recipe.nutrition.proteinsPer100g} g</td>
                      </tr>
                      <tr>
                        <td>
                          <span className={`badge badge-primary badge-indicator badge-indicator-lg me-2 ${getColorClassForNutrient("carbs")}`} />
                          Glucides
                        </td>
                        <td>{recipe.nutrition.carbsPerPortion} g</td>
                        <td>{recipe.nutrition.carbsPer100g} g</td>
                      </tr>
                      <tr>
                        <td>
                          <span className={`badge badge-primary badge-indicator badge-indicator-lg me-2 ${getColorClassForNutrient("fats")}`} />
                          Lipides
                        </td>
                        <td>{recipe.nutrition.fatsPerPortion} g</td>
                        <td>{recipe.nutrition.fatsPer100g} g</td>
                      </tr>
                    </tbody>

                  </Table>
                </Card.Body>
              </Card>
            )} 
            
          </Col>
        </Row>

        <Row>
          {/*Instructions*/}
          <Col md={12}>
            <Card className="mb-4">
              <Card.Header className="fw-bold fs-6">Préparation</Card.Header>
              <Card.Body>
              {recipe.steps?.map((step, i) => (
                <div key={i} className="mb-3">
                  <h5>{step.sectionTitle || `Étape ${step.order}`}</h5>
                  {step.instructions?.map((instruction, j) => (
                    <p key={j} className="mb-0">• {instruction}</p>
                  ))}
                </div>
              ))}

              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default RecipeDetails;
