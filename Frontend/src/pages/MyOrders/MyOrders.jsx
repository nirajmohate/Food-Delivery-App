// import React, { useContext, useEffect, useState } from "react";
// import "./MyOrders.css";
// import { StoreContext } from "../../Context/StoreContext";
// import axios from "axios";
// import { assets } from "../../assets/assets";

// const MyOrders = () => {
//   const [data, setData] = useState([]);
//   const { url, token } = useContext(StoreContext);

//   const fetchOrders = async () => {
//     const response = await axios.post(
//       url + "/api/order/userOrders",
//       {},
//       { headers: { token } }
//     );
//     setData(response.data.data);
//   };

//   useEffect(() => {
//     if (token) {
//       fetchOrders();
//     }
//   }, [token]);

//   return (
//     <div className="my-orders">
//       <h2>My Orders</h2>
//       <div className="container">
//         {data.map((order, index) => {
//           <div key={index} className="my-orders-order">
//             <img src={assets.parcel_icon} alt="" />
//             <p>
//               {order.items.map((item, index) => {
//                 if (index === order.items.length - 1) {
//                   return item.name + "x" + item.quantity;
//                 } else {
//                   return item.name + "x" + item.quantity + ", ";
//                 }
//               })}
//             </p>
//             <p>${order.amount}.00</p>
//             <p>Items : {order.items.length}</p>
//             <p>
//               <span>&#25cf;</span>
//               <b>{order.status}</b>
//             </p>
//             <button onClick={fetchOrders()}>Track Order</button>
//           </div>;
//         })}
//       </div>
//     </div>
//   );
// };

// export default MyOrders;

import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/assets";

const MyOrders = () => {
  const [data, setData] = useState([]);
  const { url, token } = useContext(StoreContext);

  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        `${url}/api/order/userOrders`,
        {},
        { headers: { token } }
      );
      console.log("Fetched Orders:", response.data);
      setData(response.data.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="container">
        {data.length > 0 ? (
          data.map((order, index) => (
            <div key={index} className="my-orders-order">
              <img src={assets.parcel_icon} alt="" />
              <p>
                {order.items.map((item, index) => (
                  <span key={index}>
                    {item.name} x {item.quantity}
                    {index < order.items.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
              <p>${order.amount}.00</p>
              <p>Items: {order.items.length}</p>
              <p>
                <span>&#25cf;</span>
                <b>{order.status}</b>
              </p>
              <button onClick={fetchOrders}>Track Order</button>
            </div>
          ))
        ) : (
          <p>No orders found</p>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
