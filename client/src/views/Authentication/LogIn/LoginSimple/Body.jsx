import React, { useState } from 'react';
import { Button, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';
import { Eye, EyeOff } from 'react-feather';
import { Link,useHistory } from 'react-router-dom';
import logoutImg from '../../../../assets/img/macaroni-logged-out.png';

import { login as loginApi } from '../../../../api/auth';
import { useAuth } from '../../../../context/AuthContext';

const Body = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const history = useHistory();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await loginApi(email, password);
            login(res.data.user, res.data.token); // stocker dans le contexte
            history.push("/dashboard");
        } catch (err) {
            setError("Email ou mot de passe incorrect.");
            console.error(err);
        }
    };

    return (
        <div className="hk-pg-body">
            <Container>
                <Row>
                    <Col xl={7} lg={6} className="d-lg-block d-none v-separator separator-sm">
                        <div className="auth-content py-md-0 py-8">
                            <Row>
                                <Col xxl={9} xl={8} lg={11} className="text-center mx-auto">
                                    <img src={logoutImg} className="img-fluid w-sm-40 w-50 mb-3" alt="login" />
                                    <h3 className="mb-2">Dig into festive savings, Go Premium</h3>
                                    <p className="w-xxl-65 w-100 mx-auto">
                                        Save 20% on the premium membership plan by using the promo code "JAMPACK20"
                                    </p>
                                    <Button size="sm" variant="primary" className="btn-uppercase mt-4">Upgrade Now</Button>
                                    <p className="p-xs mt-5 text-light">
                                        All illustration are powered by
                                        <a href="https://icons8.com/ouch/" rel="noreferrer" target="_blank" className="text-light">
                                            <u> Icons8</u>
                                        </a>
                                    </p>
                                </Col>
                            </Row>
                        </div>
                    </Col>

                    <Col xl={5} lg={6} md={7} sm={10} className="position-relative mx-auto">
                        <div className="auth-content py-md-0 py-8">
                            <Form className="w-100" onSubmit={handleSubmit}>
                                <Row>
                                    <Col lg={10} className="mx-auto">
                                        <h4 className="mb-4">Sign in to your account</h4>

                                        {error && <p className="text-danger text-center">{error}</p>}

                                        <Row className="gx-3">
                                            <Col lg={12} as={Form.Group} className="mb-3">
                                                <div className="form-label-group">
                                                    <Form.Label>Email</Form.Label>
                                                </div>
                                                <Form.Control
                                                    placeholder="Enter your email"
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                />
                                            </Col>

                                            <Col lg={12} as={Form.Group} className="mb-3">
                                                <div className="form-label-group">
                                                    <Form.Label>Password</Form.Label>
                                                    <Link to="#" className="fs-7 fw-medium">Forgot Password ?</Link>
                                                </div>
                                                <InputGroup className="password-check">
                                                    <span className="input-affix-wrapper">
                                                        <Form.Control
                                                            placeholder="Enter your password"
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            type={showPassword ? "text" : "password"}
                                                            required
                                                        />
                                                        <Link to="#"
                                                            className="input-suffix text-muted"
                                                            onClick={() => setShowPassword(!showPassword)} >
                                                            <span className="feather-icon">
                                                                {showPassword ? <EyeOff className="form-icon" /> : <Eye className="form-icon" />}
                                                            </span>
                                                        </Link>
                                                    </span>
                                                </InputGroup>
                                            </Col>
                                        </Row>

                                        <div className="d-flex justify-content-center">
                                            <Form.Check id="logged_in" className="form-check-sm mb-3">
                                                <Form.Check.Input type="checkbox" defaultChecked />
                                                <Form.Check.Label className="text-muted fs-7">Keep me logged in</Form.Check.Label>
                                            </Form.Check>
                                        </div>

                                        <Button variant="primary" type="submit" className="btn-uppercase btn-block">
                                            Login
                                        </Button>

                                        <p className="p-xs mt-2 text-center">
                                            New to Jampack? <Link to="#"><u>Create new account</u></Link>
                                        </p>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Body;
