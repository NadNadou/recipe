import React, { useState } from 'react';
import { faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';
import { Link, useHistory} from 'react-router-dom';
import CommanFooter1 from '../CommanFooter1';

import { register } from '../../../api/auth';

//Image
import logo from '../../../assets/img/logo-light.png';

const Signup = () => {
    const [email, setEmail] = useState("");
    const [name,setName] = useState("");
    const [username,setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await register({ name,  email, password });
            history.push("/auth/login");
        } catch (err) {
            setError("Email ou mot de passe incorrect.");
            console.error(err);
        }
    };

    return (
        <div className="hk-pg-wrapper pt-0 pb-xl-0 pb-5">
            <div className="hk-pg-body pt-0 pb-xl-0">
                <Container>
                    <Row>
                        <Col sm={10} className="position-relative mx-auto">
                            <div className="auth-content py-8">
                                <Form className="w-100" onSubmit={handleSubmit}>
                                    <Row>
                                        <Col xxl={5} xl={7} lg={8} sm={10} className="mx-auto">
                                            <div className="text-center mb-7">
                                                <Link className="navbar-brand me-0" to="/" >
                                                    <img className="brand-img d-inline-block" src={logo} alt="brand" />
                                                </Link>
                                            </div>
                                            <Card className="card-border">
                                                <Card.Body>
                                                    <h4 className="text-center mb-0">Sign Up to Recipe</h4>
                                                    <p className="p-xs mt-2 mb-4 text-center">
                                                        Already a member ? <Link to="login"><u>Sign In</u></Link>
                                                    </p>
                                                    <div className="title-sm title-wth-divider divider-center my-4"><span>Or</span></div>
                                                    <Row className="gx-3">
                                                        <Col lg={12} as={Form.Group} className="mb-3">
                                                            <Form.Label>Name</Form.Label>
                                                            <Form.Control 
                                                                placeholder="Enter your name"
                                                                value={name}
                                                                onChange={(e) =>
                                                                    setName(e.target.value)
                                                                }
                                                                required
                                                                type="text" 
                                                            />
                                                        </Col>
                                                        <Col lg={12} as={Form.Group} className="mb-3">
                                                            <Form.Label>Email</Form.Label>
                                                            <Form.Control 
                                                                placeholder="Enter your email id" 
                                                                type="email"
                                                                value={email}
                                                                onChange={(e) =>
                                                                    setEmail(e.target.value)
                                                                }
                                                                required
                                                            />
                                                        </Col>
                                                        <Col lg={12} as={Form.Group} className="mb-3">
                                                            <Form.Label>Password</Form.Label>
                                                            <InputGroup className="password-check">
                                                                <span className="input-affix-wrapper affix-wth-text">
                                                                    <Form.Control 
                                                                        placeholder="6+ characters"
                                                                        value={password}
                                                                        onChange={(e) =>
                                                                            setPassword(e.target.value)
                                                                        }
                                                                        required
                                                                        type={showPassword ? "text" : "password"} 
                                                                    />
                                                                    <Link to="#" className="input-suffix text-primary text-uppercase fs-8 fw-medium" onClick={() => setShowPassword(!showPassword)} >
                                                                        {showPassword
                                                                            ?
                                                                            <span>Hide</span>
                                                                            :
                                                                            <span>Show</span>
                                                                        }
                                                                    </Link>
                                                                </span>
                                                            </InputGroup>
                                                              {error && (
                                                                    <p className="text-danger text-center">{error}</p>
                                                                )}
                                                        </Col>
                                                    </Row>
                                                    <Form.Check id="logged_in" className="form-check-sm mb-3" >
                                                        <Form.Check.Input type="checkbox" defaultChecked />
                                                        <Form.Check.Label className="text-muted fs-7">
                                                            By creating an account you specify that you have read and agree with our <Link to="#">Tearms of use</Link> and <Link to="#">Privacy policy</Link>. We may keep you inform about latest updates through our default <Link to="#">notification settings</Link>
                                                        </Form.Check.Label>
                                                    </Form.Check>
                                                    <Button 
                                                        type='submit' 
                                                        variant='primary' 
                                                        className="btn-rounded btn-uppercase btn-block" 
                                                    >Create account</Button>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                </Form>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
            {/* Page Footer */}
            <CommanFooter1 />
        </div>

    )
}

export default Signup
