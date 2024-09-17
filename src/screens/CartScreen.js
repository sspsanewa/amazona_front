import React from 'react';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useDispatch, useSelector } from 'react-redux';
import MessageBox from '../components/MessageBox';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import { Link, useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import { addToCart, removeFromCart } from '../features/cart/cartSlice';

const CartScreen = () => {
    const cart = useSelector((state) => state.cart);
    const cartItems = cart.cartItems;
    const navigate = useNavigate();
    const checkoutHandler = () => {
        navigate('/signin?redirect=/shipping');
    };
    const dispatch = useDispatch();

    // Handler to update cart quantity
    const updateCartHandler = async (item, qty) => {
        if (qty <= 0) {
            dispatch(removeFromCart(item._id)); // Remove the item if qty goes below or equal to 0
            return;
        }

        const { data } = await axios.get(`/api/products/${item._id}`);

        if (data.countInStock < qty) {
            window.alert('Sorry. Product is out of stock');
            return;
        }
        dispatch(addToCart({ ...item, qty })); // Update item with new quantity
    };

    return (
        <div>
            <Helmet>
                <title>Shopping Cart</title>
            </Helmet>
            <h1>Shopping Cart</h1>
            <Row>
                <Col md={8}>
                    {cartItems.length === 0 ? (
                        <MessageBox>
                            Cart is empty. <Link to='/'>Go Shopping</Link>
                        </MessageBox>
                    ) : (
                        <ListGroup>
                            {cartItems.map((item) => (
                                <ListGroup.Item key={item._id}>
                                    <Row className='align-items-center'>
                                        <Col md={4}>
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className='img-fluid rounded img-thumbnail'>
                                            </img>{' '}
                                            <Link to={`/product/${item.slug}`}>{item.name}</Link>
                                        </Col>
                                        <Col md={3}>
                                            <Button
                                                onClick={() => updateCartHandler(item, item.qty - 1)}
                                                variant='light'
                                                disabled={item.qty === 1} // Prevent qty from going below 1
                                            >
                                                <i className='fas fa-minus-circle'></i>
                                            </Button>{' '}
                                            <span>{item.qty}</span>{' '}
                                            <Button
                                                onClick={() => updateCartHandler(item, item.qty + 1)}
                                                variant='light'
                                                disabled={item.qty === item.countInStock} // Prevent exceeding stock
                                            >
                                                <i className='fas fa-plus-circle'></i>
                                            </Button>
                                        </Col>
                                        <Col md={3}>${item.price}</Col>
                                        <Col md={2}>
                                            <Button
                                                variant='light'
                                                onClick={() => dispatch(removeFromCart(item._id))} // Remove item directly
                                            >
                                                <i className='fas fa-trash'></i>
                                            </Button>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <h3>
                                        Subtotal ({cartItems.reduce((a, c) => a + c.qty, 0)}{' '}
                                        items) : $
                                        {cartItems.reduce((a, c) => a + c.price * c.qty, 0).toFixed(2)}
                                    </h3>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div className="d-grid">
                                        <Button
                                            type="button"
                                            variant="primary"
                                            onClick={checkoutHandler}
                                            disabled={cartItems.length === 0}
                                        >
                                            Proceed to Checkout
                                        </Button>
                                    </div>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CartScreen;
