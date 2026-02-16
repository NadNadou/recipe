import React, { useEffect, useState, useMemo } from 'react';
import SimpleBar from 'simplebar-react';
import { MoreVertical, Clock, AlignLeft, Search, ArrowUp, ArrowDown } from 'react-feather';
import { Badge, Button, Card, Col, Dropdown, Form, Modal, Row, Spinner, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import RecipeDetails from './RecipeDetails';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import UpdateRecipeModal from '../EditRecipe/UpdateRecipeModal';
import { getAllRecipes, getRecipeDetail, deleteRecipe, duplicateRecipe } from '../../../redux/action/Recipes';
import recipesApi from '../../../api/recipes';

import avatar2 from '../../../assets/img/avatar2.jpg';

const RecipeCardsBody = ({ activeTag, activeAppliance, showBatchOnly, showMissingNutrition, viewMode }) => {
    const reduxDispatch = useDispatch();
    const { recipes, updateRecipe, recipeDetail } = useSelector(state => state.recipeReducer);
    const cookingAppliances = useSelector(state => state.metadataReducer.cookingAppliances);

    const [searchTerm, setSearchTerm] = useState('');
    const [tableSortField, setTableSortField] = useState('title');
    const [tableSortDir, setTableSortDir] = useState('asc');

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedRecipeId, setSelectedRecipeId] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);

    // Bulk selection state
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [bulkApplianceModal, setBulkApplianceModal] = useState(false);
    const [bulkAppliances, setBulkAppliances] = useState([]);
    const [bulkMode, setBulkMode] = useState('add');
    const [bulkLoading, setBulkLoading] = useState(false);

    useEffect(() => {
        reduxDispatch(getAllRecipes());
    }, [updateRecipe]);

    const handleDeleteClick = (id) => {
        setSelectedRecipeId(id);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        reduxDispatch(deleteRecipe(selectedRecipeId));
        setShowDeleteModal(false);
    };

    const handleShowDetails = (id) => {
        reduxDispatch(getRecipeDetail(id));
        setShowDetails(true);
    };

    const handleShowUpdate = (id) => {
        setSelectedRecipeId(id);
        setShowUpdate(true);
    };

    const handleDuplicate = (id) => {
        reduxDispatch(duplicateRecipe(id));
    };

    // Bulk selection handlers
    const toggleSelect = (id) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === filteredRecipes.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredRecipes.map(r => r._id)));
        }
    };

    const clearSelection = () => setSelectedIds(new Set());

    const handleBulkAssignAppliances = async () => {
        setBulkLoading(true);
        try {
            await recipesApi.bulkUpdateAppliances([...selectedIds], bulkAppliances, bulkMode);
            reduxDispatch(getAllRecipes());
            clearSelection();
            setBulkApplianceModal(false);
            setBulkAppliances([]);
        } catch (err) {
            console.error('Bulk appliance error:', err);
        } finally {
            setBulkLoading(false);
        }
    };

    const toggleBulkAppliance = (value) => {
        setBulkAppliances(prev =>
            prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
        );
    };

    const handleTableSort = (field) => {
        if (tableSortField === field) {
            setTableSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setTableSortField(field);
            setTableSortDir('asc');
        }
    };

    const hasMissingNutrition = (recipe) => {
        return !recipe.nutrition || !recipe.nutrition.calories || recipe.nutrition.calories === 0;
    };

    const getApplianceInfo = (value) => {
        return cookingAppliances.find(a => a.value === value) || { icon: '', label: value };
    };

    // Filter recipes
    const filteredRecipes = useMemo(() => {
        if (!recipes) return [];
        let filtered = [...recipes];

        // Search filter
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(r => r.title.toLowerCase().includes(term));
        }

        // Tag filter
        if (activeTag !== 'all') {
            filtered = filtered.filter(r =>
                (r.tagIds || []).some(tag => {
                    const tagId = typeof tag === 'object' ? tag._id : tag;
                    return tagId === activeTag;
                })
            );
        }

        // Appliance filter
        if (activeAppliance !== 'all') {
            filtered = filtered.filter(r =>
                (r.cookingAppliances || []).includes(activeAppliance)
            );
        }

        // Batch cooking filter
        if (showBatchOnly) {
            filtered = filtered.filter(r => r.isBatchCookingDefault);
        }

        // Missing nutrition filter
        if (showMissingNutrition) {
            filtered = filtered.filter(r => hasMissingNutrition(r));
        }

        // Sort A-Z by title
        filtered.sort((a, b) => a.title.localeCompare(b.title));

        return filtered;
    }, [recipes, searchTerm, activeTag, activeAppliance, showBatchOnly, showMissingNutrition]);

    // Sorted recipes for table view
    const sortedForTable = useMemo(() => {
        const sorted = [...filteredRecipes];
        sorted.sort((a, b) => {
            let valA, valB;
            switch (tableSortField) {
                case 'title':
                    valA = a.title.toLowerCase();
                    valB = b.title.toLowerCase();
                    break;
                case 'time':
                    valA = (a.prepTime || 0) + (a.cookTime || 0);
                    valB = (b.prepTime || 0) + (b.cookTime || 0);
                    break;
                case 'calories':
                    valA = a.nutrition?.caloriesPerPortion || 0;
                    valB = b.nutrition?.caloriesPerPortion || 0;
                    break;
                case 'ingredients':
                    valA = a.recipeIngredients?.length || 0;
                    valB = b.recipeIngredients?.length || 0;
                    break;
                default:
                    valA = a.title.toLowerCase();
                    valB = b.title.toLowerCase();
            }
            if (valA < valB) return tableSortDir === 'asc' ? -1 : 1;
            if (valA > valB) return tableSortDir === 'asc' ? 1 : -1;
            return 0;
        });
        return sorted;
    }, [filteredRecipes, tableSortField, tableSortDir]);

    const SortIcon = ({ field }) => {
        if (tableSortField !== field) return null;
        return tableSortDir === 'asc'
            ? <ArrowUp size={12} className="ms-1" />
            : <ArrowDown size={12} className="ms-1" />;
    };

    const renderRecipeCard = (recipe) => (
        <Col key={recipe._id}>
            <Card className={`card-border contact-card d-flex flex-column ${selectedIds.has(recipe._id) ? 'border-primary' : ''}`} style={{ height: '100%' }}>
                <Card.Body className="text-center d-flex flex-column" style={{ flex: 1 }}>
                    <div className="position-absolute top-0 start-0 m-2" style={{ zIndex: 1 }}>
                        <Form.Check
                            type="checkbox"
                            checked={selectedIds.has(recipe._id)}
                            onChange={() => toggleSelect(recipe._id)}
                        />
                    </div>
                    <div className="card-action-wrap">
                        <Dropdown>
                            <Dropdown.Toggle variant="flush-dark" className="btn-icon btn-rounded flush-soft-hover no-caret">
                                <span className="btn-icon-wrap">
                                    <span className="feather-icon"><MoreVertical /></span>
                                </span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu align="end">
                                <Dropdown.Item onClick={() => handleShowUpdate(recipe._id)}>
                                    Update
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => handleDeleteClick(recipe._id)}>
                                    Delete
                                </Dropdown.Item>
                                <Dropdown.Item onClick={() => handleDuplicate(recipe._id)}>
                                    Duplicate
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>

                    {/* Image */}
                    <div className="avatar avatar-xl avatar-rounded mx-auto">
                        <img src={recipe.image || avatar2} alt={recipe.title} className="avatar-img" />
                    </div>

                    {/* Title */}
                    <div
                        className="user-name"
                        title={recipe.title}
                        style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            minHeight: '2.6em',
                            lineHeight: '1.3em',
                        }}
                    >
                        {recipe.title}
                    </div>

                    {/* Badges row: batch + tags + appliances - fixed height zone */}
                    <div style={{ minHeight: 48 }} className="d-flex flex-column align-items-center justify-content-center mt-1">
                        <div className="d-flex flex-wrap justify-content-center gap-1">
                            {recipe.isBatchCookingDefault && (
                                <Badge bg="info" pill style={{ fontSize: '0.6rem' }}>Batch</Badge>
                            )}
                            {recipe.tagIds?.slice(0, 2).map((tag, idx) => (
                                <Badge key={idx} bg="primary" pill style={{ fontSize: '0.6rem', fontWeight: 'normal' }}>
                                    {typeof tag === 'object' ? tag.label : tag}
                                </Badge>
                            ))}
                            {recipe.tagIds?.length > 2 && (
                                <Badge bg="secondary" pill style={{ fontSize: '0.6rem' }}>
                                    +{recipe.tagIds.length - 2}
                                </Badge>
                            )}
                        </div>
                        {recipe.cookingAppliances?.length > 0 && (
                            <div className="mt-1">
                                <small className="text-muted">
                                    {recipe.cookingAppliances.map(a => getApplianceInfo(a).icon).join(' ')}
                                </small>
                            </div>
                        )}
                    </div>

                    {/* Bottom info - pushed to bottom with mt-auto */}
                    <div className="mt-auto pt-2">
                        <small className="text-muted">
                            {recipe.nutrition && recipe.nutrition.caloriesPerPortion > 0
                                ? `${Math.round(recipe.nutrition.caloriesPerPortion)} kcal/portion`
                                : '\u00A0'
                            }
                        </small>
                        <div>
                            <small className="text-muted">
                                {recipe.recipeIngredients?.length || 0} ingredient{(recipe.recipeIngredients?.length || 0) !== 1 ? 's' : ''}
                            </small>
                        </div>
                    </div>
                </Card.Body>

                <Card.Footer className="text-muted position-relative mt-auto">
                    <div className="d-flex align-items-center">
                        <span className="feather-icon me-2"><Clock size={14} /></span>
                        <span className="fs-7 lh-1">{(recipe.prepTime || 0) + (recipe.cookTime || 0)} min</span>
                    </div>
                    <div className="v-separator-full m-0" />
                    <div
                        className="d-flex align-items-center"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleShowDetails(recipe._id)}
                    >
                        <span className="feather-icon me-2"><AlignLeft size={14} /></span>
                        <span className="fs-7 lh-1">Details</span>
                    </div>
                </Card.Footer>
            </Card>
        </Col>
    );

    return (
        <>
            <div className="contact-body">
                <SimpleBar className="nicescroll-bar">
                    <div className="contact-card-view">
                        {/* Toolbar */}
                        <Row className="mb-3 align-items-center">
                            <Col>
                                <div className="d-flex align-items-center gap-2 flex-wrap">
                                    <div className="position-relative" style={{ maxWidth: 300 }}>
                                        <Form.Control
                                            size="sm"
                                            type="search"
                                            placeholder="Search recipes..."
                                            value={searchTerm}
                                            onChange={e => setSearchTerm(e.target.value)}
                                            className="ps-4"
                                        />
                                        <Search size={14} className="position-absolute" style={{ top: '50%', left: 10, transform: 'translateY(-50%)', opacity: 0.4 }} />
                                    </div>

                                    <div className="d-flex align-items-center gap-2 ms-auto">
                                        {selectedIds.size > 0 && (
                                            <Badge bg="primary" pill className="me-1">{selectedIds.size} selected</Badge>
                                        )}
                                        <Button
                                            size="sm"
                                            variant={selectedIds.size > 0 ? 'outline-primary' : 'outline-secondary'}
                                            onClick={() => setBulkApplianceModal(true)}
                                            disabled={selectedIds.size === 0}
                                        >
                                            Assign appliances
                                        </Button>
                                        {selectedIds.size > 0 && (
                                            <Button size="sm" variant="outline-secondary" onClick={clearSelection}>
                                                Clear
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <div className="mb-2 text-end">
                            <small className="text-muted">
                                {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''}
                            </small>
                        </div>

                        {/* Grid View */}
                        {viewMode === 'grid' && (
                            <Row className="row-cols-xxl-5 row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-1 mb-5 gx-3 gy-3">
                                {filteredRecipes.map(renderRecipeCard)}
                            </Row>
                        )}

                        {/* Table View */}
                        {viewMode === 'table' && (
                            <Table striped hover responsive className="table-sm">
                                <thead>
                                    <tr>
                                        <th style={{ width: 40 }}>
                                            <Form.Check
                                                type="checkbox"
                                                checked={filteredRecipes.length > 0 && selectedIds.size === filteredRecipes.length}
                                                onChange={toggleSelectAll}
                                            />
                                        </th>
                                        <th style={{ cursor: 'pointer' }} onClick={() => handleTableSort('title')}>
                                            Title <SortIcon field="title" />
                                        </th>
                                        <th>Tags</th>
                                        <th>Appliances</th>
                                        <th style={{ cursor: 'pointer' }} onClick={() => handleTableSort('time')}>
                                            Time <SortIcon field="time" />
                                        </th>
                                        <th style={{ cursor: 'pointer' }} onClick={() => handleTableSort('calories')}>
                                            Kcal/p <SortIcon field="calories" />
                                        </th>
                                        <th style={{ cursor: 'pointer' }} onClick={() => handleTableSort('ingredients')}>
                                            Ing. <SortIcon field="ingredients" />
                                        </th>
                                        <th>Batch</th>
                                        <th>Status</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedForTable.map(recipe => (
                                        <tr
                                            key={recipe._id}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleShowUpdate(recipe._id)}
                                        >
                                            <td onClick={e => e.stopPropagation()}>
                                                <Form.Check
                                                    type="checkbox"
                                                    checked={selectedIds.has(recipe._id)}
                                                    onChange={() => toggleSelect(recipe._id)}
                                                />
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <img
                                                        src={recipe.image || avatar2}
                                                        alt=""
                                                        className="rounded"
                                                        style={{ width: 28, height: 28, objectFit: 'cover' }}
                                                    />
                                                    <span className="fw-semibold">{recipe.title}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="d-flex flex-wrap gap-1">
                                                    {recipe.tagIds?.slice(0, 2).map((tag, idx) => (
                                                        <Badge key={idx} bg="primary" pill style={{ fontSize: '0.6rem', fontWeight: 'normal' }}>
                                                            {typeof tag === 'object' ? tag.label : tag}
                                                        </Badge>
                                                    ))}
                                                    {recipe.tagIds?.length > 2 && (
                                                        <Badge bg="secondary" pill style={{ fontSize: '0.6rem' }}>
                                                            +{recipe.tagIds.length - 2}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </td>
                                            <td>
                                                <span style={{ fontSize: '0.85rem' }}>
                                                    {recipe.cookingAppliances?.map(a => getApplianceInfo(a).icon).join(' ') || '-'}
                                                </span>
                                            </td>
                                            <td>{(recipe.prepTime || 0) + (recipe.cookTime || 0)} min</td>
                                            <td>{recipe.nutrition?.caloriesPerPortion ? Math.round(recipe.nutrition.caloriesPerPortion) : '-'}</td>
                                            <td>{recipe.recipeIngredients?.length || 0}</td>
                                            <td>
                                                {recipe.isBatchCookingDefault
                                                    ? <Badge bg="info" style={{ fontSize: '0.6rem' }}>Yes</Badge>
                                                    : <span className="text-muted">-</span>
                                                }
                                            </td>
                                            <td>
                                                {hasMissingNutrition(recipe)
                                                    ? <Badge bg="warning" text="dark" style={{ fontSize: '0.65rem' }}>No data</Badge>
                                                    : <Badge bg="success" style={{ fontSize: '0.65rem' }}>OK</Badge>
                                                }
                                            </td>
                                            <td onClick={e => e.stopPropagation()}>
                                                <Dropdown>
                                                    <Dropdown.Toggle variant="flush-dark" size="sm" className="btn-icon btn-rounded flush-soft-hover no-caret">
                                                        <MoreVertical size={14} />
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu align="end">
                                                        <Dropdown.Item onClick={() => handleShowUpdate(recipe._id)}>
                                                            Update
                                                        </Dropdown.Item>
                                                        <Dropdown.Item onClick={() => handleDeleteClick(recipe._id)}>
                                                            Delete
                                                        </Dropdown.Item>
                                                        <Dropdown.Item onClick={() => handleDuplicate(recipe._id)}>
                                                            Duplicate
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}

                        {/* Empty state */}
                        {filteredRecipes.length === 0 && (
                            <div className="text-center text-muted py-5">
                                <p>No recipes found.</p>
                            </div>
                        )}
                    </div>
                </SimpleBar>
            </div>

            <RecipeDetails show={showDetails} onHide={() => setShowDetails(false)} recipe={recipeDetail} />

            <ConfirmDeleteModal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                onConfirm={handleConfirmDelete}
            />

            {showUpdate && (
                <UpdateRecipeModal
                    show={showUpdate}
                    recipeId={selectedRecipeId}
                    onClose={() => setShowUpdate(false)}
                    onUpdated={() => reduxDispatch(getAllRecipes())}
                />
            )}

            {/* Bulk Assign Appliances Modal */}
            <Modal show={bulkApplianceModal} onHide={() => !bulkLoading && setBulkApplianceModal(false)} centered>
                <Modal.Header closeButton={!bulkLoading}>
                    <Modal.Title>Assign appliances to {selectedIds.size} recipe{selectedIds.size > 1 ? 's' : ''}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Mode</Form.Label>
                        <Form.Select value={bulkMode} onChange={e => setBulkMode(e.target.value)} disabled={bulkLoading}>
                            <option value="add">Add to existing</option>
                            <option value="replace">Replace all</option>
                        </Form.Select>
                        <Form.Text className="text-muted">
                            {bulkMode === 'add' ? 'Selected appliances will be added without removing existing ones.' : 'All existing appliances will be replaced.'}
                        </Form.Text>
                    </Form.Group>

                    <Form.Label>Appliances</Form.Label>
                    <div className="d-flex flex-wrap gap-2">
                        {cookingAppliances.map(app => (
                            <Button
                                key={app.value}
                                size="sm"
                                variant={bulkAppliances.includes(app.value) ? 'primary' : 'outline-secondary'}
                                onClick={() => toggleBulkAppliance(app.value)}
                                disabled={bulkLoading}
                            >
                                {app.icon} {app.label}
                            </Button>
                        ))}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setBulkApplianceModal(false)} disabled={bulkLoading}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleBulkAssignAppliances}
                        disabled={bulkLoading || bulkAppliances.length === 0}
                    >
                        {bulkLoading ? <Spinner animation="border" size="sm" /> : 'Apply'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default RecipeCardsBody
