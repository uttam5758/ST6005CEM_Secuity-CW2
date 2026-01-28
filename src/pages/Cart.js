import React, { useEffect, useContext, useState } from "react";
import thumb from "../assets/images/thumbnail.jpg";
import { ArrowDownOutlined, ArrowLeftOutlined, CloseOutlined, DeleteOutlined, ExclamationCircleOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { json, useNavigate } from "react-router-dom";
import { Modal, Button, Empty } from "antd";
import axios from "axios";

const { confirm } = Modal;

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  

  const token = localStorage.getItem('token');
  const publicFolder = "http://localhost:5000/image/";

  
  useEffect(() => {
    // Fetch the cart items from the server
    axios.get('/cart', { headers: { Authorization: `Bearer ${token}` } })
      .then(response => {
        console.log("Response data", response.data)
        setCartItems(response.data);
      })
      .catch(error => {
        console.error("Error fetching cart items:", error);
      });
  }, []); // Empty dependency array means this effect runs once after the component mounts

  const handleGoBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const handleProceedCheckout = () => {
    const totalPrice = cartItems.reduce((total, item) => total + (item.productId.price), 0);
    sessionStorage.setItem("deliveryData", JSON.stringify(cartItems))
    navigate(`/delivery?total=${totalPrice}`)
  }

  const handleDelete = (itemId) => {
    // Send DELETE request to remove the item from the cart
    axios.delete('cart/removeFromCart', {
      headers: { Authorization: `Bearer ${token}` },
      data: { cartItemId: itemId } // Send the cartItemId in the request body
    })
      .then(response => {
        // Update the cart items in state after successful removal
        setCartItems(prevCartItems => prevCartItems.filter(item => item._id !== itemId));
      })
      .catch(error => {
        console.error("Error removing item from cart:", error);
      });
  };

  return (
    <div className="text-center">
      <h3 style={{ marginTop: "2rem" }}>My Cart</h3>
      <div className="sort-class-parent">
        <div className="sort-class">
        <Button
            danger
            icon={<ArrowLeftOutlined />}
            style={{ marginBottom: "1rem" }}
            onClick={handleGoBack}
          >
            Back
          </Button>
        </div>
      </div>
      <div className="cart-content">
        <div className="cart-body">
        {cartItems.length === 0 ? (
        <Empty description="Your cart is empty" />
      ) : (
        <div>
          {cartItems.map(item => (
            <div key={item._id} className="cart-list">
              <div className="cart-item-left">
                <img className="product-image" src={ publicFolder + item.productId.image || thumb} alt="Product Thumbnail"  
                style={{
                        width: "100px",
                        height: "70px",
                        objectFit: "cover",
                      }} />
                <h4>{item.productId.title}</h4>
              </div>
              <div className="cart-item-right">
                <p>Price: Rs. {item.productId.price}</p>
                <Button icon={<DeleteOutlined />} onClick={() => handleDelete(item._id)} danger>
                  Remove
                </Button>
              </div>
            </div>
          ))}
          <Button type="primary" onClick={handleProceedCheckout}>
            Proceed to Checkout
          </Button>
        </div>
      )}
        </div>
      </div>
      
    </div>
  );
};

export default Cart;
