// src/screens/ProductScreen.js

import axios from 'axios';
import React, { useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Rating from '../components/Rating';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';
import { addToCart } from '../features/cart/cartSlice'; // Import the addToCart action
import { useNavigate } from 'react-router-dom';
const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, product: action.payload, loading: false };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

const ProductScreen = () => {
    const { slug } = useParams();
    const dispatch = useDispatch(); // Initialize Redux dispatch
    const navigate = useNavigate();
    const [{ loading, error, product }, localDispatch] = useReducer(reducer, {
        product: [],
        loading: true,
        error: ''
    });



    useEffect(() => {
        const fetchData = async () => {
            localDispatch({ type: 'FETCH_REQUEST' });
            try {
                const result = await axios.get(`/api/products/slug/${slug}`);
                localDispatch({ type: 'FETCH_SUCCESS', payload: result.data });
            } catch (error) {
                localDispatch({ type: 'FETCH_FAIL', payload: getError(error) });
            }
        };
        fetchData();
    }, [slug]);

    const cart = useSelector((state) => state.cart); // Get cart state from Redux
    // Handle Add to Cart
    const handleAddToCart = async () => {
        const existItem = cart.cartItems.find((x) => x._id === product._id);
        const qty = existItem ? existItem.qty + 1 : 1;
        const { data } = await axios.get(`/api/products/${product._id}`);
        if (data.countInStock < qty) {
            window.alert('Sorry. Product is out of stock');
            return;
        }
        dispatch(addToCart({ ...product, qty })); // Dispatch addToCart action with the product data
        navigate('/cart');
    };

    return (
        loading ? <LoadingBox /> :
            error ? <MessageBox variant='danger'>{error}</MessageBox> :
                <div>
                    <Row>
                        <Col md={6}>
                            <img className='img-large' src={product.image} alt={product.name} />
                        </Col>
                        <Col md={3}>
                            <ListGroup variant='flush'>
                                <Helmet>
                                    <title>{product.name}</title>
                                </Helmet>
                                <ListGroup.Item>
                                    <h1>{product.name}</h1>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Rating rating={product.rating} numReviews={product.numReviews} />
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    Price : ${product.price}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    Description :<p>{product.description}</p>
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col md={3}>
                            <Card>
                                <Card.Body>
                                    <ListGroup variant='flush'>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Price</Col>
                                                <Col>${product.price}</Col>
                                            </Row>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Status</Col>
                                                <Col>
                                                    {
                                                        product.countInStock > 0 ?
                                                            <Badge bg='success'>In Stock</Badge> :
                                                            <Badge bg='danger'>Unavailable</Badge>
                                                    }
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                        {
                                            product.countInStock > 0 &&
                                            <ListGroup.Item>
                                                <div className='d-grid'>
                                                    <Button variant='primary' onClick={handleAddToCart}>
                                                        Add to cart
                                                    </Button>
                                                </div>
                                            </ListGroup.Item>
                                        }
                                    </ListGroup>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </div>
    );
};

export default ProductScreen;
