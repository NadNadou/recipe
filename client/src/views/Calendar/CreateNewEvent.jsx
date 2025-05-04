import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fr } from 'date-fns/locale';

import { getAllRecipes } from '../../redux/action/Recipes';
import { createPlan } from '../../redux/action/Plans';

const CreateNewEvent = ({ show, hide }) => {
    const dispatch = useDispatch();

    const [start, setStart] = useState(new Date());


    useEffect(() => {
        dispatch(getAllRecipes());
    }, []);

    const { recipes } = useSelector(state => state.recipeReducer);
    const {mealTypes} = useSelector(state => state.metadataReducer);

    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [mealType, setMealType] = useState("Déjeuner");
    const [notes, setNotes] = useState("");
    const [servings, setServings] = useState(1);


    const handleSubmitPlan = (e) => {
        e.preventDefault();
      
        if (!selectedRecipe) return alert("Veuillez choisir une recette");
      
        const payload = {
            recipeId: selectedRecipe,
            date: start,
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
                <Form.Label>Recette</Form.Label>
                    <Form.Select
                    value={selectedRecipe || ""}
                    onChange={e => setSelectedRecipe(e.target.value)}
                    >
                    <option value="">-- Choisir une recette --</option>
                    {recipes?.map((r) => (
                        <option key={r._id} value={r._id}>{r.title}</option>
                    ))}
                    </Form.Select>
                    <Form.Label className="mt-3">Type de repas</Form.Label>
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
                        <Form.Label>Nombre de parts</Form.Label>
                        <Form.Control
                            type="number"
                            min={1}
                            value={servings}
                            onChange={(e) => setServings(Number(e.target.value))}
                        />
                    </Form.Group>


                    {selectedRecipe && (
                    <div className="mt-3 p-3 bg-light rounded">
                        <p><strong>Calories :</strong> {recipes.find(r => r._id === selectedRecipe)?.nutrition?.calories} kcal</p>
                        <p><strong>Protéines :</strong> {recipes.find(r => r._id === selectedRecipe)?.nutrition?.proteins} g</p>
                        <p><strong>Glucides :</strong> {recipes.find(r => r._id === selectedRecipe)?.nutrition?.carbs} g</p>
                        <p><strong>Lipides :</strong> {recipes.find(r => r._id === selectedRecipe)?.nutrition?.fats} g</p>
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

export default CreateNewEvent
