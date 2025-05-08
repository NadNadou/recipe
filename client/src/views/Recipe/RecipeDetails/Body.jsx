import React, { useState } from 'react';
import SimpleBar from 'simplebar-react';
import { Link } from 'react-router-dom';
import { Rating } from 'react-simple-star-rating';
import { Button, Card, Col, Container, Form, ListGroup, Nav, Row, Tab } from 'react-bootstrap';
import { Bookmark, ExternalLink, Share } from 'react-feather';
import ReviewModal from './ReviewModal';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import HkBadge from '../../../components/@hk-badge/@hk-badge';

//Images
import symbolAvatar1 from '../../../assets/img/symbol-avatar-1.png';
import symbolAvatar4 from '../../../assets/img/symbol-avatar-4.png';
import symbolAvatar12 from '../../../assets/img/symbol-avatar-12.png';
import symbolAvatar14 from '../../../assets/img/symbol-avatar-14.png';
import symbolAvatar15 from '../../../assets/img/symbol-avatar-15.png';
import symbolAvatar16 from '../../../assets/img/symbol-avatar-16.png';
import logoAvatar2 from '../../../assets/img/logo-avatar-2.png';
import logoAvatar10 from '../../../assets/img/logo-avatar-10.png';
import avatar2 from '../../../assets/img/avatar2.jpg';
import avatar3 from '../../../assets/img/avatar3.jpg';
import avatar4 from '../../../assets/img/avatar4.jpg';
import avatar7 from '../../../assets/img/avatar7.jpg';
import avatar8 from '../../../assets/img/avatar8.jpg';
import avatar13 from '../../../assets/img/avatar13.jpg';
import slide1 from '../../../assets/img/slide1.jpg';
import slide2 from '../../../assets/img/slide2.jpg';
import slide3 from '../../../assets/img/slide3.jpg';
import slide4 from '../../../assets/img/slide4.jpg';
import { getLabelForNutrient,getColorClassForNutrient } from '../../../utils/nutritionUtils';




const Body = ({detail}) => {

    const [showReviewModal, setShowReviewModal] = useState(false);

    console.log({detail})

    return (
        <>
           {detail &&  <div className="integrations-body">
                <SimpleBar className="nicescroll-bar">
                    <Container className="container mt-md-7 mt-3">
                        <Row>
                            <Col xxl={8} lg={7}>
                                <div className="media">
                                    <div className="media-head me-3">
                                        <div className="avatar avatar-logo">
                                            <span className="initial-wrap bg-success-light-5">
                                                <img src={detail.image} alt="logo" />
                                            </span>
                                        </div>
                                    </div>
                                    <div className="media-body">
                                       {/* Badges récapitulatifs */}
                                     {/* À propos de la recette */}
                                     <Card className="card-border mb-3">
                                            <Card.Body>
                                                <h5 className="mb-2">À propos de la recette</h5>
                                                <p className="mb-0">{detail.description}</p>
                                            </Card.Body>
                                        </Card>


                                    {/* Détail des temps */}
                                    <Row className="mb-4 text-center">
                                        <Col xs={4}>
                                            <div className="fs-7 text-muted">Préparation</div>
                                            <div className="fw-bold">{detail.prepTime} min</div>
                                        </Col>
                                        <Col xs={4}>
                                            <div className="fs-7 text-muted">Cuisson</div>
                                            <div className="fw-bold">{detail.cookTime} min</div>
                                        </Col>
                                        <Col xs={4}>
                                            <div className="fs-7 text-muted">Repos</div>
                                            <div className="fw-bold">{detail.restTime} min</div>
                                        </Col>
                                    </Row>

                                    </div>
                                </div>
                            </Col>
                            {/* <Col xxl={4} lg={5} className="mt-lg-0 mt-3">
                                <div className="d-flex mt-3">
                                    {detail.tagIds.map(a=>
                                      <HkBadge size="l" bg="warning" >
                                      <span style={{color:'black'}}>{a.label}</span>
                                    </HkBadge>
                                       
                                        
                                        )}
                                </div>
                            </Col> */}
                        </Row>
                        <div className="row">
                            <div className="col-xxl-8 col-lg-7">
                                <div className="product-detail-slider">
                                <div className="mt-6">
                                    <img 
                                        src={detail.image} 
                                        alt={detail.title} 
                                        className="img-fluid rounded" 
                                    />
                                </div>

                                </div>
                                <div className="separator" />
                                <Tab.Container defaultActiveKey="tabit1" >
                                    <Nav variant="pills" className="nav nav-light nav-pills-rounded justify-content-center">
                                        <Nav.Item>
                                            <Nav.Link eventKey="tabit1">
                                                <span className="nav-link-text">Recipe</span>
                                            </Nav.Link>
                                        </Nav.Item>
                                        {/* <Nav.Item>
                                            <Nav.Link eventKey="tabit2">
                                                <span className="nav-link-text">Comments</span>
                                            </Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="tabit3">
                                                <span className="nav-link-text">Reviews</span>
                                            </Nav.Link>
                                        </Nav.Item> */}
                                    </Nav>
                                    <Tab.Content className="py-7">
                                        <Tab.Pane eventKey="tabit1">
                                        <h5>Description</h5>
                                       
                                        {/* Préparation */}
                                        <Card.Body>
                                            <ol className="ps-3">
                                                {detail.steps.map((step, stepIdx) => (
                                                <li key={step.order} className="mb-3">
                                                    <strong className="d-block mb-2">{step.sectionTitle}</strong>
                                                    <ul className="ps-3">
                                                    {step.instructions.map((inst, idx) => {
                                                        const checkboxId = `step-${stepIdx}-inst-${idx}`;
                                                        return (
                                                        <li key={idx}>
                                                            <Form.Check 
                                                            type="checkbox"
                                                            id={checkboxId}
                                                            label={inst}
                                                            className="mb-1"
                                                            />
                                                        </li>
                                                        );
                                                    })}
                                                    </ul>
                                                </li>
                                                ))}
                                            </ol>
                                        </Card.Body>



                                        </Tab.Pane>
                                        {/* <Tab.Pane eventKey="tabit2">
                                            <div className="title title-lg"><span>3 Responses</span></div>
                                            <div className="comment-block">
                                                <Form className="mb-4">
                                                    <Form.Group>
                                                        <div className="media">
                                                            <div className="media-head">
                                                                <div className="avatar avatar-xs avatar-rounded">
                                                                    <img src={avatar4} alt="user" className="avatar-img" />
                                                                </div>
                                                            </div>
                                                            <div className="media-body">
                                                                <div className="form-inline">
                                                                    <Form.Control className="me-3" />
                                                                    <Button variant="primary">Post</Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Form.Group>
                                                </Form>
                                                <div className="media">
                                                    <div className="media-head">
                                                        <div className="avatar avatar-xs avatar-rounded">
                                                            <img src={avatar4} alt="user" className="avatar-img" />
                                                        </div>
                                                    </div>
                                                    <div className="media-body">
                                                        <div>
                                                            <span className="cm-name">Martin Luther</span>
                                                        </div>
                                                        <p>From there, you can run truffle compile, truffle migrate and truffle test to compile your contracts, deploy those contracts to the network, and run their associated unit tests.</p>
                                                        <div className="comment-action-wrap mt-3">
                                                            <span>3 hours ago</span>
                                                            <span className="comment-dot-sep">●</span>
                                                            <Link to="#">Reply</Link>
                                                            <span className="comment-dot-sep">●</span>
                                                            <Link to="#">Like</Link>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="separator separator-light" />
                                                <div className="media">
                                                    <div className="media-head">
                                                        <div className="avatar avatar-xs avatar-rounded">
                                                            <img src={avatar2} alt="user" className="avatar-img" />
                                                        </div>
                                                    </div>
                                                    <div className="media-body">
                                                        <div>
                                                            <span className="cm-name">Katherine Jones</span>
                                                        </div>
                                                        <p>Dynamically beautiful work done by Ashton Kutcher</p>
                                                        <div className="comment-action-wrap mt-3">
                                                            <span>3 hours ago</span>
                                                            <span className="comment-dot-sep">●</span>
                                                            <Link to="#">Reply</Link>
                                                            <span className="comment-dot-sep">●</span>
                                                            <Link to="#">Like</Link>
                                                        </div>
                                                        <div className="media">
                                                            <div className="media-head">
                                                                <div className="avatar avatar-xs avatar-rounded">
                                                                    <img src={avatar3} alt="user" className="avatar-img" />
                                                                </div>
                                                            </div>
                                                            <div className="media-body">
                                                                <div>
                                                                    <span className="cm-name">Ashton Kutche</span>
                                                                </div>
                                                                <p>Thank you :)</p>
                                                                <div className="comment-action-wrap mt-3">
                                                                    <span>3 hours ago</span>
                                                                    <span className="comment-dot-sep">●</span>
                                                                    <Link to="#">Reply</Link>
                                                                    <span className="comment-dot-sep">●</span>
                                                                    <Link to="#">Like</Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="separator separator-light" />
                                                <div className="media">
                                                    <div className="media-head">
                                                        <div className="avatar avatar-xs avatar-rounded">
                                                            <img src={avatar4} alt="user" className="avatar-img" />
                                                        </div>
                                                    </div>
                                                    <div className="media-body">
                                                        <div>
                                                            <span className="cm-name">Pheebee Fry</span>
                                                        </div>
                                                        <p>Like your lorem ipsum extra crispy? Then Bacon Ipsum is the placeholder text generator for you. Side of eggs and hashbrowns is optional, but recommended.</p>
                                                        <div className="comment-action-wrap mt-3">
                                                            <span>8 Feb, 2020</span>
                                                            <span className="comment-dot-sep">●</span>
                                                            <Link to="#">Reply</Link>
                                                            <span className="comment-dot-sep">●</span>
                                                            <Link to="#">Like</Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="tabit3">
                                            <div className="review-block">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="d-flex align-items-center">
                                                        <div className="title title-lg mb-0 me-3">
                                                            <span>User Reviews</span>
                                                        </div>
                                                        <Button variant="soft-primary" onClick={() => setShowReviewModal(!showReviewModal)} >Write a review</Button>
                                                    </div>
                                                    <div>
                                                        <Form.Select className="d-md-flex d-none">
                                                            <option value={0}>Helpful Reviews</option>
                                                            <option value={1}>Most Rated</option>
                                                            <option value={2}>Less Rated</option>
                                                            <option value={3}>Popular Reviews</option>
                                                        </Form.Select>
                                                    </div>
                                                </div>
                                                <div className="separator mt-4" />
                                                <div className="review">
                                                    <div className="media align-items-center">
                                                        <div className="media-head">
                                                            <div className="avatar avatar-xs avatar-rounded">
                                                                <img src={avatar7} alt="user" className="avatar-img" />
                                                            </div>
                                                        </div>
                                                        <div className="media-body">
                                                            <span className="cr-name">Martin Luther</span>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex flex-sm-nowrap flex-wrap mt-2 mb-1">
                                                        <Rating initialValue={4} readonly size="20" className="d-flex align-items-center me-2 mb-sm-0 mb-2" />
                                                        <div>for <span className="text-dark mx-1">Design Quality</span> <span className="fs-8">12 Jan, 2020</span></div>
                                                    </div>
                                                    <p>A handcrafted, small-batch, artisinal pour-over version of the classic lorem ipsum generator, Hipster Ipsum will give your mocks that blue collar touch.</p>
                                                    <div className="review-action-wrap mt-3">
                                                        <span className="me-1">Was this review helpful?</span>
                                                        <Button variant="outline-light me-1" size="xs">Yes</Button>
                                                        <Button variant="outline-light me-1" size="xs">No</Button>
                                                        <span className="review-dot-sep">●</span>
                                                        <Link to="#">Reply</Link>
                                                        <span className="review-dot-sep">●</span>
                                                        <Link to="#">Report abuse</Link>
                                                    </div>
                                                </div>
                                                <div className="separator separator-light" />
                                                <div className="review">
                                                    <div className="media align-items-center">
                                                        <div className="media-head">
                                                            <div className="avatar avatar-xs">
                                                                <img src={avatar8} alt="user" className="avatar-img rounded-circle" />
                                                            </div>
                                                        </div>
                                                        <div className="media-body">
                                                            <span className="cr-name">Katherine Jones</span>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex flex-sm-nowrap flex-wrap mt-2 mb-1">
                                                        <Rating initialValue={3} readonly size="20" className="d-flex align-items-center me-2 mb-sm-0 mb-2" />
                                                        <div>for <span className="text-dark mx-1">Customer Support</span> <span className="fs-8">10 Jan, 2020</span></div>
                                                    </div>
                                                    <p>Like your lorem ipsum extra crispy? Then Bacon Ipsum is the placeholder text generator for you. Side of eggs and hashbrowns is optional, but recommended. Sugary sweet lorem ipsum? You got it with Cupcake Ipsum, the only text generator that includes marshmallows, carrot cake, and perhaps even a cherry on top.</p>
                                                    <div className="review-action-wrap mt-3">
                                                        <span className="me-1">Was this review helpful?</span>
                                                        <Button variant="outline-light me-1" size="xs">Yes</Button>
                                                        <Button variant="outline-light me-1" size="xs">No</Button>
                                                        <span className="review-dot-sep">●</span>
                                                        <Link to="#">Reply</Link>
                                                        <span className="review-dot-sep">●</span>
                                                        <Link to="#">Report abuse</Link>
                                                    </div>
                                                </div>
                                                <div className="separator separator-light" />
                                                <div className="review">
                                                    <div className="media align-items-center">
                                                        <div className="media-head">
                                                            <div className="avatar avatar-xs">
                                                                <img src={avatar3} alt="user" className="avatar-img rounded-circle" />
                                                            </div>
                                                        </div>
                                                        <div className="media-body">
                                                            <span className="cr-name">Pheebee Fry</span>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex flex-sm-nowrap flex-wrap mt-2 mb-1">
                                                        <Rating initialValue={2} readonly size="20" className="d-flex align-items-center me-2 mb-sm-0 mb-2" />
                                                        <div>for <span className="text-dark mx-1">Design Quality</span> <span className="fs-8">31 Dec, 2020</span></div>
                                                    </div>
                                                    <p>A web generator and jQuery plugin, Delorean Ipsum uses the script from Back to the Future to generate quotable lorem ipsum text for every project, past or present.</p>
                                                    <div className="review-action-wrap mt-3">
                                                        <span className="me-1">Was this review helpful?</span>
                                                        <Button variant="outline-light me-1" size="xs">Yes</Button>
                                                        <Button variant="outline-light me-1" size="xs">No</Button>
                                                        <span className="review-dot-sep">●</span>
                                                        <Link to="#">Reply</Link>
                                                        <span className="review-dot-sep">●</span>
                                                        <Link to="#">Report abuse</Link>
                                                    </div>
                                                    <div className="review">
                                                        <div className="media align-items-center">
                                                            <div className="media-head">
                                                                <div className="avatar avatar-xs">
                                                                    <img src={avatar13} alt="user" className="avatar-img rounded-circle" />
                                                                </div>
                                                            </div>
                                                            <div className="media-body">
                                                                <span className="cr-name">Ashton Kutcher</span>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex flex-sm-nowrap flex-wrap mt-2 mb-1">
                                                            <div><span className="fs-8">1 Jan, 2020</span></div>
                                                        </div>
                                                        <p>Space, the final frontier. These are the voyages of the Starship Enterprise.</p>
                                                        <div className="review-action-wrap mt-3">
                                                            <span className="me-1">Was this review helpful?</span>
                                                            <Button variant="outline-light me-1" size="xs">Yes</Button>
                                                            <Button variant="outline-light me-1" size="xs">No</Button>
                                                            <span className="review-dot-sep">●</span>
                                                            <Link to="#">Reply</Link>
                                                            <span className="review-dot-sep">●</span>
                                                            <Link to="#">Report abuse</Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Tab.Pane> */}
                                    </Tab.Content>
                                </Tab.Container>
                            </div>
                            <Col xxl={4} lg={5}>
                                <div className="content-aside">
                                    <Card className="card-border mt-6">
                                        <Card.Body>
                                            <h6 className="mb-3">Ingrédients</h6>
                                            <ul className="list-unstyled">
                                            {detail.recipeIngredients.map((ing) => (
                                                <li key={ing.name} className="mb-1">▪ {ing.name} : {ing.quantity} {ing.unit}</li>
                                            ))}
                                            </ul>
                                        </Card.Body>
                                    </Card>

                                    <Card className="card-border mt-3">
                                        <Card.Body>
                                            <h6 className="mb-3">Matériel</h6>
                                            <ul className="list-unstyled">
                                            {detail.equipmentIds.map(eq => (
                                                <li key={eq._id}>▪ {eq.name}</li>
                                            ))}
                                            </ul>
                                        </Card.Body>
                                    </Card>

                                    <Card className="card-border">
                                        <Card.Body>
                                            <h6 className="mb-4">Macronutriments</h6>
                                            <table className="table table-sm mb-0">
                                                <thead>
                                                    <tr>
                                                    <th>Type</th>
                                                    <th>Par portion</th>
                                                    <th>Pour 100g</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {[
                                                    { label: 'Calories', key: 'calories' },
                                                    { label: 'Protéines', key: 'proteins' },
                                                    { label: 'Glucides', key: 'carbs' },
                                                    { label: 'Lipides', key: 'fats' }
                                                    ].map((nutrient, i) => (
                                                    <tr key={i}>
                                                        <td className="d-flex align-items-center">
                                                        <div
                                                            className={`rounded-circle me-2 ${getColorClassForNutrient(nutrient.key)}`}
                                                            style={{ width: 12, height: 12 }}
                                                        />
                                                        {nutrient.label}
                                                        </td>
                                                        <td>{detail.nutrition[`${nutrient.key}PerPortion`]} {nutrient.key === 'calories' ? 'kcal' : 'g'}</td>
                                                        <td>{detail.nutrition[`${nutrient.key}Per100g`]} {nutrient.key === 'calories' ? 'kcal' : 'g'}</td>
                                                    </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </Card.Body>
                                    </Card>
                                </div>
                            </Col>
                        </div>
                        <h6 className="text-center mt-10 mb-4">Similar recipe</h6>
                        <Row>
                            <Col xl={3} md={6}>
                                <Card className="card-border text-center">
                                    <Card.Body>
                                        <div className="avatar avatar-sm avatar-violet mb-3">
                                            <span className="initial-wrap">H</span>
                                        </div>
                                        <div className="app-name">Hencework</div>
                                        <div className="app-cat">Chat Application</div>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Rating initialValue={3} readonly size="20" className="d-flex align-items-center me-2" />
                                            <span className="fs-8">3,672</span>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col xl={3} md={6}>
                                <Card className="card-border text-center">
                                    <Card.Body>
                                        <div className="avatar avatar-sm avatar-logo mb-3">
                                            <span className="initial-wrap">
                                                <img src={symbolAvatar4} alt="logo" />
                                            </span>
                                        </div>
                                        <div className="app-name">Jampack</div>
                                        <div className="app-cat">Dashboard Template</div>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Rating initialValue={3} readonly size="20" className="d-flex align-items-center me-2" />
                                            <span className="fs-8">3,672</span>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col xl={3} md={6}>
                                <Card className="card-border text-center">
                                    <Card.Body>
                                        <div className="avatar avatar-sm avatar-logo mb-3">
                                            <span className="initial-wrap">
                                                <img src={symbolAvatar1} alt="logo" />
                                            </span>
                                        </div>
                                        <div className="app-name">Tinder</div>
                                        <div className="app-cat">Dating App</div>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Rating initialValue={4} readonly size="20" className="d-flex align-items-center me-2" />
                                            <span className="fs-8">3,672</span>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col xl={3} md={6}>
                                <Card className="card-border text-center">
                                    <Card.Body>
                                        <div className="avatar avatar-sm avatar-logo mb-3">
                                            <span className="initial-wrap">
                                                <img src={symbolAvatar16} alt="logo" />
                                            </span>
                                        </div>
                                        <div className="app-name">Github</div>
                                        <div className="app-cat">Developer Geek</div>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Rating initialValue={3.5} allowFraction readonly size="20" className="d-flex align-items-center me-2" />
                                            <span className="fs-8">3,672</span>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </SimpleBar>
            </div>}
            
        </>
    )
}

export default Body
