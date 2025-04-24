import React, { useState,useEffect } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';

import { useDispatch, useSelector } from 'react-redux';
import { createRecipe } from '../../redux/action/Recipes';
import {getAllIngredients,getAllEquipments,getAllTags,createTag} from "../../redux/action/MetaData"

const CreateNewRecipe = ({ show, close }) => {
    const dispatch = useDispatch();

    const [availableIngredients, setAvailableIngredients] = useState([]);
    const [availableEquipments, setAvailableEquipments] = useState([]);
    const [availableTags, setAvailableTags] = useState([]);
  
    const ingredientsFromStore = useSelector(state => state.metadataReducer.ingredients);
    const equipmentsFromStore = useSelector(state => state.metadataReducer.equipments);
    const tagsFromStore = useSelector(state => state.metadataReducer.tags);
    const cookingUnits = useSelector(state=> state.metadataReducer.cookingUnits)
  

    useEffect(() => {
        dispatch(getAllIngredients());
        dispatch(getAllEquipments());
        dispatch(getAllTags());
      }, []);
    

      useEffect(() => {
        setAvailableIngredients(ingredientsFromStore || []);
        setAvailableEquipments(equipmentsFromStore || []);
        setAvailableTags(tagsFromStore || []);
      }, [ingredientsFromStore, equipmentsFromStore, tagsFromStore]);


    const [recipeIngredients, setRecipeIngredients] = useState([
        { ingredientId: '', quantity: '', unit: '', isNew: false, newName: '' }
      ]);
      

    const [nutrition, setNutrition] = useState({
        calories: 0,
        proteins: 0,
        carbs: 0,
        fats: 0
      });
      
    const [recipeData, setRecipeData] = useState({
        title: '',
        description: '',
        servings: 2,
        prepTime: 0,
        cookTime: 0,
        restTime: 0,
        image: '',
        tagIds: [],
        equipmentIds: []
    });

    const [steps, setSteps] = useState([
        { sectionTitle: '', order: 1, instructions: [''] }
    ]);

    const handleRecipeChange = (field, value) => {
        setRecipeData({ ...recipeData, [field]: value });
    };

    const handleStepChange = (index, field, value) => {
        const updatedSteps = [...steps];
        updatedSteps[index][field] = value;
        setSteps(updatedSteps);
    };

    const handleInstructionChange = (stepIndex, instructionIndex, value) => {
        const updatedSteps = [...steps];
        updatedSteps[stepIndex].instructions[instructionIndex] = value;
        setSteps(updatedSteps);
    };

    const addStep = () => {
        setSteps([...steps, { sectionTitle: '', order: steps.length + 1, instructions: [''] }]);
    };

    const addInstruction = (stepIndex) => {
        const updatedSteps = [...steps];
        updatedSteps[stepIndex].instructions.push('');
        setSteps(updatedSteps);
    };

    const handleNutritionChange = (field, value) => {
        setNutrition({ ...nutrition, [field]: value });
      };
      
      const handleIngredientChange = (index, field, value) => {
        const updated = [...recipeIngredients];
        updated[index][field] = value;
        setRecipeIngredients(updated);
      };
    
      const addIngredient = () => {
        setRecipeIngredients([...recipeIngredients, { ingredientId: '', quantity: '', unit: '', newName: '' }]);
      };

      const removeInstruction = (stepIndex, instructionIndex) => {
        const updatedSteps = [...steps];
        updatedSteps[stepIndex].instructions.splice(instructionIndex, 1);
        setSteps(updatedSteps);
      };

      const removeStep = (indexToRemove) => {
        const updatedSteps = steps.filter((_, index) => index !== indexToRemove);
        setSteps(updatedSteps);
      };

      const getFilteredIngredients = (currentIndex) => {
        const selectedIds = recipeIngredients
          .filter((_, i) => i !== currentIndex)
          .map((i) => i.ingredientId)
          .filter((id) => id && id !== 'new');
      
        return availableIngredients.filter((ing) => !selectedIds.includes(ing._id));
      };

      const getFilteredEquipments = (currentIndex) => {
        const selectedIds = recipeData.equipmentIds
          .filter((_, i) => i !== currentIndex)
          .map(eq => typeof eq === 'object' ? null : eq)
          .filter(id => id); // ignore les objets ou valeurs nulles
      
        return availableEquipments.filter(eq => !selectedIds.includes(eq._id));
      };

      const getFilteredTags = (currentIndex) => {
        const selectedIds = recipeData.tagIds
          .filter((_, i) => i !== currentIndex)
          .map(tag => typeof tag === 'object' ? null : tag)
          .filter(id => id); // ignore les objets ou valeurs nulles
      
        return availableTags.filter(tag => !selectedIds.includes(tag._id));
      };
      
      
      
      
      
      

      const handleSubmit = async () => {
        const createdIngredientIds = await Promise.all(
          recipeIngredients
            .filter(i => i.ingredientId === 'new' && i.newName)
            .map(async ing => {
              const res = await dispatch(createIngredient({ name: ing.newName }));
              return res.payload._id;
            })
        );
      
        const updatedIngredients = recipeIngredients.map(ing => ({
          ingredientId: ing.ingredientId === 'new' ? createdIngredientIds.shift() : ing.ingredientId,
          quantity: ing.quantity,
          unit: ing.unit
        }));
      
        // Équipements
        const createdEquipments = await Promise.all(
          recipeData.equipmentIds
            .filter(id => typeof id === 'object' && id.newName)
            .map(async eq => {
              const res = await dispatch(createEquipment({ name: eq.newName }));
              return res.payload._id;
            })
        );
        const equipmentIds = recipeData.equipmentIds.map(eq =>
          typeof eq === 'object' && eq.newName ? createdEquipments.shift() : eq
        );
      
        // Tags
        const createdTags = await Promise.all(
          recipeData.tagIds
            .filter(id => typeof id === 'object' && id.newName)
            .map(async tag => {
              const res = await dispatch(createTag({ name: tag.newName }));
              return res.payload._id;
            })
        );
        const tagIds = recipeData.tagIds.map(tg =>
          typeof tg === 'object' && tg.newName ? createdTags.shift() : tg
        );
      
        // 🔄 Crée l'objet FormData
        const formData = new FormData();
        const recipePayload = {
          ...recipeData,
          tagIds,
          equipmentIds,
          steps,
          nutrition,
          recipeIngredients: updatedIngredients
        };

  
      
        formData.append("data", JSON.stringify(recipePayload));

        if (recipeData.imageFile) {
          formData.append("image", recipeData.imageFile); // 👈 fichier brut
        }

        dispatch(createRecipe(formData));

        // Réinitialiser les champs
        setRecipeData({
            title: '',
            description: '',
            servings: 2,
            prepTime: 0,
            cookTime: 0,
            restTime: 0,
            image: '',
            imageFile: null,
            tagIds: [],
            equipmentIds: [],
        });
        setRecipeIngredients([{ ingredientId: '', quantity: '', unit: '', isNew: false, newName: '' }]);
        setNutrition({ calories: 0, proteins: 0, carbs: 0, fats: 0 });
        setSteps([{ sectionTitle: '', order: 1, instructions: [''] }]);
        
        close();
      };

    return (
        <Modal show={show} onHide={close} centered size="lg" className="add-new-contact" >
            <Modal.Body>
                <Button bsPrefix="btn-close" onClick={close}>
                    <span aria-hidden="true">×</span>
                </Button>
                <h5 className="mb-4">Créer une nouvelle recette</h5>
                <Form>
                    <Row className="gx-3">
                        <Col sm={12} className="mb-3">
                            <Form.Group>
                                <Form.Label>Titre</Form.Label>
                                <Form.Control type="text" value={recipeData.title} onChange={e => handleRecipeChange('title', e.target.value)} />
                            </Form.Group>
                        </Col>
                        <Col sm={12} className="mb-3">
                            <Form.Group>
                                <Form.Label>Description</Form.Label>
                                <Form.Control as="textarea" rows={3} value={recipeData.description} onChange={e => handleRecipeChange('description', e.target.value)} />
                            </Form.Group>
                        </Col>
                        
                    </Row>
                    <Row className="gx-3">
                        <Col sm={4}>
                            <Form.Group className="mb-3">
                            <Form.Label>Nombre de personnes</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                value={recipeData.servings}
                                onChange={e => handleRecipeChange('servings', e.target.value)}
                            />
                            </Form.Group>
                        </Col>
                    </Row>
                    <div className="title title-xs title-wth-divider text-primary text-uppercase my-4">
                        <span>Illustration</span>
                    </div>
                    <Form.Group className="mb-3"> 
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  const fileUrl = URL.createObjectURL(file);
                                  setRecipeData(prev => ({
                                    ...prev,
                                    image: fileUrl,
                                    imageFile: file // 🆕 fichier stocké ici
                                  }));
                                }
                              }}
                        />
                        {recipeData.image && (
                            <div className="mt-2">
                            <img
                                src={recipeData.image}
                                alt="Preview"
                                style={{ maxWidth: '100%', borderRadius: '8px' }}
                            />
                            </div>
                        )}
                    </Form.Group>

                    <Row className="gx-3">
                        <Col sm={4}><Form.Control type="number" placeholder="Préparation (min)" onChange={e => handleRecipeChange('prepTime', e.target.value)} /></Col>
                        <Col sm={4}><Form.Control type="number" placeholder="Cuisson (min)" onChange={e => handleRecipeChange('cookTime', e.target.value)} /></Col>
                        <Col sm={4}><Form.Control type="number" placeholder="Repos (min)" onChange={e => handleRecipeChange('restTime', e.target.value)} /></Col>
                    </Row>

                    <div className="title title-xs title-wth-divider text-primary text-uppercase my-4">
                <span>Nutrition</span>
                </div>
                <Row className="gx-3">
                <Col sm={3}>
                    <Form.Group>
                    <Form.Label>Calories</Form.Label>
                    <Form.Control type="number" value={nutrition.calories} onChange={e => handleNutritionChange('calories', e.target.value)} />
                    </Form.Group>
                </Col>
                <Col sm={3}>
                    <Form.Group>
                    <Form.Label>Protéines (g)</Form.Label>
                    <Form.Control type="number" value={nutrition.proteins} onChange={e => handleNutritionChange('proteins', e.target.value)} />
                    </Form.Group>
                </Col>
                <Col sm={3}>
                    <Form.Group>
                    <Form.Label>Glucides (g)</Form.Label>
                    <Form.Control type="number" value={nutrition.carbs} onChange={e => handleNutritionChange('carbs', e.target.value)} />
                    </Form.Group>
                </Col>
                <Col sm={3}>
                    <Form.Group>
                    <Form.Label>Lipides (g)</Form.Label>
                    <Form.Control type="number" value={nutrition.fats} onChange={e => handleNutritionChange('fats', e.target.value)} />
                    </Form.Group>
                </Col>
                </Row>

                <div className="title title-xs title-wth-divider text-primary text-uppercase my-4">
                <span>Équipements</span>
                </div>

                {recipeData.equipmentIds.map((equipment, index) => (
                <Row className="gx-2 mb-2" key={index}>
                    <Col sm={8}>
                    <Form.Select
                        value={typeof equipment === 'object' ? 'new' : equipment}
                        onChange={e => {
                        const updated = [...recipeData.equipmentIds];
                        updated[index] = e.target.value === 'new' ? { newName: '' } : e.target.value;
                        handleRecipeChange('equipmentIds', updated);
                        }}
                    >
                        <option value="">-- Sélectionner un équipement --</option>
                        {getFilteredEquipments(index).map(eq => (
                            <option key={eq._id} value={eq._id}>{eq.name}</option>
                        ))}

                        <option value="new">+ Ajouter un nouvel équipement</option>
                    </Form.Select>
                    </Col>
                    <Col sm={4}>
                    {typeof equipment === 'object' && (
                        <Form.Control
                        type="text"
                        placeholder="Nom du nouvel équipement"
                        value={equipment.newName || ''}
                        onChange={e => {
                            const updated = [...recipeData.equipmentIds];
                            updated[index] = { newName: e.target.value };
                            handleRecipeChange('equipmentIds', updated);
                        }}
                        />
                    )}
                    </Col>
                </Row>
                ))}

                <Button variant="outline-secondary" size="sm" onClick={() => {
                handleRecipeChange('equipmentIds', [...recipeData.equipmentIds, '']);
                }}>
                + Ajouter un équipement
                </Button>



                <div className="title title-xs title-wth-divider text-primary text-uppercase my-4">
                <span>Ingrédients</span>
                </div>
                {recipeIngredients.map((ingredient, index) => (
                    <Row className="gx-2 mb-3" key={index}>
                        <Col sm={4}>
                        <Form.Select
                            value={ingredient.ingredientId === 'new' ? 'new' : ingredient.ingredientId}
                            onChange={(e) => {
                            const val = e.target.value;
                            if (val === 'new') {
                                handleIngredientChange(index, 'ingredientId', 'new');
                                handleIngredientChange(index, 'newName', '');
                            } else {
                                handleIngredientChange(index, 'ingredientId', val);
                                handleIngredientChange(index, 'newName', '');
                            }
                            }}
                        >
                            <option value="">-- Sélectionner un ingrédient --</option>
                            {getFilteredIngredients(index).map((ing) => (
                                <option key={ing._id} value={ing._id}>{ing.name}</option>
                            ))}

                            <option value="new">+ Ajouter un nouvel ingrédient</option>
                        </Form.Select>

                        {ingredient.ingredientId === 'new' && (
                            <Form.Control
                            className="mt-2"
                            type="text"
                            placeholder="Nom du nouvel ingrédient"
                            value={ingredient.newName || ''}
                            onChange={(e) => handleIngredientChange(index, 'newName', e.target.value)}
                            />
                        )}
                        </Col>

                        <Col sm={4}>
                        <Form.Control
                            type="number"
                            placeholder="Quantité"
                            value={ingredient.quantity}
                            onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                        />
                        </Col>

                        <Col sm={4}>
                            <Form.Select
                                value={ingredient.unit}
                                onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                            >
                                <option value="">-- Unité --</option>
                                {cookingUnits.map((unit, i) => (
                                <option key={i} value={unit.label}>{unit.label}</option>
                                ))}
                            </Form.Select>
                        </Col>

                    </Row>
                    ))}
                    <Button variant="outline-secondary" size="sm" onClick={addIngredient}>
                    + Ajouter un ingrédient
                    </Button>




                    <div className="title title-xs title-wth-divider text-primary text-uppercase my-4">
                        <span>Étapes</span>
                    </div>
                    
                    {steps.map((step, index) => (
                        <div key={index} className="border p-3 mb-3">
                            <Row className="gx-2">
                                <Col sm={6}>
                                    <Form.Group className="mb-2">
                                        <Form.Label>Titre de la section</Form.Label>
                                        <Form.Control type="text" value={step.sectionTitle} onChange={e => handleStepChange(index, 'sectionTitle', e.target.value)} />
                                    </Form.Group>
                                </Col>
                                
                                <Col sm={6}>
                                    <Form.Group className="mb-2">
                                        <Form.Label>Ordre</Form.Label>
                                        <Form.Control type="number" value={step.order} onChange={e => handleStepChange(index, 'order', parseInt(e.target.value))} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            {step.instructions.map((instruction, i) => (
                                <Form.Group key={i} className="mb-2 d-flex align-items-start gap-2">
                                    <div className="flex-grow-1">
                                    <Form.Label>Instruction {i + 1}</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={instruction}
                                        onChange={(e) => handleInstructionChange(index, i, e.target.value)}
                                    />
                                    </div>
                                    <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => removeInstruction(index, i)}
                                    style={{ height: '38px', marginTop: '30px' }}
                                    >
                                    ✕
                                    </Button>
                                </Form.Group>
                            ))}


                            <Button size="sm" onClick={() => addInstruction(index)}>+ Ajouter une instruction</Button>


                                <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => removeStep(index)}
                                    style={{
                                    // position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    zIndex: 1,
                                    }}
                                >
                                    ✕ Supprimer l'étape
                                </Button>
                        </div>
                    ))}
                    <Button variant="outline-primary" onClick={addStep}>+ Ajouter une étape</Button>


                    <div className="title title-xs title-wth-divider text-primary text-uppercase my-4">
                        <span>Tags</span>
                    </div>

                    {recipeData.tagIds.map((tag, index) => (
                    <Row className="gx-2 mb-2" key={index}>
                        <Col sm={8}>
                        <Form.Select
                            value={typeof tag === 'object' ? 'new' : tag}
                            onChange={e => {
                            const updated = [...recipeData.tagIds];
                            updated[index] = e.target.value === 'new' ? { newName: '' } : e.target.value;
                            handleRecipeChange('tagIds', updated);
                            }}
                        >
                            <option value="">-- Sélectionner un tag --</option>
                            {getFilteredTags(index).map(t => (
                                <option key={t._id} value={t._id}>{t.label}</option>
                            ))}

                            <option value="new">+ Ajouter un nouveau tag</option>
                        </Form.Select>
                        </Col>
                        <Col sm={4}>
                        {typeof tag === 'object' && (
                            <Form.Control
                            type="text"
                            placeholder="Nom du nouveau tag"
                            value={tag.newName || ''}
                            onChange={e => {
                                const updated = [...recipeData.tagIds];
                                updated[index] = { newName: e.target.value };
                                handleRecipeChange('tagIds', updated);
                            }}
                            />
                        )}
                        </Col>
                    </Row>
                    ))}

                    <Button variant="outline-secondary" size="sm" onClick={() => {
                    handleRecipeChange('tagIds', [...recipeData.tagIds, '']);
                    }}>
                    + Ajouter un tag
                    </Button>


                </Form>
            </Modal.Body>
            <Modal.Footer className="align-items-center">
                <Button variant="secondary" onClick={close}>Annuler</Button>
                <Button variant="primary" onClick={handleSubmit}>Créer la recette</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateNewRecipe;