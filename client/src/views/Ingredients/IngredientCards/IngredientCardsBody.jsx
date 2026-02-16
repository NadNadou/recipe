import React, { useEffect, useState, useMemo } from 'react';
import SimpleBar from 'simplebar-react';
import { MoreVertical, AlignLeft, Search, ChevronDown, ChevronRight, ArrowUp, ArrowDown } from 'react-feather';
import { Badge, Card, Col, Dropdown, Form, Row, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import IngredientDetails from './IngredientDetails';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import UpdateIngredient from './../UpdateIngredient';
import { deleteIngredient, getAllIngredients, getIngredientDetail } from '../../../redux/action/MetaData';
import { getLabelForNutrient, getColorClassForNutrient } from '../../../utils/nutritionUtils';

const IngredientCardsBody = ({ activeCategory, showMissingNutrition, showUnused, viewMode }) => {
    const reduxDispatch = useDispatch();

    const { ingredients, ingredientDetail } = useSelector(state => state.metadataReducer);
    const ingredientCategories = useSelector(state => state.metadataReducer.ingredientCategories);

    const [deleteError, setDeleteError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [collapsedCategories, setCollapsedCategories] = useState({});
    const [tableSortField, setTableSortField] = useState('name');
    const [tableSortDir, setTableSortDir] = useState('asc');

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

    // Filter ingredients
    const filteredIngredients = useMemo(() => {
        if (!ingredients) return [];
        let filtered = [...ingredients];

        // Search filter
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(ing => ing.name.toLowerCase().includes(term));
        }

        // Category filter
        if (activeCategory !== 'all') {
            filtered = filtered.filter(ing => (ing.category || 'other') === activeCategory);
        }

        // Missing nutrition filter
        if (showMissingNutrition) {
            filtered = filtered.filter(ing =>
                !ing.nutritionPer100g || ing.nutritionPer100g.calories === 0
            );
        }

        // Unused filter
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

        // Sort ingredients A-Z within each group
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
            <Card className="card-border contact-card">
                <Card.Body className="text-center">
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

                    {/* Missing nutrition warning */}
                    {hasMissingNutrition(ingredient) && (
                        <Badge bg="warning" text="dark" className="position-absolute top-0 start-0 m-2" style={{ fontSize: '0.65rem' }}>
                            No nutrition
                        </Badge>
                    )}

                    {/* Name */}
                    <div className="user-name">{ingredient.name}</div>

                    {/* Category badge */}
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

                    {/* Nutrition values */}
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

                    {/* Recipe count */}
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
                            <Col xs={8}>
                                <div className="d-flex align-items-center gap-2">
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
                                </div>
                            </Col>
                            <Col xs={4} className="text-end">
                                <small className="text-muted">
                                    {filteredIngredients.length} ingredient{filteredIngredients.length !== 1 ? 's' : ''}
                                </small>
                            </Col>
                        </Row>

                        {/* Grid View */}
                        {viewMode === 'grid' && (
                            <>
                                {activeCategory !== 'all' ? (
                                    // Single category - flat grid
                                    <Row className="row-cols-xxl-5 row-cols-xl-4 row-cols-lg-3 row-cols-md-2 row-cols-1 mb-5 gx-3">
                                        {filteredIngredients
                                            .sort((a, b) => a.name.localeCompare(b.name))
                                            .map(renderIngredientCard)
                                        }
                                    </Row>
                                ) : (
                                    // All categories - grouped view
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
                                            <tr
                                                key={ingredient._id}
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handleShowUpdate(ingredient._id)}
                                            >
                                                <td className="fw-semibold">{ingredient.name}</td>
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

                        {/* Empty state */}
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
        </>
    )
}

export default IngredientCardsBody
