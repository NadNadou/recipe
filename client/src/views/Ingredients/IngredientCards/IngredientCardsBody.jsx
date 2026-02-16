import React, { useEffect, useState, useMemo } from 'react';
import SimpleBar from 'simplebar-react';
import { MoreVertical, AlignLeft, Search, ChevronDown, ChevronRight, ArrowUp, ArrowDown, Database } from 'react-feather';
import { Alert, Badge, Button, Card, Col, Dropdown, Form, Modal, ProgressBar, Row, Spinner, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import IngredientDetails from './IngredientDetails';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import UpdateIngredient from './../UpdateIngredient';
import { deleteIngredient, getAllIngredients, getIngredientDetail } from '../../../redux/action/MetaData';
import { getLabelForNutrient, getColorClassForNutrient } from '../../../utils/nutritionUtils';
import ingredientsApi from '../../../api/ingredients';

const IngredientCardsBody = ({ activeCategory, showMissingNutrition, showUnused, viewMode }) => {
    const reduxDispatch = useDispatch();

    const { ingredients, ingredientDetail } = useSelector(state => state.metadataReducer);
    const ingredientCategories = useSelector(state => state.metadataReducer.ingredientCategories);

    const [deleteError, setDeleteError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [collapsedCategories, setCollapsedCategories] = useState({});
    const [tableSortField, setTableSortField] = useState('name');
    const [tableSortDir, setTableSortDir] = useState('asc');

    // Bulk selection state
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [bulkCategoryModal, setBulkCategoryModal] = useState(false);
    const [bulkCategory, setBulkCategory] = useState('other');
    const [bulkLoading, setBulkLoading] = useState(false);
    const [bulkEnrichModal, setBulkEnrichModal] = useState(false);
    const [bulkEnrichResults, setBulkEnrichResults] = useState(null);

    useEffect(() => {
        reduxDispatch(getAllIngredients());
    }, []);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedIngredientId, setSelectedIngredientId] = useState(null);

    const handleDeleteClick = (id) => {
        setSelectedIngredientId(id);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await reduxDispatch(deleteIngredient(selectedIngredientId));
            setDeleteError(null);
            setShowDeleteModal(false);
        } catch (err) {
            setDeleteError("Impossible de supprimer : ingredient used in a recipe.");
        }
    };

    const [showDetails, setShowDetails] = useState(false);
    const [showUpdate, setShowUpdate] = useState(false);

    const handleShowDetails = (id) => {
        reduxDispatch(getIngredientDetail(id));
        setShowDetails(true);
    };

    const handleShowUpdate = (id) => {
        reduxDispatch(getIngredientDetail(id));
        setShowUpdate(true);
    };

    const toggleCategoryCollapse = (catValue) => {
        setCollapsedCategories(prev => ({ ...prev, [catValue]: !prev[catValue] }));
    };

    const handleTableSort = (field) => {
        if (tableSortField === field) {
            setTableSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setTableSortField(field);
            setTableSortDir('asc');
        }
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
        if (selectedIds.size === filteredIngredients.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredIngredients.map(i => i._id)));
        }
    };

    const clearSelection = () => setSelectedIds(new Set());

    const handleBulkAssignCategory = async () => {
        setBulkLoading(true);
        try {
            await ingredientsApi.bulkUpdateCategory([...selectedIds], bulkCategory);
            reduxDispatch(getAllIngredients());
            clearSelection();
            setBulkCategoryModal(false);
        } catch (err) {
            console.error('Bulk category error:', err);
        } finally {
            setBulkLoading(false);
        }
    };

    const handleBulkEnrich = async () => {
        setBulkLoading(true);
        setBulkEnrichResults(null);
        try {
            const response = await ingredientsApi.bulkEnrich([...selectedIds]);
            setBulkEnrichResults(response.data.results);
            reduxDispatch(getAllIngredients());
            clearSelection();
        } catch (err) {
            setBulkEnrichResults({ error: err.response?.data?.message || 'Error' });
        } finally {
            setBulkLoading(false);
        }
    };

    // Filter ingredients
    const filteredIngredients = useMemo(() => {
        if (!ingredients) return [];
        let filtered = [...ingredients];

        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(ing => ing.name.toLowerCase().includes(term));
        }
        if (activeCategory !== 'all') {
            filtered = filtered.filter(ing => (ing.category || 'other') === activeCategory);
        }
        if (showMissingNutrition) {
            filtered = filtered.filter(ing =>
                !ing.nutritionPer100g || ing.nutritionPer100g.calories === 0
            );
        }
        if (showUnused) {
            filtered = filtered.filter(ing =>
                !ing.usedInRecipes || ing.usedInRecipes.length === 0
            );
        }

        return filtered;
    }, [ingredients, searchTerm, activeCategory, showMissingNutrition, showUnused]);

    // Group by category for grid view
    const groupedIngredients = useMemo(() => {
        const groups = {};
        ingredientCategories.forEach(cat => { groups[cat.value] = []; });

        filteredIngredients.forEach(ing => {
            const cat = ing.category || 'other';
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(ing);
        });

        Object.keys(groups).forEach(key => {
            groups[key].sort((a, b) => a.name.localeCompare(b.name));
        });

        return groups;
    }, [filteredIngredients, ingredientCategories]);

    // Sorted ingredients for table view
    const sortedForTable = useMemo(() => {
        const sorted = [...filteredIngredients];
        sorted.sort((a, b) => {
            let valA, valB;
            switch (tableSortField) {
                case 'name':
                    valA = a.name.toLowerCase();
                    valB = b.name.toLowerCase();
                    break;
                case 'calories':
                    valA = a.nutritionPer100g?.calories || 0;
                    valB = b.nutritionPer100g?.calories || 0;
                    break;
                case 'proteins':
                    valA = a.nutritionPer100g?.proteins || 0;
                    valB = b.nutritionPer100g?.proteins || 0;
                    break;
                case 'carbs':
                    valA = a.nutritionPer100g?.carbs || 0;
                    valB = b.nutritionPer100g?.carbs || 0;
                    break;
                case 'fats':
                    valA = a.nutritionPer100g?.fats || 0;
                    valB = b.nutritionPer100g?.fats || 0;
                    break;
                case 'recipes':
                    valA = a.usedInRecipes?.length || 0;
                    valB = b.usedInRecipes?.length || 0;
                    break;
                default:
                    valA = a.name.toLowerCase();
                    valB = b.name.toLowerCase();
            }
            if (valA < valB) return tableSortDir === 'asc' ? -1 : 1;
            if (valA > valB) return tableSortDir === 'asc' ? 1 : -1;
            return 0;
        });
        return sorted;
    }, [filteredIngredients, tableSortField, tableSortDir]);

    const getCategoryInfo = (catValue) => {
        return ingredientCategories.find(c => c.value === catValue) || { icon: '', label: catValue, color: '#78909C' };
    };

    const hasMissingNutrition = (ing) => !ing.nutritionPer100g || ing.nutritionPer100g.calories === 0;

    const SortIcon = ({ field }) => {
        if (tableSortField !== field) return null;
        return tableSortDir === 'asc'
            ? <ArrowUp size={12} className="ms-1" />
            : <ArrowDown size={12} className="ms-1" />;
    };

    const renderIngredientCard = (ingredient) => (
        <Col key={ingredient._id}>
            <Card className={`card-border contact-card ${selectedIds.has(ingredient._id) ? 'border-primary' : ''}`}>
                <Card.Body className="text-center">
                    <div className="position-absolute top-0 start-0 m-2" style={{ zIndex: 1 }}>
                        <Form.Check
                            type="checkbox"
                            checked={selectedIds.has(ingredient._id)}
                            onChange={() => toggleSelect(ingredient._id)}
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
                                <Dropdown.Item onClick={() => handleShowUpdate(ingredient._id)}>
                                    Update
                                </Dropdown.Item>
                                <Dropdown.Item
                                    onClick={() => handleDeleteClick(ingredient._id)}
                                    disabled={ingredient.usedInRecipes?.length > 0}
                                    className={ingredient.usedInRecipes?.length > 0 ? 'text-muted' : ''}
                                >
                                    Delete
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>

                    <div
                        className="user-name"
                        title={ingredient.name}
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
                        {ingredient.name}
                    </div>

                    {hasMissingNutrition(ingredient) && (
                        <Badge bg="warning" text="dark" className="mt-1" style={{ fontSize: '0.65rem' }}>
                            No nutrition
                        </Badge>
                    )}

                    {ingredient.category && ingredient.category !== 'other' && (
                        <Badge
                            pill
                            className="mt-1"
                            style={{
                                backgroundColor: getCategoryInfo(ingredient.category).color,
                                fontSize: '0.65rem',
                                fontWeight: 'normal'
                            }}
                        >
                            {getCategoryInfo(ingredient.category).icon} {getCategoryInfo(ingredient.category).label}
                        </Badge>
                    )}

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

                    <div className="mt-2">
                        <small className="text-muted">
                            {ingredient.usedInRecipes?.length || 0} recipe{(ingredient.usedInRecipes?.length || 0) !== 1 ? 's' : ''}
                        </small>
                    </div>
                </Card.Body>

                <Card.Footer className="text-muted position-relative">
                    <div
                        className="d-flex align-items-center justify-content-center"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleShowDetails(ingredient._id)}
                    >
                        <span className="feather-icon me-2"><AlignLeft /></span>
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
                                            placeholder="Search ingredients..."
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
                                            onClick={() => setBulkCategoryModal(true)}
                                            disabled={selectedIds.size === 0}
                                        >
                                            Assign category
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant={selectedIds.size > 0 ? 'outline-success' : 'outline-secondary'}
                                            onClick={() => setBulkEnrichModal(true)}
                                            disabled={selectedIds.size === 0}
                                        >
                                            <Database size={14} className="me-1" />
                                            Enrich nutrition
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
                                {filteredIngredients.length} ingredient{filteredIngredients.length !== 1 ? 's' : ''}
                            </small>
                        </div>

                        {/* Grid View */}
                        {viewMode === 'grid' && (
                            <>
                                {activeCategory !== 'all' ? (
                                    <Row className="row-cols-xxl-5 row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-1 mb-5 gx-3">
                                        {filteredIngredients
                                            .sort((a, b) => a.name.localeCompare(b.name))
                                            .map(renderIngredientCard)
                                        }
                                    </Row>
                                ) : (
                                    ingredientCategories.map(cat => {
                                        const catIngredients = groupedIngredients[cat.value];
                                        if (!catIngredients || catIngredients.length === 0) return null;
                                        const isCollapsed = collapsedCategories[cat.value];

                                        return (
                                            <div key={cat.value} className="mb-4">
                                                <div
                                                    className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom"
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => toggleCategoryCollapse(cat.value)}
                                                >
                                                    <span className="feather-icon">
                                                        {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
                                                    </span>
                                                    <span style={{ fontSize: '1.1rem' }}>{cat.icon}</span>
                                                    <strong>{cat.label}</strong>
                                                    <Badge bg="light" text="dark" pill>
                                                        {catIngredients.length}
                                                    </Badge>
                                                </div>
                                                {!isCollapsed && (
                                                    <Row className="row-cols-xxl-5 row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-1 gx-3">
                                                        {catIngredients.map(renderIngredientCard)}
                                                    </Row>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </>
                        )}

                        {/* Table View */}
                        {viewMode === 'table' && (
                            <Table striped hover responsive className="table-sm">
                                <thead>
                                    <tr>
                                        <th style={{ width: 40 }}>
                                            <Form.Check
                                                type="checkbox"
                                                checked={filteredIngredients.length > 0 && selectedIds.size === filteredIngredients.length}
                                                onChange={toggleSelectAll}
                                            />
                                        </th>
                                        <th style={{ cursor: 'pointer' }} onClick={() => handleTableSort('name')}>
                                            Name <SortIcon field="name" />
                                        </th>
                                        <th>Category</th>
                                        <th style={{ cursor: 'pointer' }} onClick={() => handleTableSort('calories')}>
                                            Kcal <SortIcon field="calories" />
                                        </th>
                                        <th style={{ cursor: 'pointer' }} onClick={() => handleTableSort('proteins')}>
                                            P <SortIcon field="proteins" />
                                        </th>
                                        <th style={{ cursor: 'pointer' }} onClick={() => handleTableSort('carbs')}>
                                            C <SortIcon field="carbs" />
                                        </th>
                                        <th style={{ cursor: 'pointer' }} onClick={() => handleTableSort('fats')}>
                                            F <SortIcon field="fats" />
                                        </th>
                                        <th style={{ cursor: 'pointer' }} onClick={() => handleTableSort('recipes')}>
                                            Recipes <SortIcon field="recipes" />
                                        </th>
                                        <th>Status</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedForTable.map(ingredient => {
                                        const catInfo = getCategoryInfo(ingredient.category || 'other');
                                        return (
                                            <tr key={ingredient._id}>
                                                <td onClick={e => e.stopPropagation()}>
                                                    <Form.Check
                                                        type="checkbox"
                                                        checked={selectedIds.has(ingredient._id)}
                                                        onChange={() => toggleSelect(ingredient._id)}
                                                    />
                                                </td>
                                                <td
                                                    className="fw-semibold"
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => handleShowUpdate(ingredient._id)}
                                                >
                                                    {ingredient.name}
                                                </td>
                                                <td>
                                                    <span style={{ fontSize: '0.8rem' }}>
                                                        {catInfo.icon} {catInfo.label}
                                                    </span>
                                                </td>
                                                <td>{ingredient.nutritionPer100g?.calories || 0}</td>
                                                <td>{ingredient.nutritionPer100g?.proteins || 0}</td>
                                                <td>{ingredient.nutritionPer100g?.carbs || 0}</td>
                                                <td>{ingredient.nutritionPer100g?.fats || 0}</td>
                                                <td>{ingredient.usedInRecipes?.length || 0}</td>
                                                <td>
                                                    {hasMissingNutrition(ingredient)
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
                                                            <Dropdown.Item onClick={() => handleShowUpdate(ingredient._id)}>
                                                                Update
                                                            </Dropdown.Item>
                                                            <Dropdown.Item
                                                                onClick={() => handleDeleteClick(ingredient._id)}
                                                                disabled={ingredient.usedInRecipes?.length > 0}
                                                                className={ingredient.usedInRecipes?.length > 0 ? 'text-muted' : ''}
                                                            >
                                                                Delete
                                                            </Dropdown.Item>
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        )}

                        {filteredIngredients.length === 0 && (
                            <div className="text-center text-muted py-5">
                                <p>No ingredients found.</p>
                            </div>
                        )}
                    </div>
                </SimpleBar>
            </div>

            <IngredientDetails show={showDetails} onHide={() => setShowDetails(false)} ingredient={ingredientDetail} />

            <ConfirmDeleteModal
                show={showDeleteModal}
                onHide={() => {
                    setShowDeleteModal(false);
                    setDeleteError(null);
                }}
                onConfirm={handleConfirmDelete}
                errorMessage={deleteError}
            />

            {showUpdate && (
                <UpdateIngredient
                    show={showUpdate}
                    ingredient={ingredientDetail}
                    close={() => setShowUpdate(false)}
                    onUpdated={() => reduxDispatch(getAllIngredients())}
                />
            )}

            {/* Bulk Assign Category Modal */}
            <Modal show={bulkCategoryModal} onHide={() => !bulkLoading && setBulkCategoryModal(false)} centered>
                <Modal.Header closeButton={!bulkLoading}>
                    <Modal.Title>Assign category to {selectedIds.size} ingredient{selectedIds.size > 1 ? 's' : ''}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Category</Form.Label>
                        <Form.Select
                            value={bulkCategory}
                            onChange={e => setBulkCategory(e.target.value)}
                            disabled={bulkLoading}
                        >
                            {ingredientCategories.map((cat, idx) => (
                                <option key={idx} value={cat.value}>{cat.icon} {cat.label}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setBulkCategoryModal(false)} disabled={bulkLoading}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleBulkAssignCategory} disabled={bulkLoading}>
                        {bulkLoading ? <Spinner animation="border" size="sm" /> : 'Apply'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Bulk Enrich Nutrition Modal */}
            <Modal show={bulkEnrichModal} onHide={() => !bulkLoading && setBulkEnrichModal(false)} centered>
                <Modal.Header closeButton={!bulkLoading}>
                    <Modal.Title>Enrich nutrition</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {!bulkEnrichResults && !bulkLoading && (
                        <div className="text-center">
                            <p>
                                Enrich <strong>{selectedIds.size}</strong> ingredient{selectedIds.size > 1 ? 's' : ''} with
                                nutrition data from USDA / OpenFoodFacts.
                            </p>
                            <Alert variant="info" className="small">
                                This may take a few seconds per ingredient.
                            </Alert>
                        </div>
                    )}

                    {bulkLoading && (
                        <div className="text-center py-4">
                            <p>Enriching ingredients...</p>
                            <ProgressBar animated now={100} className="mb-3" />
                        </div>
                    )}

                    {bulkEnrichResults && !bulkEnrichResults.error && (
                        <div>
                            <Alert variant="success">Done!</Alert>
                            <div className="d-flex gap-3 mb-3">
                                <div className="text-center flex-fill">
                                    <h3 className="text-success mb-0">{bulkEnrichResults.success?.length || 0}</h3>
                                    <small className="text-muted">Enriched</small>
                                </div>
                                <div className="text-center flex-fill">
                                    <h3 className="text-warning mb-0">{bulkEnrichResults.failed?.length || 0}</h3>
                                    <small className="text-muted">Not found</small>
                                </div>
                            </div>
                            {bulkEnrichResults.failed?.length > 0 && (
                                <details className="mt-2">
                                    <summary className="text-muted small">Show failed</summary>
                                    <ul className="small mt-2">
                                        {bulkEnrichResults.failed.map((item, idx) => (
                                            <li key={idx}>{item.name}</li>
                                        ))}
                                    </ul>
                                </details>
                            )}
                        </div>
                    )}

                    {bulkEnrichResults?.error && (
                        <Alert variant="danger">{bulkEnrichResults.error}</Alert>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {!bulkEnrichResults && !bulkLoading && (
                        <>
                            <Button variant="secondary" onClick={() => setBulkEnrichModal(false)}>
                                Cancel
                            </Button>
                            <Button variant="primary" onClick={handleBulkEnrich}>
                                <Database size={16} className="me-1" />
                                Start enrichment
                            </Button>
                        </>
                    )}
                    {bulkEnrichResults && !bulkLoading && (
                        <Button variant="primary" onClick={() => {
                            setBulkEnrichModal(false);
                            setBulkEnrichResults(null);
                        }}>
                            Close
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default IngredientCardsBody
