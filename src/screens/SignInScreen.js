import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { signIn } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import { getError } from '../utils';
const SignInScreen = () => {
    const { search } = useLocation();
    const navigate = useNavigate();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';
    const auth = useSelector((state) => state.auth);
    const userInfo = auth.userInfo; // Get cart state from Redux

    const dispatch = useDispatch(); // Initialize Redux dispatch
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/users/signin', {
                email,
                password
            });
            dispatch(signIn(data));
            navigate(redirect || '/');
        } catch (error) {
            toast.error(getError(error));
        }
    };

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }

    }, [userInfo, navigate, redirect]);


    return (
        <Container className='small-container'>
            <Helmet>
                <title>Sign In</title>
            </Helmet>
            <h1 className='my-3'>Sign In</h1>
            <Form onSubmit={submitHandler}>
                <Form.Group className='mb-3' controlId='email'>
                    <Form.Label>
                        Email
                    </Form.Label>
                    <Form.Control type='email' required onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>
                <Form.Group className='mb-3' controlId='password'>
                    <Form.Label>
                        Password
                    </Form.Label>
                    <Form.Control type='password' required onChange={(e) => setPassword(e.target.value)} />
                </Form.Group>
                <div className='mb-3'>
                    <Button type='submit'>Sign In</Button>
                </div>
                <div className='mb-3'>
                    New Customer?{''}
                    <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
                </div>
            </Form>
        </Container>
    );
};

export default SignInScreen;
