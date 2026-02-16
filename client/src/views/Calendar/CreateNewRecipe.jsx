import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fr } from 'date-fns/locale';

import { getAllRecipes } from '../../redux/action/Recipes';
import { createPlan } from '../../redux/action/Plans';

const CreateNewRecipe = ({ show, hide }) => {
    const dispatch = useDispatch();

    const [start, setStart] = useState(new Date());


    useEffect(() => {
        dispatch(getAllRecipes());
    }, []);

    const { recipes } = useSelector(state => state.recipeReducer);
    const {mealTypes} = useSelector(state => state.metadataReducer);

    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [mealType, setMealType] = useState("Lunch");
    const [notes, setNotes] = useState("");
    const [servings, setServings] = useState(1);


    const handleSubmitPlan = (e) => {
        e.preventDefault();

        if (!selectedRecipe) return alert("Veuillez choisir une recette");

        // Format date as YYYY-MM-DD to avoid timezone issues
        const dateStr = moment(start).format('YYYY-MM-DD');

        const payload = {
            recipeId: selectedRecipe,
            date: dateStr,
            mealType,
            notes,
            servings
          };


        dispatch(createPlan(payload))
          .then(() => {
            hide(); // ferme le modal seulement si succès-
          })
          .catch((err) => {
            console.error("❌ Erreur lors de la création du plan", err);
          });
      };
      

    const hideCalender = (ev, picker) => {
        picker.container.find(".calendar-table").hide();
    };

    return (
        <Modal show={show} onHide={hide} size="lg" centered >
            <Modal.Body>
                <Button bsPrefix='btn-close' onClick={hide} >
                    <span aria-hidden="true">×</span>
                </Button>
                <h5 className="mb-4">Plan new recipe</h5>
                <Form>
                <Form.Label>Recipe</Form.Label>
                    <Form.Select
                    value={selectedRecipe || ""}
                    onChange={e => setSelectedRecipe(e.target.value)}
                    >
                    <option value="">-- Choose a recipe --</option>
                    {recipes?.map((r) => (
                        <option key={r._id} value={r._id}>{r.title}</option>
                    ))}
                    </Form.Select>
                    <Form.Label className="mt-3">Meal type</Form.Label>
                    <Form.Select
                    value={mealType}
                    onChange={e => setMealType(e.target.value)}
                    >
                    {mealTypes.map((type) => (
                        <option key={type.value} value={type.label}>
                        {type.label}
                        </option>
                    ))}
                    </Form.Select>


                    <Form.Group className="mt-3">
                        <Form.Label>Number of servings</Form.Label>
                        <Form.Control
                            type="number"
                            min={1}
                            value={servings}
                            onChange={(e) => setServings(Number(e.target.value))}
                        />
                    </Form.Group>

                    {selectedRecipe && (
                    <div className="mt-3 p-3 bg-light rounded">
                        {(() => {
                            const recipe = recipes.find(r => r._id === selectedRecipe);
                            const nutrition = recipe?.nutrition || {};
                            const mealCal = Math.round((nutrition.caloriesPerPortion || 0) * servings);
                            const mealProt = Math.round((nutrition.proteinsPerPortion || 0) * servings);
                            const mealCarbs = Math.round((nutrition.carbsPerPortion || 0) * servings);
                            const mealFats = Math.round((nutrition.fatsPerPortion || 0) * servings);
                            return (
                                <>
                                    <p className="mb-1"><strong>🔥 Calories:</strong> {mealCal} kcal</p>
                                    <p className="mb-1"><strong>🥩 Proteins:</strong> {mealProt} g</p>
                                    <p className="mb-1"><strong>🍞 Carbs:</strong> {mealCarbs} g</p>
                                    <p className="mb-0"><strong>🧈 Fats:</strong> {mealFats} g</p>
                                    <small className="text-muted">For {servings} {servings > 1 ? 'portions' : 'portion'}</small>
                                </>
                            );
                        })()}
                    </div>
                    )}


                <Form.Group className="mb-3 mt-2 text-left">
                    <Form.Label className="mb-2">Date</Form.Label>
                    <div className="d-flex justify-content-center">
                        <DatePicker
                        selected={start}
                        onChange={(date) => setStart(date)}
                        dateFormat="dd/MM/yyyy"
                        locale={fr}
                        minDate={new Date()}
                        maxDate={new Date(new Date().setDate(new Date().getDate() + 28))}
                        inline
                        />
                    </div>
                </Form.Group>


                    <Form.Label className="mt-3">Notes</Form.Label>
                    <Form.Control 
                        as="textarea" 
                        rows={2} 
                        value={notes} 
                        onChange={(e) => setNotes(e.target.value)} 
                    />

                </Form>
            </Modal.Body>
            <Modal.Footer className="align-items-center">
                <Button variant="secondary" onClick={hide} >Discard</Button>
                <Button variant="primary" className="fc-addEventButton-button" onClick={handleSubmitPlan} >Add</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default CreateNewRecipe
