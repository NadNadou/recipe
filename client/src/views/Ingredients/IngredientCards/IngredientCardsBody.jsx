import React, { useEffect, useState } from 'react';
import SimpleBar from 'simplebar-react';
import { MoreVertical,Clock,AlignLeft} from 'react-feather';
import { Button, Card, Col, Dropdown, Form, Row } from 'react-bootstrap';
import {useDispatch,useSelector} from 'react-redux';
import classNames from 'classnames';
import IngredientDetails from './IngredientDetails';
import ConfirmDeleteModal from './ConfirmDeleteModal';

import UpdateIngredient from './../UpdateIngredient'

//Images
import avatar2 from '../../../assets/img/avatar2.jpg';
import { deleteIngredient, getAllIngredients,getIngredientDetail} from '../../../redux/action/MetaData';
import { getLabelForNutrient ,getColorClassForNutrient} from '../../../utils/nutritionUtils';

const IngredientCardsBody = () => {
    const reduxDispatch = useDispatch()

    const {ingredients,ingredientDetail} = useSelector(state =>state.metadataReducer)

    useEffect(() => {
        reduxDispatch(getAllIngredients());
    }, []);
// }, [updateRecipe]);

    const initial = false;
    const [multipleSelection, setMultipleSelection] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedIngredientId, setSelectedIngredientId] = useState(null);

    const handleDeleteClick = (id) => {
        setSelectedIngredientId(id);
        setShowDeleteModal(true);
      };

    const handleConfirmDelete = () => {
        reduxDispatch(deleteIngredient(selectedIngredientId));
        setShowDeleteModal(false);
    };
      
      

    const [showDetails, setShowDetails] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);

    const handleShowDetails = (id) => {
        reduxDispatch(getIngredientDetail(id)); // récupère les détails
        setShowDetails(true); // affiche le modal
    };

    const handleShowUpdate = (id) => {
        reduxDispatch(getIngredientDetail(id));
        setShowUpdate(true);
    };

    const handleDuplicate = (id) =>{
        // reduxDispatch(duplicateRecipe(id))
        console.log(id)
    }
    
    return (
        <>
            <div className="contact-body">
                <SimpleBar className="nicescroll-bar">
                    <div className="collapse" id="collapseQuick">
                        <div className="quick-access-form-wrap">
                            <Form className="quick-access-form border">
                                <Row className="gx-3">
                                    <Col xxl={10}>
                                        <div className="position-relative">
                                            <div className="dropify-square">
                                                <input type="file" className="dropify-1" />
                                            </div>
                                            <Col md={12}>
                                                <Row className="gx-3">
                                                    <Col lg={4}>
                                                        <Form.Group>
                                                            <Form.Control placeholder="First name*" defaultValue type="text" />
                                                        </Form.Group>
                                                        <Form.Group>
                                                            <Form.Control placeholder="Last name*" defaultValue type="text" />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col lg={4}>
                                                        <Form.Group>
                                                            <Form.Control placeholder="Email Id*" defaultValue type="text" />
                                                        </Form.Group>
                                                        <Form.Group>
                                                            <Form.Control placeholder="Phone" defaultValue type="text" />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col lg={4}>
                                                        <Form.Group>
                                                            <Form.Control placeholder="Department" defaultValue type="text" />
                                                        </Form.Group>
                                                        <Form.Group>
                                                            <Form.Select id="input_tags" multiple >
                                                                <option>Collaborator</option>
                                                                <option>Designer</option>
                                                                <option>Developer</option>
                                                            </Form.Select>
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </div>
                                    </Col>
                                    <Col xxl={2}>
                                        <Form.Group>
                                            <button data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" className="btn btn-block btn-primary ">Create New
                                            </button>
                                        </Form.Group>
                                        <Form.Group>
                                            <button data-bs-toggle="collapse" disabled data-bs-target="#collapseExample" aria-expanded="false" className="btn btn-block btn-secondary">Discard
                                            </button>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </div>
                    <div className={classNames("contact-card-view", { "select-multiple": multipleSelection })}>
                        <Row className="mb-3" >
                            <Col xs={7} mb={3}>
                                <div className="contact-toolbar-left">
                                    <Form.Group className="d-xxl-flex d-none align-items-center mb-0">
                                        <Form.Select size='sm' className="w-120p">
                                            <option value={1}>Bulk actions</option>
                                            <option value={2}>Edit</option>
                                            <option value={3}>Move to trash</option>
                                        </Form.Select>
                                        <Button size="sm" variant="light" className="ms-2">Apply</Button>
                                    </Form.Group>
                                    <Form.Group className="d-xxl-flex d-none align-items-center mb-0">
                                        <label className="flex-shrink-0 mb-0 me-2">Sort by:</label>
                                        <Form.Select size='sm' className="w-130p">
                                            <option value={1}>Date Created</option>
                                            <option value={2}>Date Edited</option>
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Select size="sm" className="d-flex align-items-center w-130p">
                                        <option value={1}>Export to CSV</option>
                                        <option value={2}>Export to PDF</option>
                                    </Form.Select>
                                </div>
                            </Col>
                            <Col xs={5} mb={3}>
                                <div className="contact-toolbar-right">
                                    <div id="datable_1_filter" className="dataTables_filter">
                                        <label>
                                            <Form.Control size="sm" type="search" placeholder="Search" />
                                        </label>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row className="row-cols-xxl-5 row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-1 mb-5 gx-3">

                        {ingredients && ingredients.map((ingredient, index) => (                                
                            <Col key={ingredient._id || index}>
                                <Card className="card-border contact-card">
                                <Card.Body className="text-center">
                                    <div className="card-action-wrap">
                                        <Dropdown>
                                        <Dropdown.Toggle variant="flush-dark" className="btn-icon btn-rounded flush-soft-hover no-caret">
                                            <span className="btn-icon-wrap">
                                            <span className="feather-icon">
                                                <MoreVertical />
                                            </span>
                                            </span>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu align="end">
                                            <Dropdown.Item onClick={() => handleShowUpdate(ingredient._id)}>
                                            <i className="icon wb-reply" aria-hidden="true" />Update
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleDeleteClick(ingredient._id)}>
                                            <i className="icon wb-trash" aria-hidden="true" />Supprimer
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                        </Dropdown>
                                    </div>

                                    {/* Nom */}
                                    <div className="user-name">{ingredient.name}</div>

                                    {/* Propriétés nutritionnelles principales */}
                                    <div className="user-desg d-flex flex-wrap justify-content-center gap-1 mt-2">
                                        {ingredient.nutritionalProperties?.slice(0, 2).map((prop, idx) => (
                                        <span key={idx} className="badge bg-primary">{prop}</span>
                                        ))}
                                        {ingredient.nutritionalProperties?.length > 2 && (
                                        <span className="badge bg-secondary">+{ingredient.nutritionalProperties.length - 2}</span>
                                        )}
                                    </div>


                                    {/* Détail rapide des valeurs */}
                                    <div className="mt-3 d-flex flex-column align-items-left gap-2">
                                        {ingredient.nutritionPer100g && ['calories', 'proteins', 'carbs', 'fats'].map((macro, idx) => (
                                            <div key={idx} className="d-flex align-items-center gap-2">
                                            <div
                                                className={`badge ${getColorClassForNutrient(macro)} text-white rounded-circle`}
                                                style={{ width: 20, height: 20, fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            >
                                                {getLabelForNutrient(macro)}
                                            </div>
                                            <small className="text-dark">
                                                {macro === 'calories'
                                                ? `${ingredient.nutritionPer100g?.[macro]} kcal`
                                                : `${ingredient.nutritionPer100g?.[macro]} g`
                                                }
                                            </small>
                                            </div>
                                        ))}
                                    </div>


                                </Card.Body>

                                <Card.Footer className="text-muted position-relative">
                                    <div
                                    className="d-flex align-items-center justify-content-center"
                                    onClick={() => handleShowDetails(ingredient._id)}
                                    >
                                    <span className="feather-icon me-2"><AlignLeft /></span>
                                    <span className="fs-7 lh-1">Details</span>
                                    </div>
                                </Card.Footer>

                                </Card>
                            </Col>
                        ))}

                        </Row>

                        <Row>
                            <Col sm={12} md={5} className="d-flex align-items-center justify-content-center justify-content-md-start">
                                <div className="dataTables_info">1 - 10 of 30</div>
                            </Col>
                            <Col sm={12} md={7}>
                                <ul className="pagination custom-pagination pagination-simple mb-0 justify-content-center justify-content-md-end">
                                    <li className="paginate_button page-item previous disabled"><a href="#some" data-dt-idx={0} tabIndex={0} className="page-link"><i className="ri-arrow-left-s-line" /></a></li>
                                    <li className="paginate_button page-item active"><a href="#some" data-dt-idx={1} tabIndex={0} className="page-link">1</a></li>
                                    <li className="paginate_button page-item "><a href="#some" data-dt-idx={2} tabIndex={0} className="page-link">2</a></li>
                                    <li className="paginate_button page-item next"><a href="#some" data-dt-idx={4} tabIndex={0} className="page-link"><i className="ri-arrow-right-s-line" /></a></li>
                                </ul>
                            </Col>
                        </Row>
                    </div>
                </SimpleBar>
            </div>

            <IngredientDetails show={showDetails} onHide={() => setShowDetails(!showDetails)} ingredient={ingredientDetail} />

            <ConfirmDeleteModal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                onConfirm={handleConfirmDelete}
            />

            {showUpdate && (
            <UpdateIngredient
                show={showUpdate}
                ingredient={ingredientDetail}
                close={() => setShowUpdate(false)}
                onUpdated={() => reduxDispatch(getAllIngredients())}

            />
            )}


        </>
    )
}

export default IngredientCardsBody
