import React, {useState} from 'react';
import { Button, Dropdown, Modal, ProgressBar, Alert } from 'react-bootstrap';
import classNames from 'classnames';
import { Archive, ChevronDown, ChevronUp, Plus, Grid, List, MoreVertical, RefreshCw, Star, User, Database } from 'react-feather';
import { connect, useDispatch } from 'react-redux';
import { toggleTopNav } from '../../redux/action/Theme';
import { getAllIngredients } from '../../redux/action/MetaData';
import HkTooltip from '../../components/@hk-tooltip/HkTooltip';

import CreateNewIngredient from './CreateNewIngredient';
import { useHistory } from 'react-router-dom';
import ingredientsApi from '../../api/ingredients';


const IngredientAppHeader = ({ topNavCollapsed, toggleTopNav, toggleSidebar, show, viewMode, onViewModeChange }) => {
    const history = useHistory();
    const dispatch = useDispatch();

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showCreateIngredient, setShowCreateIngredient] = useState(false);

    // Batch enrichment state
    const [showEnrichModal, setShowEnrichModal] = useState(false);
    const [enrichLoading, setEnrichLoading] = useState(false);
    const [enrichResults, setEnrichResults] = useState(null);

    const handleEnrichAll = async () => {
        setEnrichLoading(true);
        setEnrichResults(null);

        try {
            const response = await ingredientsApi.enrichAllIngredients(false);
            setEnrichResults(response.data.results);
            // Refresh ingredients list
            dispatch(getAllIngredients());
        } catch (err) {
            setEnrichResults({
                error: err.response?.data?.message || 'Erreur lors de l\'enrichissement'
            });
        } finally {
            setEnrichLoading(false);
        }
    };


    return (
        <header className="contact-header">
            <div className="d-flex align-items-center">
                <Dropdown>
                    <Dropdown.Toggle as="a" className="contactapp-title link-dark" href="#" >
                        <h1>Ingredients</h1>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item>
                            <span className="feather-icon dropdown-icon">
                                <User />
                            </span>
                            <span>All ingredients</span>
                        </Dropdown.Item>
                        <Dropdown.Item>
                            <span className="feather-icon dropdown-icon">
                                <Archive />
                            </span>
                            <span>Archive</span>
                        </Dropdown.Item>
                       
                    </Dropdown.Menu>
                </Dropdown>

                <Button variant="light" size="xs" className="btn-icon btn-rounded ms-2" onClick={() => setShowCreateIngredient(true)} >
                    <HkTooltip placement="top" title="Add ingredient">
                        <span className="feather-icon">
                            <Plus />
                        </span>
                    </HkTooltip>
                </Button>
            </div>
            <div className="contact-options-wrap">
                <Dropdown className="inline-block" >
                    <Dropdown.Toggle as="a" href="#" className="btn btn-icon btn-flush-dark flush-soft-hover no-caret active">
                        <span className="icon">
                            <span className="feather-icon">
                                {viewMode === 'table' ? <List /> : <Grid />}
                            </span>
                        </span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu align="end">
                        <Dropdown.Item
                            active={viewMode === 'table'}
                            onClick={() => onViewModeChange && onViewModeChange('table')}
                        >
                            <span className="feather-icon dropdown-icon"><List /></span>
                            <span>Table View</span>
                        </Dropdown.Item>
                        <Dropdown.Item
                            active={viewMode === 'grid'}
                            onClick={() => onViewModeChange && onViewModeChange('grid')}
                        >
                            <span className="feather-icon dropdown-icon"><Grid /></span>
                            <span>Grid View</span>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Button as="a" variant="flush-dark" className="btn-icon btn-rounded flush-soft-hover no-caret d-sm-inline-block d-none" href="#">
                    <HkTooltip title="Refresh" placement="top" >
                        <span className="icon">
                            <span className="feather-icon">
                                <RefreshCw />
                            </span>
                        </span>
                    </HkTooltip>
                </Button>
                <div className="v-separator d-lg-block d-none" />
                <Dropdown className="inline-block ms-1">
                    <Dropdown.Toggle as="a" href="#" className="btn btn-flush-dark btn-icon btn-rounded btn-flush-dark flush-soft-hover no-caret d-lg-inline-block d-none">
                        <HkTooltip placement="top" title="More">
                            <span className="icon">
                                <span className="feather-icon">
                                    <MoreVertical />
                                </span>
                            </span>
                        </HkTooltip>
                    </Dropdown.Toggle>
                    <Dropdown.Menu align="end">
                        <Dropdown.Item onClick={() => setShowEnrichModal(true)}>
                            <span className="feather-icon dropdown-icon">
                                <Database />
                            </span>
                            <span>Enrichir via OpenFoodFacts</span>
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item>
                            <span className="feather-icon dropdown-icon">
                                <Star />
                            </span>
                            <span>Stared Recipes</span>
                        </Dropdown.Item>
                        <Dropdown.Item>
                            <span className="feather-icon dropdown-icon">
                                <Archive />
                            </span>
                            <span>Archive Recipes</span>
                        </Dropdown.Item>

                    </Dropdown.Menu>
                </Dropdown>
                <Button as="a" href="#" className="btn-icon btn-flush-dark btn-rounded flush-soft-hover hk-navbar-togglable d-sm-inline-block d-none" onClick={() => toggleTopNav(!topNavCollapsed)} >
                    <HkTooltip placement={topNavCollapsed ? "bottom" : "top"} title="Collapse" >
                        <span className="icon">
                            <span className="feather-icon">
                                {
                                    topNavCollapsed ? <ChevronDown /> : <ChevronUp />
                                }
                            </span>
                        </span>
                    </HkTooltip>
                </Button>
            </div>
            <div className={classNames("hk-sidebar-togglable", { "active": show })} onClick={toggleSidebar} />

            <CreateNewIngredient show={showCreateModal} close={() => setShowCreateModal(false)} />
            <CreateNewIngredient show={showCreateIngredient} close={() => setShowCreateIngredient(false)} />

            {/* Batch Enrichment Modal */}
            <Modal show={showEnrichModal} onHide={() => !enrichLoading && setShowEnrichModal(false)} centered>
                <Modal.Header closeButton={!enrichLoading}>
                    <Modal.Title>Enrichir les ingrédients via OpenFoodFacts</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {!enrichResults && !enrichLoading && (
                        <div className="text-center">
                            <p>
                                Cette action va rechercher les données nutritionnelles pour tous les ingrédients
                                qui n'ont pas encore de macros renseignés.
                            </p>
                            <Alert variant="info" className="small">
                                Le processus peut prendre plusieurs minutes selon le nombre d'ingrédients.
                            </Alert>
                        </div>
                    )}

                    {enrichLoading && (
                        <div className="text-center py-4">
                            <p>Enrichissement en cours...</p>
                            <ProgressBar animated now={100} className="mb-3" />
                            <small className="text-muted">
                                Veuillez patienter, cette opération peut prendre du temps.
                            </small>
                        </div>
                    )}

                    {enrichResults && !enrichResults.error && (
                        <div>
                            <Alert variant="success">
                                Enrichissement terminé !
                            </Alert>
                            <div className="d-flex gap-3 mb-3">
                                <div className="text-center flex-fill">
                                    <h3 className="text-success mb-0">{enrichResults.success?.length || 0}</h3>
                                    <small className="text-muted">Enrichis</small>
                                </div>
                                <div className="text-center flex-fill">
                                    <h3 className="text-warning mb-0">{enrichResults.failed?.length || 0}</h3>
                                    <small className="text-muted">Non trouvés</small>
                                </div>
                            </div>

                            {enrichResults.failed?.length > 0 && (
                                <details className="mt-3">
                                    <summary className="text-muted small cursor-pointer">
                                        Voir les ingrédients non trouvés
                                    </summary>
                                    <ul className="small mt-2">
                                        {enrichResults.failed.map((item, idx) => (
                                            <li key={idx}>{item.name}</li>
                                        ))}
                                    </ul>
                                </details>
                            )}
                        </div>
                    )}

                    {enrichResults?.error && (
                        <Alert variant="danger">{enrichResults.error}</Alert>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {!enrichResults && !enrichLoading && (
                        <>
                            <Button variant="secondary" onClick={() => setShowEnrichModal(false)}>
                                Annuler
                            </Button>
                            <Button variant="primary" onClick={handleEnrichAll}>
                                <Database size={16} className="me-2" />
                                Lancer l'enrichissement
                            </Button>
                        </>
                    )}
                    {(enrichResults || enrichLoading) && !enrichLoading && (
                        <Button variant="primary" onClick={() => {
                            setShowEnrichModal(false);
                            setEnrichResults(null);
                        }}>
                            Fermer
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>

        </header>
    )
}

const mapStateToProps = ({ theme }) => {
    const { topNavCollapsed } = theme;
    return { topNavCollapsed }
};

export default connect(mapStateToProps, { toggleTopNav })(IngredientAppHeader);