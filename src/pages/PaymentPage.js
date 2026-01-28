import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button } from "antd";
const deliveryData = JSON.parse(sessionStorage.getItem("deliveryData"));

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname.split("/")[2];
  const token = localStorage.getItem("token");
 
  const userId = localStorage.getItem("userId");

  const config = { headers: { Authorization: `Bearer ${token}` } };
  const queryParams = new URLSearchParams(location.search);

  const totalPrice = parseInt(queryParams.get("total"))
  const [data, setData] = useState([])

  const [cartItems, setCartItems] = useState([]);
  const publicFolder = "http://localhost:5000/image/";

  
  useEffect(() => {
    // Fetch the cart items from the server
    axios.get('/cart', { headers: { Authorization: `Bearer ${token}` } })
      .then(response => {
        console.log("Response data", response.data)
        setData(response.data);
      })
      .catch(error => {
        console.error("Error fetching cart items:", error);
      });
  }, []); 


  console.log("dd: ", data);

  const handleOrder = async () => {
    try {
     
      const addressData = JSON.parse(sessionStorage.getItem("addressData"));

      addressData.products = data;
      
      console.log("add: ", addressData);
      console.log("dd: ", deliveryData)
      await axios.post(`/delivery`, addressData, config);
      // sessionStorage.removeItem("productId");
      // sessionStorage.removeItem("deliveryData");
      toast.success("Order placed successfully");
      setTimeout(() => {
        navigate(`/user/${userId}`);
      }, 2000);
    } catch (error) {
      console.log("Error placing order:", error);
      // sessionStorage.removeItem("productId");
      // sessionStorage.removeItem("deliveryData");
      toast.error("Failed to place order");
    }
  };

  const handleGoBack = () => {
    navigate("/");
    toast.info("Payment cancelled. Returning to home");
  };

  return (
    <>
      <div className="text-center">
        <h3 className="page-title">Payment Method</h3>
        <div className="sort-class-parent">
          <div className="sort-class">
            <Button danger style={{ width: "fit-content" }} onClick={handleGoBack}>
              Go to Home
            </Button>
          </div>
        </div>
        <div className="payment-page-container user-form">
        <div style={{color: "red", fontWeight: "500", marginBottom: "2rem"}}>Total price: {totalPrice}</div>
          <div className="btn-group payment-btns">
            <button
              className="cash-on-dv"
              style={{ backgroundColor: "#F29930", width: "12rem" }}
              onClick={handleOrder}
            >
              Cash on Delivery
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default PaymentPage;
