import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col, Container, Input, Label, Row, Button, Form, FormFeedback, Alert, Spinner } from 'reactstrap';
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";

//redux
import { useSelector, useDispatch } from "react-redux";

import { Link } from "react-router-dom";
import withRouter from "../../Components/Common/withRouter";
// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

// actions
import { loginUser, socialLogin, resetLoginFlag } from "../../slices/thunks";

import logoLight from "../../assets/images/TRST Logo_Transparent.png";
import { createSelector } from 'reselect';
//import images

const Login = (props) => {
    const dispatch = useDispatch();

    // Simplified selector using createSelector
    const loginpageData = createSelector(
        state => state.Account.user,
        state => state.Login.error,
        state => state.Login.loading,
        state => state.Login.errorMsg,
        (user, error, loading, errorMsg) => ({
            user, error, loading, errorMsg
        })
    );

    const { user, error, loading, errorMsg } = useSelector(loginpageData);
    const [passwordShow, setPasswordShow] = useState(false);

    // Remove unnecessary userLogin state
    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const authUser = sessionStorage.getItem('authUser');
        
        if (token && authUser) {
            props.router.navigate('/dashboard');
        }
    }, [props.router]);

    const validation = useFormik({
        enableReinitialize: true,
        initialValues: {
            username: user?.user?.username || "",
            password: user?.password || "",
        },
        validationSchema: Yup.object({
            username: Yup.string().required("Please Enter Your Username"),
            password: Yup.string().required("Please Enter Your Password"),
        }),
        onSubmit: async (values) => {
            try {
                const response = await dispatch(loginUser(values, props.router.navigate));
                if (response?.payload?.token) {
                    sessionStorage.setItem('token', response.payload.token);
                    sessionStorage.setItem('authUser', JSON.stringify(response.payload.user));
                    props.router.navigate('/dashboard');
                }
            } catch (error) {
                console.error('Login failed:', error);
            }
        }
    });

    // Auto-dismiss error message
    useEffect(() => {
        let timeoutId;
        if (errorMsg) {
            timeoutId = setTimeout(() => {
                dispatch(resetLoginFlag());
            }, 3000);
        }
        return () => timeoutId && clearTimeout(timeoutId);
    }, [dispatch, errorMsg]);

    // Move title to useEffect
    useEffect(() => {
        document.title = "Login | TRST";
    }, []);

    return (
        <React.Fragment>
            <ParticlesAuth>
                <div className="auth-page-content mt-lg-5">
                    <Container>
                        <Row>
                            <Col lg={12}>
                                <div className="text-center mt-sm-5 mb-4 text-white-50">
                                    <div>
                                        <Link to="/" className="d-inline-block auth-logo">
                                            <img src={logoLight} alt="" height="60" />
                                        </Link>
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        <Row className="justify-content-center">
                            <Col md={8} lg={6} xl={5}>
                                <Card className="mt-4">
                                    <CardBody className="p-4">
                                        <div className="text-center mt-2">
                                            <h5 className="text-primary">Welcome Back !</h5>
                                            <p className="text-muted">Sign in to continue to TRST.</p>
                                        </div>
                                        {error && error ? (
                                            <Alert color="danger" timeout={3000}> 
                                                {error} 
                                            </Alert>
                                        ) : null}
                                        <div className="p-2 mt-4">
                                            <Form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    validation.handleSubmit();
                                                    return false;
                                                }}
                                                action="#">

                                                <div className="mb-3">
                                                    <Label htmlFor="username-input" className="form-label">Username</Label>
                                                    <Input
                                                        id="username-input"
                                                        name="username"
                                                        className="form-control"
                                                        placeholder="Enter username"
                                                        type="text"
                                                        autoComplete="username"
                                                        onChange={validation.handleChange}
                                                        onBlur={validation.handleBlur}
                                                        value={validation.values.username || ""}
                                                        invalid={
                                                            validation.touched.username && validation.errors.username ? true : false
                                                        }
                                                    />
                                                    {validation.touched.username && validation.errors.username ? (
                                                        <FormFeedback type="invalid">{validation.errors.username}</FormFeedback>
                                                    ) : null}
                                                </div>

                                                <div className="mb-3">
                                                    <Label className="form-label" htmlFor="password-input">Password</Label>
                                                    <div className="position-relative auth-pass-inputgroup mb-3">
                                                        <Input
                                                            id="password-input"
                                                            name="password"
                                                            value={validation.values.password || ""}
                                                            type={passwordShow ? "text" : "password"}
                                                            className="form-control pe-5"
                                                            placeholder="Enter Password"
                                                            autoComplete="current-password"
                                                            onChange={validation.handleChange}
                                                            onBlur={validation.handleBlur}
                                                            invalid={
                                                                validation.touched.password && validation.errors.password ? true : false
                                                            }
                                                        />
                                                        {validation.touched.password && validation.errors.password ? (
                                                            <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                                                        ) : null}
                                                        <button className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted" type="button" id="password-addon" onClick={() => setPasswordShow(!passwordShow)}><i className="ri-eye-fill align-middle"></i></button>
                                                    </div>
                                                </div>

                                                <div className="form-check">
                                                    <Input className="form-check-input" type="checkbox" value="" id="auth-remember-check" />
                                                    <Label className="form-check-label" htmlFor="auth-remember-check">Remember me</Label>
                                                </div>

                                                <div className="mt-4">
                                                    <Button color="success" disabled={error ? null : loading ? true : false} className="btn btn-success w-100" type="submit">
                                                        {loading ? <Spinner size="sm" className='me-2'> Loading... </Spinner> : null}
                                                        Sign In
                                                    </Button>
                                                </div>
                                            </Form>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </ParticlesAuth>
        </React.Fragment>
    );
};

export default withRouter(Login);