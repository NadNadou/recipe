import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllIngredients,
  getAllEquipments,
  getAllTags,
} from '../../../redux/action/MetaData';
import { updateRecipe, getRecipeDetail, getAllRecipes } from '../../../redux/action/Recipes';
import { Link } from 'react-feather';

const UpdateRecipeModal = ({ show, onClose, recipeId }) => {
  const dispatch = useDispatch();

  const { ingredients, equipments, tags, cookingUnits } = useSelector(
    state => state.metadataReducer
  );

  const { recipeDetail, recipes } = useSelector(state => state.recipeReducer);

  const [recipeData, setRecipeData] = useState(null);

  useEffect(() => {
    dispatch(getAllIngredients());
    dispatch(getAllEquipments());
    dispatch(getAllTags());
    dispatch(getAllRecipes());
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
        linkedRecipeIds: recipeDetail.linkedRecipeIds?.map(r => r._id || r) || [],
        imageFile: null,
        imagePreview: recipeDetail.image || '',
      });
    }
  }, [recipeDetail]);

  const handleRecipeChange = (field, value) => {
    setRecipeData(prev => ({ ...prev, [field]: value }));
  };

  const handleIngredientChange = (index, field, value) => {
    setRecipeData(prev => {
      const updatedIngredients = prev.recipeIngredients.map((ing, i) => {
        if (i === index) {
          return { ...ing, [field]: value }; // ✅ deep clone de l'ingrédient
        }
        return ing;
      });
      return { ...prev, recipeIngredients: updatedIngredients };
    });
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
    const payload = JSON.parse(JSON.stringify(recipeData));
    delete payload.imagePreview;
  
    payload.recipeIngredients = payload.recipeIngredients.map(ing => {
      if (ing.ingredientId === 'new' && ing.name) {
        return { name: ing.name, quantity: ing.quantity, unit: ing.unit, isNew: true };
      }
      return ing;
    });
  
    payload.tagIds = payload.tagIds.map(tag => {
      if (typeof tag === 'string') {
        return tag;
      } else if (tag.label && !tag._id) {
        return { label: tag.label, isNew: true };
      }
      return tag._id; // cas normal
    });
  
    payload.equipmentIds = payload.equipmentIds.map(eq => {
      if (typeof eq === 'string') {
        return eq;
      } else if (eq.name && !eq._id) {
        return { name: eq.name, isNew: true };
      }
      return eq._id; // cas normal
    });

    // Filtrer les recettes liées valides
    payload.linkedRecipeIds = (payload.linkedRecipeIds || []).filter(id => id && typeof id === 'string');

    formData.append('data', JSON.stringify(payload));
  
    if (recipeData.imageFile) {
      formData.append('image', recipeData.imageFile);
    }
  
    // console.log('Payload préparé pour envoi :', payload);
  
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
                {ingredients
                  .filter(ing => {
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



              {ingredient.newIngredientName !== undefined && (
                  <div className="mt-2 d-flex gap-2">
                    <Form.Control
                      type="text"
                      placeholder="Nom du nouvel ingrédient"
                      value={ingredient.newIngredientName}
                      onChange={e => handleIngredientChange(index, 'newIngredientName', e.target.value)}
                    />
                    <Button
                      variant="outline-success"
                      size="sm"
                      onClick={() => {
                        const updatedIngredients = [...recipeData.recipeIngredients];
                        updatedIngredients[index] = {
                          ingredientName: updatedIngredients[index].newIngredientName,
                          quantity: '',
                          unit: '',
                        };
                        setRecipeData(prev => ({
                          ...prev,
                          recipeIngredients: updatedIngredients,
                        }));
                      }}
                    >
                      OK
                    </Button>
                  </div>
                )}



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
                    <option key={idx} value={unit.label}>
                      {unit.label}
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

          <div className="title title-xs title-wth-divider text-primary text-uppercase my-4">
            <span>Tags</span>
          </div>

          <Form.Group className="mb-3">
            <div className="d-flex flex-wrap gap-2">
            {recipeData.tagIds.map((tagId, index) => {
              const tag = tags.find(t => t._id === (tagId._id || tagId));

              if (!tag && typeof tagId === 'object' && tagId.label) {
                return (
                  <span key={`new-tag-${index}`} className="badge bg-warning d-flex align-items-center">
                    {tagId.label} (Nouveau)
                    <Button
                      size="sm"
                      variant="link"
                      className="text-white p-0 ps-2"
                      onClick={() =>
                        setRecipeData(prev => ({
                          ...prev,
                          tagIds: prev.tagIds.filter((_, idx) => idx !== index),
                        }))
                      }
                    >
                      ✕
                    </Button>
                  </span>
                );
              }

              if (!tag) return null;

              return (
                <span key={tag._id || index} className="badge bg-primary d-flex align-items-center">
                  {tag.label}
                  <Button
                    size="sm"
                    variant="link"
                    className="text-white p-0 ps-2"
                    onClick={() =>
                      setRecipeData(prev => ({
                        ...prev,
                        tagIds: prev.tagIds.filter((_, idx) => idx !== index),
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
              if (selectedId === "new") {
                setRecipeData(prev => ({
                  ...prev,
                  tagIds: [...prev.tagIds, { newLabel: '' }],
                }));
              } else {
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
            <option value="new">+ Ajouter un nouveau tag</option>
          </Form.Select>

          {recipeData.tagIds.map((tag, idx) => {
            if (typeof tag === 'object' && tag.newLabel !== undefined && !tag.validated) {
              return (
                <Form.Group key={`new-tag-${idx}`} className="mb-2">
                  <Form.Label>Nom du nouveau tag</Form.Label>
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="text"
                      value={tag.newLabel}
                      onChange={(e) => {
                        const updatedTags = [...recipeData.tagIds];
                        updatedTags[idx].newLabel = e.target.value;
                        setRecipeData(prev => ({
                          ...prev,
                          tagIds: updatedTags,
                        }));
                      }}
                      placeholder="Ex: Vegan, Rapide, Healthy..."
                    />
                    <Button
                      variant="outline-success"
                      onClick={() => {
                        const updatedTags = [...recipeData.tagIds];
                        updatedTags[idx] = {
                          label: updatedTags[idx].newLabel,
                          validated: true,
                        };
                        delete updatedTags[idx].newLabel;
                        setRecipeData(prev => ({
                          ...prev,
                          tagIds: updatedTags,
                        }));
                      }}
                    >
                      OK
                    </Button>
                  </div>
                </Form.Group>
              );
            }
            return null;
          })}



          <div className="title title-xs title-wth-divider text-primary text-uppercase my-4">
            <span>Equipements</span>
          </div>

          <Form.Group className="mb-3">
            <div className="d-flex flex-wrap gap-2">
            {recipeData.equipmentIds.map((equip, index) => {
              const equipId = typeof equip === 'object' ? equip._id : equip;
              const equipment = equipments.find(eq => eq._id === equipId);
              if (!equipment && typeof equip === 'object' && equip.name) {
                return (
                  <span key={index} className="badge bg-warning d-flex align-items-center">
                    {equip.name} (Nouveau)
                    <Button
                      size="sm"
                      variant="link"
                      className="text-white p-0 ps-2"
                      onClick={() =>
                        setRecipeData(prev => ({
                          ...prev,
                          equipmentIds: prev.equipmentIds.filter((e, i) => i !== index),
                        }))
                      }
                    >
                      ✕
                    </Button>
                  </span>
                );
              }
              
              // (ensuite continue le flow normal pour les vrais équipements)
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
            <Form.Select
              value=""
              onChange={(e) => {
                const selectedId = e.target.value;
                if (selectedId === "new") {
                  // Ajouter un champ vide pour créer un nouvel équipement
                  setRecipeData(prev => ({
                    ...prev,
                    equipmentIds: [...prev.equipmentIds, { newName: '' }],
                  }));
                } else {
                  // Ajouter un équipement existant
                  const selectedEquipment = equipments.find(eq => eq._id === selectedId);
                  if (selectedEquipment && !recipeData.equipmentIds.some(eq => (typeof eq === 'object' ? eq._id === selectedEquipment._id : eq === selectedEquipment._id))) {
                    setRecipeData(prev => ({
                      ...prev,
                      equipmentIds: [...prev.equipmentIds, selectedEquipment],
                    }));
                  }
                }
              }}
            >
              <option value="">-- Ajouter un équipement --</option>
              {equipments
                .filter(eq => !recipeData.equipmentIds.some(e => (typeof e === 'object' ? e._id === eq._id : e === eq._id)))
                .map(eq => (
                  <option key={eq._id} value={eq._id}>
                    {eq.name}
                  </option>
                ))}
              <option value="new">+ Ajouter un nouvel équipement</option>
            </Form.Select>
          </Form.Group>

          {recipeData.equipmentIds.map((eq, idx) => {
            if (typeof eq === 'object' && eq.newName !== undefined && !eq.validated) {
              return (
                <Form.Group key={`new-equipment-${idx}`} className="mb-2">
                  <Form.Label>Nom du nouvel équipement</Form.Label>
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="text"
                      value={eq.newName}
                      onChange={(e) => {
                        const updatedEquipments = [...recipeData.equipmentIds];
                        updatedEquipments[idx].newName = e.target.value;
                        setRecipeData(prev => ({
                          ...prev,
                          equipmentIds: updatedEquipments,
                        }));
                      }}
                      placeholder="Ex: Marmite, Blender..."
                    />
                    <Button
                      variant="outline-success"
                      onClick={() => {
                        const updatedEquipments = [...recipeData.equipmentIds];
                        updatedEquipments[idx] = {
                          ...updatedEquipments[idx],
                          name: updatedEquipments[idx].newName,
                          validated: true,
                        };
                        delete updatedEquipments[idx].newName;
                        setRecipeData(prev => ({
                          ...prev,
                          equipmentIds: updatedEquipments,
                        }));
                      }}
                    >
                      OK
                    </Button>
                  </div>
                </Form.Group>
              );
            }
            return null;
          })}

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

          <div className="title title-xs title-wth-divider text-primary text-uppercase my-4">
            <span><Link size={14} className="me-1" />Recettes liées</span>
          </div>

          <Form.Group className="mb-3">
            <div className="d-flex flex-wrap gap-2 mb-3">
              {recipeData.linkedRecipeIds?.map((linkedId, index) => {
                const linkedRecipe = recipes.find(r => r._id === linkedId);
                if (!linkedRecipe) return null;
                return (
                  <span key={linkedId} className="badge bg-info d-flex align-items-center">
                    {linkedRecipe.title}
                    <Button
                      size="sm"
                      variant="link"
                      className="text-white p-0 ps-2"
                      onClick={() =>
                        setRecipeData(prev => ({
                          ...prev,
                          linkedRecipeIds: prev.linkedRecipeIds.filter((_, i) => i !== index),
                        }))
                      }
                    >
                      ✕
                    </Button>
                  </span>
                );
              })}
            </div>

            <Form.Select
              value=""
              onChange={e => {
                const selectedId = e.target.value;
                if (selectedId && !recipeData.linkedRecipeIds?.includes(selectedId)) {
                  setRecipeData(prev => ({
                    ...prev,
                    linkedRecipeIds: [...(prev.linkedRecipeIds || []), selectedId],
                  }));
                }
              }}
            >
              <option value="">-- Ajouter une recette liée --</option>
              {recipes
                .filter(r => r._id !== recipeId && !recipeData.linkedRecipeIds?.includes(r._id))
                .map(r => (
                  <option key={r._id} value={r._id}>
                    {r.title}
                  </option>
                ))}
            </Form.Select>
          </Form.Group>

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