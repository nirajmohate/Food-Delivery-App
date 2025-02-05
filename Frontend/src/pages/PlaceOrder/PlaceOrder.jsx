// import React, { useContext, useEffect, useState } from "react";
// import "./PlaceOrder.css";
// import { StoreContext } from "../../Context/StoreContext";
// import axios from "axios";
// import { Navigate, useNavigate } from "react-router-dom";

// const PlaceOrder = () => {
//   const { getTotalCartAmount, token, food_list, cartItems, url } =
//     useContext(StoreContext);

//   const [data, setData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     street: "",
//     city: "",
//     state: "",
//     zipcode: "",
//     country: "",
//     phone: "",
//   });

//   const onChangeHandler = (event) => {
//     const name = event.target.name;
//     const value = event.target.value;
//     setData((data) => ({ ...data, [name]: value }));
//   };

//   const placeOrder = async (event) => {
//     event.preventDefault();
//     let orderItems = [];
//     food_list.map((item) => {
//       if (cartItems[item._id] > 0) {
//         let itemInfo = item;
//         itemInfo["quantity"] = cartItems[item._id];
//         orderItems.push(itemInfo);
//       }
//     });

//     let orderData = {
//       address: data,
//       items: orderItems,
//       amount: getTotalCartAmount() + 2,
//     };
//     let response = await axios.post(url + "/api/order/place", orderData,{headers : {token}});
//     if (response.data.success){
//       const {session_url} = response.data;
//       window.location.replace(session_url);
//     }
//     else{
//       alert("Error")
//     }
//   };

//   const navigate = useNavigate();


//   useEffect(()=>{
//     if (!token) {
//       navigate('/cart')
//     }
//     else if(getTotalCartAmount()===0){
//       navigate('/cart')
//     }
//   },[token])
//   return (
//     <form onSubmit={placeOrder} className="place-order">
//       <div className="place-order-left">
//         <p className="title">Delivery Information</p>
//         <div className="multi-fields">
//           <input
//             required
//             name="firstName"
//             onChange={onChangeHandler}
//             value={data.firstName}
//             type="text"
//             placeholder="First Name"
//           />
//           <input
//             required
//             name="lastName"
//             onChange={onChangeHandler}
//             value={data.lastName}
//             type="text"
//             placeholder="Last Name"
//           />
//         </div>
//         <input
//           required
//           name="email"
//           onChange={onChangeHandler}
//           value={data.email}
//           type="email"
//           placeholder="Email address"
//         />
//         <input
//           required
//           name="street"
//           onChange={onChangeHandler}
//           value={data.street}
//           type="text"
//           placeholder=" Street"
//         />
//         <div className="multi-fields">
//           <input
//             required
//             name="city"
//             onChange={onChangeHandler}
//             value={data.city}
//             type="text"
//             placeholder="City"
//           />
//           <input
//             required
//             name="state"
//             onChange={onChangeHandler}
//             value={data.state}
//             type="text"
//             placeholder="State"
//           />
//         </div>
//         <div className="multi-fields">
//           <input
//             required
//             name="zipcode"
//             onChange={onChangeHandler}
//             value={data.zipcode}
//             type="text"
//             placeholder="Zipcode"
//           />
//           <input
//             required
//             name="country"
//             onChange={onChangeHandler}
//             value={data.country}
//             type="text"
//             placeholder="Country"
//           />
//         </div>
//         <input
//           required
//           name="phone"
//           onChange={onChangeHandler}
//           value={data.phone}
//           type="text"
//           placeholder="Phone"
//         />
//       </div>

//       <div className="place-order-right">
//         <div className="cart-total">
//           <h2>Cart Totals</h2>
//           <div>
//             <div className="cart-total-details">
//               <p>SubTotal</p>
//               <p>${getTotalCartAmount()}</p>
//             </div>
//             <hr />
//             <div className="cart-total-details">
//               <p>Delivery Fee</p>
//               <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
//             </div>
//             <hr />
//             <div className="cart-total-details">
//               <b>Total</b>
//               <b>
//                 ${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}
//               </b>
//             </div>
//           </div>
//           <button type="submit">PROCEED TO PAYMENT</button>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default PlaceOrder;





import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } =
    useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const [orderId, setOrderId] = useState(null); // Track order ID

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });

    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
    };

    try {
      const response = await axios.post(url + "/api/order/place", orderData, {
        headers: { token },
      });
      if (response.data.success) {
        setOrderId(response.data.orderId); // Save orderId for PayPal integration
      } else {
        alert("Error");
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/cart");
    } else if (getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token]);

  // PayPal Payment Integration
  const handleApprove = async (data, actions) => {
    const orderData = {
      orderId: orderId,
      success: true,
    };
    try {
      const response = await axios.post(url + "/api/order/verify", orderData, {
        headers: { token },
      });
      if (response.data.success) {
        alert("Payment successful!");
        navigate("/order-success");
      } else {
        alert("Payment verification failed");
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
    }
  };

  const handleCancel = () => {
    alert("Payment cancelled.");
  };

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            required
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            type="text"
            placeholder="First Name"
          />
          <input
            required
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            type="text"
            placeholder="Last Name"
          />
        </div>
        <input
          required
          name="email"
          onChange={onChangeHandler}
          value={data.email}
          type="email"
          placeholder="Email address"
        />
        <input
          required
          name="street"
          onChange={onChangeHandler}
          value={data.street}
          type="text"
          placeholder="Street"
        />
        <div className="multi-fields">
          <input
            required
            name="city"
            onChange={onChangeHandler}
            value={data.city}
            type="text"
            placeholder="City"
          />
          <input
            required
            name="state"
            onChange={onChangeHandler}
            value={data.state}
            type="text"
            placeholder="State"
          />
        </div>
        <div className="multi-fields">
          <input
            required
            name="zipcode"
            onChange={onChangeHandler}
            value={data.zipcode}
            type="text"
            placeholder="Zipcode"
          />
          <input
            required
            name="country"
            onChange={onChangeHandler}
            value={data.country}
            type="text"
            placeholder="Country"
          />
        </div>
        <input
          required
          name="phone"
          onChange={onChangeHandler}
          value={data.phone}
          type="text"
          placeholder="Phone"
        />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>SubTotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                ${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}
              </b>
            </div>
          </div>

          {orderId && (
            <div id="paypal-button-container">
              <script
                src="https://www.paypal.com/sdk/js?client-id=YOUR_PAYPAL_CLIENT_ID&currency=INR"
                data-order-id={orderId}
                async
              ></script>

              <div id="paypal-button-container">
                <paypal.Button
                  createOrder={(data, actions) => {
                    return actions.order.create({
                      purchase_units: [
                        {
                          amount: {
                            value: getTotalCartAmount() + 2,
                          },
                        },
                      ],
                    });
                  }}
                  onApprove={handleApprove}
                  onCancel={handleCancel}
                />
              </div>
            </div>
          )}

          <button type="submit">PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;

