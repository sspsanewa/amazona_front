import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import React from 'react';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import { addToCart } from '../features/cart/cartSlice';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

const Product = ({ product }) => {
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);
    const addToCartHandler = async (item) => {
        const existItem = cart.cartItems.find((x) => x._id === product._id);
        const qty = existItem ? existItem.qty + 1 : 1;
        console.log('productscreen', cart.cartItems);

        const { data } = await axios.get(`/api/products/${item._id}`);

        if (data.countInStock < qty) {
            window.alert('Sorry. Product is out of stock');
            return;
        }
        console.log('final add item', item, qty);
        dispatch(addToCart({ ...item, qty })); // Update item with new quantity
    };
    return (

        <Card  >
            <Link to={`/product/${product.slug}`}>
                <img className='card-img-top' src={product.image} alt={product.name} />
            </Link>
            <Card.Body>
                <Link to={`/product/${product.slug}`}>
                    <Card.Title>{product.name}</Card.Title>
                </Link>
                <Rating rating={product.rating} numReviews={product.numReviews} />
                <Card.Text>${product.price}</Card.Text>
                {product.countInStock === 0 ? <Button variant='light' disabled>Out of Stock</Button> :
                    <Button onClick={() => addToCartHandler(product)}>Add to cart</Button>
                }
            </Card.Body>

        </Card>

    );
};

export default Product;
