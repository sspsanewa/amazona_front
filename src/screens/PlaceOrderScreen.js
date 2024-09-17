import Axios from 'axios';
import React, { useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import CheckoutSteps from '../components/CheckoutSteps';
import LoadingBox from '../components/LoadingBox';
import { useDispatch, useSelector } from 'react-redux';
import { resetCart } from '../features/cart/cartSlice';

const reducer = (state, action) => {
    switch (action.type) {
        case 'CREATE_REQUEST':
            return { ...state, loading: true };
        case 'CREATE_SUCCESS':
            return { ...state, loading: false };
        case 'CREATE_FAIL':
            return { ...state, loading: false };
        default:
            return state;
    }
};

export default function PlaceOrderScreen() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [{ loading }, localDispatch] = useReducer(reducer, {
        loading: false,
    });

    const cart = useSelector((state) => state.cart);
    const auth = useSelector((state) => state.auth);

    const userInfo = auth.userInfo; // Get cart state from Redux
    console.log('userInfo token', cart);

    // Helper function to round numbers
    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100; // 123.2345 => 123.23

    // Create a new copy of the cart object and add calculated fields
    const cartWithPrices = {
        ...cart,
        itemsPrice: round2(
            cart.cartItems.reduce((a, c) => a + c.qty * c.price, 0)
        ),
    };
    cartWithPrices.shippingPrice = cartWithPrices.itemsPrice > 100 ? round2(0) : round2(10);
    cartWithPrices.taxPrice = round2(0.15 * cartWithPrices.itemsPrice);
    cartWithPrices.totalPrice =
        cartWithPrices.itemsPrice + cartWithPrices.shippingPrice + cartWithPrices.taxPrice;


    console.log('cartWithPrices', cartWithPrices);

    const placeOrderHandler = async () => {
        try {
            localDispatch({ type: 'CREATE_REQUEST' });

            const { data } = await Axios.post(
                '/api/orders',
                {
                    orderItems: cartWithPrices.cartItems,
                    shippingAddress: cartWithPrices.shippingAddress,
                    paymentMethod: cartWithPrices.paymentMethod,
                    itemsPrice: cartWithPrices.itemsPrice,
                    shippingPrice: cartWithPrices.shippingPrice,
                    taxPrice: cartWithPrices.taxPrice,
                    totalPrice: cartWithPrices.totalPrice,
                },
                {
                    headers: {
                        authorization: `Bearer ${userInfo.token}`,
                    },
                }
            );
            dispatch(resetCart());
            localDispatch({ type: 'CREATE_SUCCESS' });
            localStorage.removeItem('cartItems');
            navigate(`/order/${data.order._id}`);
        } catch (err) {
            localDispatch({ type: 'CREATE_FAIL' });
            toast.error(getError(err));
        }
    };

    useEffect(() => {
        if (!cart.paymentMethod) {
            navigate('/payment');
        }
    }, [cart, navigate]);

    return (
        <div>
            <CheckoutSteps step1 step2 step3 step4></CheckoutSteps>
            <Helmet>
                <title>Preview Order</title>
            </Helmet>
            <h1 className="my-3">Preview Order</h1>
            <Row>
                <Col md={8}>
                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Shipping</Card.Title>
                            <Card.Text>
                                <strong>Name:</strong> {cart.shippingAddress.fullName} <br />
                                <strong>Address: </strong> {cart.shippingAddress.address},
                                {cart.shippingAddress.city}, {cart.shippingAddress.postalCode},
                                {cart.shippingAddress.country}
                            </Card.Text>
                            <Link to="/shipping">Edit</Link>
                        </Card.Body>
                    </Card>

                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Payment</Card.Title>
                            <Card.Text>
                                <strong>Method:</strong> {cart.paymentMethod}
                            </Card.Text>
                            <Link to="/payment">Edit</Link>
                        </Card.Body>
                    </Card>

                    <Card className="mb-3">
                        <Card.Body>
                            <Card.Title>Items</Card.Title>
                            <ListGroup variant="flush">
                                {cart.cartItems.map((item) => (
                                    <ListGroup.Item key={item._id}>
                                        <Row className="align-items-center">
                                            <Col md={6}>
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="img-fluid rounded img-thumbnail"
                                                ></img>{' '}
                                                <Link to={`/product/${item.slug}`}>{item.name}</Link>
                                            </Col>
                                            <Col md={3}>
                                                <span>{item.quantity}</span>
                                            </Col>
                                            <Col md={3}>${item.price}</Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                            <Link to="/cart">Edit</Link>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Order Summary</Card.Title>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Items</Col>
                                        <Col>${cartWithPrices.itemsPrice.toFixed(2)}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Shipping</Col>
                                        <Col>${cartWithPrices.shippingPrice.toFixed(2)}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Tax</Col>
                                        <Col>${cartWithPrices.taxPrice.toFixed(2)}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>
                                            <strong> Order Total</strong>
                                        </Col>
                                        <Col>
                                            <strong>${cartWithPrices.totalPrice.toFixed(2)}</strong>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <div className="d-grid">
                                        <Button
                                            type="button"
                                            onClick={placeOrderHandler}
                                            disabled={cart.cartItems.length === 0}
                                        >
                                            Place Order
                                        </Button>
                                    </div>
                                    {loading && <LoadingBox></LoadingBox>}
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
