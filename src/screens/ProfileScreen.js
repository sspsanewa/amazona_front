import React, { useReducer, useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Form from 'react-bootstrap/esm/Form';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';
import { signIn } from '../features/auth/authSlice';

const reducer = (state, action) => {
    switch (action.type) {
        case 'UPDATE_REQUEST':
            return { ...state, loadingUpdate: true };
        case 'UPDATE_SUCCESS':
            return { ...state, loadingUpdate: false };
        case 'UPDATE_FAIL':
            return { ...state, loadingUpdate: false };
        default:
            return state;
    }
};

const ProfileScreen = () => {
    const dispatch = useDispatch();
    const auth = useSelector((state) => state.auth);
    const userInfo = auth.userInfo;
    console.log('userinfo', userInfo);
    const [name, setName] = useState(userInfo.name);
    const [email, setEmail] = useState(userInfo.email);
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();

    const [{ loadingUpdate }, localDispatch] = useReducer(reducer, { loadingUpdate: false });
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            localDispatch({ type: 'UPDATE_REQUEST' });
            const { data } = await axios.put('/api/users/profile', { name, email, password }, { headers: { Authorization: `Bearer ${userInfo.token}` } });
            localDispatch({ type: 'UPDATE_SUCCESS' });
            dispatch(signIn(data));
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success('User updated successfully');
        } catch (error) {
            localDispatch({ type: 'UPDATE_FAIL' });
            toast.error(getError(error));
        }
    };
    return (
        <div className='container small-container'>
            <Helmet>
                <title>User Profile</title>
            </Helmet>
            <h1 className='my-3'>User Profile</h1>
            <form onSubmit={submitHandler}>
                <Form.Group className='mb-3' controlId='name' >
                    <Form.Label>
                        Name
                    </Form.Label>
                    <Form.Control value={name} onChange={(e) => setName(e.target.value)} required />
                </Form.Group>
                <Form.Group className='mb-3' controlId='email' >
                    <Form.Label>
                        Email
                    </Form.Label>
                    <Form.Control type='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                </Form.Group>
                <Form.Group className='mb-3' controlId='password' >
                    <Form.Label>
                        Password
                    </Form.Label>
                    <Form.Control type='password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                </Form.Group>
                <Form.Group className='mb-3' controlId='password' >
                    <Form.Label>
                        Confirm Password
                    </Form.Label>
                    <Form.Control type='password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </Form.Group>
                <div className='mb-3'>
                    <Button type='submit'>Update</Button>
                </div>
            </form>

        </div>
    );
};

export default ProfileScreen;
