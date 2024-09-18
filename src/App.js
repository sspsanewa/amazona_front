// src/App.js

import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from './screens/ProductScreen';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useDispatch, useSelector } from "react-redux";
import CartScreen from './screens/CartScreen';
import SignInScreen from './screens/SignInScreen';
import { signOut } from './features/auth/authSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SignupScreen from './screens/SignupScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import Button from 'react-bootstrap/esm/Button';
import { useEffect, useState } from 'react';
import { getError } from './utils';
import axios from 'axios';
import SearchBox from './components/SearchBox';
import SearchScreen from './screens/SearchScreen';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const cart = useSelector((state) => state.cart);
  const auth = useSelector((state) => state.auth);
  const userInfo = auth.userInfo; // Get cart state from Redux
  const cartItemsCount = cart.cartItems.reduce((a, c) => a + c.qty, 0); // Calculate total cart items

  const dispatch = useDispatch();

  const signoutHandler = (cart) => {
    dispatch(signOut({ type: 'USER_SIGNOUT' }));
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  };
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
        console.log('cate', categories);
      } catch (error) {
        toast.error(getError(error));
      }
    };
    fetchCategories();
  }, []);

  return (
    <BrowserRouter>
      <div className={sidebarIsOpen ? 'd-flex flex-column site-container active-cont' : 'd-flex flex-column site-container'}>
        <ToastContainer position='bottom-center' limit={1} />
        <header >
          <Navbar bg='dark' variant='dark' expand='lg'>
            <Container>
              <Button variant='dark' onClick={() => setSidebarIsOpen(!sidebarIsOpen)}>
                <i className='fas fa-bars'></i>
              </Button>
              <LinkContainer to='/'>
                <Navbar.Brand>amazona</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls='basic-navbar-nav' />
              <Navbar.Collapse id='basic-navbar-nav'>
                <SearchBox />
                <Nav className='me-auto w-100 justify-content-end'>
                  <Link to='/cart' className='nav-link'>
                    Cart
                    {
                      cartItemsCount > 0 && (
                        <Badge pill bg='danger'>
                          {cartItemsCount}
                        </Badge>
                      )
                    }
                  </Link>
                  {
                    userInfo ?
                      <NavDropdown title={userInfo.name} id='basic-nav-dropdown'>
                        <LinkContainer to='/profile'>
                          <NavDropdown.Item>User Profile</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to='/orderhistory'>
                          <NavDropdown.Item>Order History</NavDropdown.Item>
                        </LinkContainer>
                        <NavDropdown.Divider />
                        <Link to='#signout' className='dropdown-item' onClick={() => signoutHandler(cart)}>
                          Sign Out
                        </Link>
                      </NavDropdown> :
                      <Link to='/signin' className='nav-link'>
                        Sign In
                      </Link>
                  }
                  {/* {userInfo && userInfo.isAdmin && (
                    <NavDropdown title='Admin' id='admin-nav-dropdown'>
                      <LinkContainer to='/dashboard'>
                        <NavDropdown.Item>
                          Dashboard
                        </NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to='/productlist'>
                        <NavDropdown.Item>
                          Products
                        </NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to='/orderlist'>
                        <NavDropdown.Item>
                          Orders
                        </NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to='/userlist'>
                        <NavDropdown.Item>
                          Users
                        </NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )} */}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <div className={
          sidebarIsOpen ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
            : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
        }>
          <Nav className='flex-column text-white w-100 p-2'>
            {categories.length > 0 ?
              categories.map((category) => (
                <Nav.Item key={category}>
                  <LinkContainer
                    to={{
                      pathname: '/search',
                      search: `?category=${category}`,
                    }}
                    onClick={() => setSidebarIsOpen(false)}
                  >
                    <Nav.Link>
                      {category}
                    </Nav.Link>
                  </LinkContainer>
                </Nav.Item>
              ))
              :
              (<div>hhh</div>)
            }
          </Nav>

        </div>
        <main className='mt-3'>
          <Container>
            <Routes>
              <Route path='/product/:slug' element={<ProductScreen />} />
              <Route path="/" element={<HomeScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/signin" element={<SignInScreen />} />
              <Route path="/signup" element={<SignupScreen />} />

              <Route path="/shipping" element={<ShippingAddressScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route path="/order/:id" element={<OrderScreen />} />
              <Route path="/orderhistory" element={<ProtectedRoute><OrderHistoryScreen /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
              <Route path="/search" element={<SearchScreen />} />

            </Routes>
          </Container>
        </main>
        <footer >
          <div className='text-center'>All rights reserved</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
