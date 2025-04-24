import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllIngredients,
  getAllEquipments,
  getAllTags,
  createTag,
} from '../../../redux/action/MetaData';
import { updateRecipe, getRecipeDetail } from '../../../redux/action/Recipes';

const UpdateRecipeModal = ({ show, onClose, recipeId }) => {
  const dispatch = useDispatch();

  const { ingredients, equipments, tags, cookingUnits } = useSelector(
    state => state.metadataReducer
  );

  const { recipeDetail } = useSelector(state => state.recipeReducer);

  const [recipeData, setRecipeData] = useState(null);

  useEffect(() => {
    dispatch(getAllIngredients());
    dispatch(getAllEquipments());
    dispatch(getAllTags());
  }, []);

  useEffect(() => {
    if (recipeId) {
      dispatch(getRecipeDetail(recipeId));
    }
  }, [recipeId]);


  useEffect(() => {
    if (!show) {
      setRecipeData(null); // réinitialise les données quand on ferme
    }
  }, [show]);
  



  useEffect(() => {
    if (recipeDetail && recipeDetail._id === recipeId) {
      setRecipeData({
        ...recipeDetail,
        imageFile: null,
        imagePreview: recipeDetail.image || '',
      });
    }
  }, [recipeDetail]);

  const handleRecipeChange = (field, value) => {
    setRecipeData(prev => ({ ...prev, [field]: value }));
  };

  const handleIngredientChange = (index, field, value) => {
    const updated = [...recipeData.recipeIngredients];
    updated[index][field] = value;
    setRecipeData(prev => ({ ...prev, recipeIngredients: updated }));
  };
  
  const addIngredient = () => {
    const newIngredient = { ingredientId: '', quantity: '', unit: '' };
    setRecipeData(prev => ({
      ...prev,
      recipeIngredients: [...prev.recipeIngredients, newIngredient],
    }));
  };
  
  const removeIngredient = (indexToRemove) => {
    const updated = recipeData.recipeIngredients.filter((_, i) => i !== indexToRemove);
    setRecipeData(prev => ({
      ...prev,
      recipeIngredients: updated,
    }));
  };
  
  const handleSubmit = async () => {
    const formData = new FormData();
    const payload = { ...recipeData };
    delete payload.imagePreview;

    formData.append('data', JSON.stringify(payload));
    if (recipeData.imageFile) {
      formData.append('image', recipeData.imageFile);
    }

    await dispatch(updateRecipe(recipeId, formData));
    onClose();
  };

  if (!recipeData) return null;

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Modifier la recette</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row className="mb-3">
            <Col>
              <Form.Label>Titre</Form.Label>
              <Form.Control
                value={recipeData.title}
                onChange={e => handleRecipeChange('title', e.target.value)}
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={recipeData.description}
                onChange={e => handleRecipeChange('description', e.target.value)}
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col sm={3}>
              <Form.Label>Personnes</Form.Label>
              <Form.Control
                type="number"
                value={recipeData.servings}
                onChange={e => handleRecipeChange('servings', e.target.value)}
              />
            </Col>
            <Col sm={3}>
              <Form.Label>Préparation</Form.Label>
              <Form.Control
                type="number"
                value={recipeData.prepTime}
                onChange={e => handleRecipeChange('prepTime', e.target.value)}
              />
            </Col>
            <Col sm={3}>
              <Form.Label>Cuisson</Form.Label>
              <Form.Control
                type="number"
                value={recipeData.cookTime}
                onChange={e => handleRecipeChange('cookTime', e.target.value)}
              />
            </Col>
            <Col sm={3}>
              <Form.Label>Repos</Form.Label>
              <Form.Control
                type="number"
                value={recipeData.restTime}
                onChange={e => handleRecipeChange('restTime', e.target.value)}
              />
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={e => {
                const file = e.target.files[0];
                if (file) {
                  const preview = URL.createObjectURL(file);
                  setRecipeData(prev => ({
                    ...prev,
                    imageFile: file,
                    imagePreview: preview,
                  }));
                }
              }}
            />
            {recipeData.imagePreview && (
              <img
                src={recipeData.imagePreview}
                alt="Preview"
                className="mt-2 rounded"
                style={{ maxWidth: '100%' }}
              />
            )}
          </Form.Group>

          <div className="title title-xs title-wth-divider text-primary text-uppercase my-4">
            <span>Ingrédients</span>
          </div>

          {recipeData.recipeIngredients.map((ingredient, index) => (
            <Row key={index} className="gx-2 mb-3">
              <Col sm={4}>
              <Form.Select
                value={ingredient.ingredientId}
                onChange={e => handleIngredientChange(index, 'ingredientId', e.target.value)}
              >
                <option value="">-- Sélectionner un ingrédient --</option>

                {ingredients
                  .filter(ing => {
                    // Exclure les ingrédients déjà sélectionnés, sauf celui de la ligne courante
                    const selectedIds = recipeData.recipeIngredients
                      .filter((_, i) => i !== index)
                      .map(i => i.ingredientId);

                    return !selectedIds.includes(ing._id);
                  })
                  .map(ing => (
                    <option key={ing._id} value={ing._id}>
                      {ing.name}
                    </option>
                  ))}
              </Form.Select>

              </Col>
              <Col sm={3}>
                <Form.Control
                  type="number"
                  placeholder="Quantité"
                  value={ingredient.quantity}
                  onChange={e => handleIngredientChange(index, 'quantity', e.target.value)}
                />
              </Col>
              <Col sm={3}>
                <Form.Select
                  value={ingredient.unit}
                  onChange={e => handleIngredientChange(index, 'unit', e.target.value)}
                >
                  <option value="">-- Unité --</option>
                  {cookingUnits.map((unit, idx) => (
                    <option key={idx} value={unit}>
                      {unit}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col sm={2}>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => removeIngredient(index)}
                >
                  ✕
                </Button>
              </Col>
            </Row>
          ))}

          <Button variant="outline-secondary" size="sm" onClick={addIngredient}>
            + Ajouter un ingrédient
          </Button>


          <Form.Group className="mb-3">
            <Form.Label>Tags sélectionnés</Form.Label>
            <div className="d-flex flex-wrap gap-2">
              {recipeData.tagIds.map(tagId => {
                const tag = tags.find(t => t._id === tagId._id);
                if (!tag) return null;

                return (
                  <span key={tagId} className="badge bg-primary d-flex align-items-center">
                    {tag.label}
                    <Button
                      size="sm"
                      variant="link"
                      className="text-white p-0 ps-2"
                      onClick={() =>
                        setRecipeData(prev => ({
                          ...prev,
                          tagIds: prev.tagIds.filter(id => id !== tagId),
                        }))
                      }
                    >
                      ✕
                    </Button>
                  </span>
                );
              })}
            </div>
          </Form.Group>

          <Form.Select
            onChange={e => {
              const selectedId = e.target.value;
              const selectedTag = tags.find(t => t._id === selectedId);
              if (
                selectedTag &&
                !recipeData.tagIds.some(t => t._id === selectedTag._id)
              ) {
                setRecipeData(prev => ({
                  ...prev,
                  tagIds: [...prev.tagIds, selectedTag],
                }));
              }
            }}
          >
            <option value="">-- Ajouter un tag --</option>
            {tags
              .filter(tag => !recipeData.tagIds.some(t => t._id === tag._id))
              .map(tag => (
                <option key={tag._id} value={tag._id}>
                  {tag.label}
                </option>
              ))}
          </Form.Select>



          <Form.Group className="mb-3">
            <Form.Label>Équipements sélectionnés</Form.Label>
            <div className="d-flex flex-wrap gap-2">
            {recipeData.equipmentIds.map((equip, index) => {
              const equipId = typeof equip === 'object' ? equip._id : equip;
              const equipment = equipments.find(eq => eq._id === equipId);
              if (!equipment) return null;

              return (
                <span key={equipId || index} className="badge bg-success d-flex align-items-center">
                  {equipment.name}
                  <Button
                    size="sm"
                    variant="link"
                    className="text-white p-0 ps-2"
                    onClick={() =>
                      setRecipeData(prev => ({
                        ...prev,
                        equipmentIds: prev.equipmentIds.filter(e => {
                          const id = typeof e === 'object' ? e._id : e;
                          return id !== equipId;
                        }),
                      }))
                    }
                  >
                    ✕
                  </Button>
                </span>
              );
            })}

            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Ajouter un équipement</Form.Label>
            <Form.Select
              onChange={e => {
                const selectedId = e.target.value;
                const selectedEquipment = equipments.find(eq => eq._id === selectedId);
                if (
                  selectedId &&
                  !recipeData.equipmentIds.some(eq => eq._id === selectedId)
                ) {
                  setRecipeData(prev => ({
                    ...prev,
                    equipmentIds: [...prev.equipmentIds, selectedEquipment],
                  }));
                }
              }}
            >
              <option value="">-- Ajouter un équipement --</option>
              {equipments
                .filter(eq => !recipeData.equipmentIds.some(e => e._id === eq._id))
                .map(eq => (
                  <option key={eq._id} value={eq._id}>
                    {eq.name}
                  </option>
                ))}
            </Form.Select>
          </Form.Group>


          <div className="title title-xs title-wth-divider text-primary text-uppercase my-4">
            <span>Étapes</span>
          </div>
          
            {recipeData.steps.map((step, index) => (
              <div key={index} className="border p-3 mb-3">

              <Button
                variant="outline-danger mb-2"
                size="sm"
                onClick={() => {
                  const updatedSteps = recipeData.steps.filter((_, i) => i !== index);
                  setRecipeData(prev => ({ ...prev, steps: updatedSteps }));
                }}
              >
                ✕ Supprimer l'étape
              </Button>
                
                <Row>
                  
                  <Col sm={6}>
                  
                    <Form.Group className="mb-2">
                      <Form.Label>Titre de la section</Form.Label>
                      <Form.Control
                        type="text"
                        value={step.sectionTitle}
                        onChange={e => {
                          const updatedSteps = [...recipeData.steps];
                          updatedSteps[index].sectionTitle = e.target.value;
                          setRecipeData(prev => ({ ...prev, steps: updatedSteps }));
                        }}
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group className="mb-2">
                      <Form.Label>Ordre</Form.Label>
                      <Form.Control
                        type="number"
                        value={step.order}
                        onChange={e => {
                          const updatedSteps = [...recipeData.steps];
                          updatedSteps[index].order = parseInt(e.target.value);
                          setRecipeData(prev => ({ ...prev, steps: updatedSteps }));
                        }}
                      />
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
                        onChange={e => {
                          const updatedSteps = [...recipeData.steps];
                          updatedSteps[index].instructions[i] = e.target.value;
                          setRecipeData(prev => ({ ...prev, steps: updatedSteps }));
                        }}
                      />
                    </div>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => {
                        const updatedSteps = [...recipeData.steps];
                        updatedSteps[index].instructions.splice(i, 1);
                        setRecipeData(prev => ({ ...prev, steps: updatedSteps }));
                      }}
                      style={{ height: '38px', marginTop: '30px' }}
                    >
                      ✕
                    </Button>
                  </Form.Group>
                ))}

<Button
  variant="outline-secondary"
  size="sm"
  className="mt-2"
  onClick={() => {
    const updatedSteps = [...recipeData.steps];
    updatedSteps[index].instructions.push('');
    setRecipeData(prev => ({ ...prev, steps: updatedSteps }));
  }}
>
  + Ajouter une instruction
</Button>





              </div>
            ))}

            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => {
                const newStep = { sectionTitle: '', order: recipeData.steps.length + 1, instructions: [''] };
                setRecipeData(prev => ({ ...prev, steps: [...prev.steps, newStep] }));
              }}
            >
              + Ajouter une étape
            </Button>

        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Annuler
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Enregistrer les modifications
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateRecipeModal;