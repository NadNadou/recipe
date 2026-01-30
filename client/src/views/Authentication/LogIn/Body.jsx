import React, { useState } from 'react';
import { Button, Card, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';
import { Eye, EyeOff } from 'react-feather';
import { Link, useHistory } from 'react-router-dom';
import logo from '../../../assets/img/logo-light.png';
import CommanFooter1 from '../CommanFooter1';

import { login as loginApi } from '../../../api/auth';
import { useAuth } from '../../../context/AuthContext';

const Body = () => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const history = useHistory();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await loginApi(userName, password);
            login(res.data.user, res.data.token); // Stocke user et token dans le contexte
            history.push("/dashboard");
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
                                        <Col lg={5} md={7} sm={10} className="mx-auto">
                                            {/* Logo */}
                                            <div className="text-center mb-7">
                                                <Link to="/" className="navbar-brand me-0">
                                                    <img
                                                        className="brand-img d-inline-block"
                                                        src={logo}
                                                        alt="brand"
                                                    />
                                                </Link>
                                            </div>

                                            <Card className="card-lg card-border">
                                                <Card.Body>
                                                    <h4 className="mb-4 text-center">
                                                        Sign in to your account
                                                    </h4>

                                                    {/* Message d’erreur */}
                                                    {error && (
                                                        <p className="text-danger text-center">{error}</p>
                                                    )}

                                                    <Row className="gx-3">
                                                        {/* Username / Email */}
                                                        <Col as={Form.Group} lg={12} className="mb-3">
                                                            <div className="form-label-group">
                                                                <Form.Label>User Name</Form.Label>
                                                            </div>
                                                            <Form.Control
                                                                placeholder="Enter username or email"
                                                                type="text"
                                                                value={userName}
                                                                onChange={(e) =>
                                                                    setUserName(e.target.value)
                                                                }
                                                                required
                                                            />
                                                        </Col>

                                                        {/* Password */}
                                                        <Col as={Form.Group} lg={12} className="mb-3">
                                                            <div className="form-label-group">
                                                                <Form.Label>Password</Form.Label>
                                                                <Link
                                                                    to="#"
                                                                    className="fs-7 fw-medium"
                                                                >
                                                                    Forgot Password ?
                                                                </Link>
                                                            </div>
                                                            <InputGroup className="password-check">
                                                                <span className="input-affix-wrapper">
                                                                    <Form.Control
                                                                        placeholder="Enter your password"
                                                                        type={
                                                                            showPassword
                                                                                ? "text"
                                                                                : "password"
                                                                        }
                                                                        value={password}
                                                                        onChange={(e) =>
                                                                            setPassword(e.target.value)
                                                                        }
                                                                        required
                                                                    />
                                                                    <Link
                                                                        to="#"
                                                                        className="input-suffix text-muted"
                                                                        onClick={() =>
                                                                            setShowPassword(!showPassword)
                                                                        }
                                                                    >
                                                                        <span className="feather-icon">
                                                                            {showPassword ? (
                                                                                <EyeOff className="form-icon" />
                                                                            ) : (
                                                                                <Eye className="form-icon" />
                                                                            )}
                                                                        </span>
                                                                    </Link>
                                                                </span>
                                                            </InputGroup>
                                                        </Col>
                                                    </Row>

                                                    {/* Keep me logged in */}
                                                    <div className="d-flex justify-content-center">
                                                        <Form.Check
                                                            id="logged_in"
                                                            className="form-check-sm mb-3"
                                                        >
                                                            <Form.Check.Input
                                                                type="checkbox"
                                                                defaultChecked
                                                            />
                                                            <Form.Check.Label className="text-muted fs-7">
                                                                Keep me logged in
                                                            </Form.Check.Label>
                                                        </Form.Check>
                                                    </div>

                                                    {/* Submit */}
                                                    <Button
                                                        variant="primary"
                                                        type="submit"
                                                        className="btn-uppercase btn-block"
                                                    >
                                                        Login
                                                    </Button>

                                                    {/* Lien création de compte */}
                                                    <p className="p-xs mt-2 text-center">
                                                        New to Jampack?{" "}
                                                        <Link to="signup">
                                                            <u>Create new account</u>
                                                        </Link>
                                                    </p>
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
            <CommanFooter1 />
        </div>
    );
};

export default Body;
