import "react-toastify/dist/ReactToastify.css";
import './App.css';

import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from "../src/components/Header";
import Login from './pages/Login';
import Register from './pages/Register';
import AllFurnitures from './pages/AllFurnitures';
import ProductPage from "./pages/ProductPage";
import DeliveryPage from "./pages/DeliveryPage";
import PaymentPage from "./pages/PaymentPage";
import Cart from "./pages/Cart";
import SingleDeliveryPage from "./pages/SingleDeliveryPage";
import UserProfile from "./pages/UserProfile";
import AdminPage from "./pages/admin/admin";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import { Footer } from "antd/es/layout/layout";
import { SessionProvider } from "./components/SessionContext";

function App() {
  const [userId, setUserId] = useState();
  const [token, setToken] = useState();
  const [user, setUser] = useState();
  const [orders, setOrders] = useState();

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
    setToken(localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    if (userId == null) {
      console.log("Login to access various content");
    } else {
      const getUser = async () => {
        const res = await axios.get(`/user/${userId}`);
        console.log("Logged In User:", res["data"]);
        setUser(res["data"]);
      };
      getUser();
    }
  }, [userId]);

  const isAdmin = user && user.role === "Admin";

  return (
    <SessionProvider>
      <Fragment>
      <BrowserRouter>
      <Header user={user}/>
      <Container fluid className="app-container" style={{minHeight: "100vh"}}>
        <Routes>
          <Route path="/" element={<AllFurnitures/>}/>
          <Route path="/cart" element={userId ? <Cart/> : <Login/>} />
          <Route path="/products" element={<AllFurnitures/>}/>  
          <Route path="/products/:products_id" element={<ProductPage/>} user={user}/>
          <Route path="/delivery" element={userId ? <DeliveryPage user_id={userId} token={token}/> : <Login/>} />
          <Route path="/buy-now/delivery" element={userId? <SingleDeliveryPage user_id={userId} token={token}/> : <Login/>} />
          <Route path="/delivery/payment" element={userId? <PaymentPage/> : <Login/>} />
          <Route path="/user/:user_id" element={<UserProfile user={user} token={token} orders={orders} />} />
          <Route path="/admin" element={isAdmin ? <AdminPage user={user} token={token}/> : <Login/>} />
          <Route path="/login" element={userId ? <AllFurnitures/> : <Login/>}/>
          <Route path="/register" element={userId ? <AllFurnitures /> : <Register/>}/>
          <Route path="/about-us" element={<AboutUs/>}/>
          <Route path="/contact-us" element={<ContactUs/>}/>
        </Routes>
      </Container>
      <Footer/>
      </BrowserRouter>
    </Fragment>
    </SessionProvider>
  )
}

export default App;
