// import orderModel from "../models/orderModel.js";
// import userModel from "../models/userModel.js";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// // placing user order from frontend
// const placeOrder = async (req, res) => {

//     const frontend_url = "http://localhost:5174"

//   try {
//     const newOrder = new orderModel({
//       userId: req.body.userId,
//       items: req.body.items,
//       amount: req.body.amount,
//       address: req.body.address,
//     });
//     await newOrder.save();
//     await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

//     const line_items = req.body.items.map((item) => ({
//       price_data: {
//         currency: "inr",
//         product_data: {
//           name: item.name,
//         },
//         unit_amount: item.price * 100 * 80,
//       },
//       quantity: item.quantity,
//     }));

//     line_items.push({
//         price_data:{
//             currency:"inr",
//             product_data:{
//                 name:"Delivery Charges"
//             },
//             unit_amount:2*100*80
//         },
//         quantity:1

//     })

//     const session = await stripe.checkout.sessions.create({
//         line_items:line_items,
//         mode:'payment',
//         success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id},`,
//         cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id},`
//     })
//     res.json({success:true,session_url:session.url})
//   } catch (error) {
//     console.log(error);
//     res.json({success:false,message:"Error"})
    
//   }
// };

// const verifyOrder = async (req,res) => {
//       const {orderId , success} = req.body;
//       try{
//         if (success==="true") {
//           await orderModel.findByIdAndUpdate(orderId , {payment:true});
//           res.json({success:true,message:"Paid"})
//         }
//         else{
//           await orderModel.findByIdAndDelete(orderId);
//           res.json({success:true,message:"Not Paid"})
//         }
//       }
//       catch(error){
//         console.log(error);
//         res.json({success:false , message:"Error"})
//       }
// }

// // user orders for frontend 
// const userOrders = async (req,res) => {
//  try {
//   const orders = await orderModel.find({userId:req.body.userId});
//   res.json({success:true,data:orders})
//  } catch (error) {
//   console.log(error);
//   res.json({success:false , message:"Error"})
  
//  }
// }

// // listing order for the panel
// const listOrders = async (req,res) =>{
//      try {
//       const orders = await orderModel.find();
//       res.json({success:true,data:orders})
//      } catch (error) {
//       console.log(error);
//       res.json({success:false,message:"Error"})
      
//      }
// } 

// // api for updating order status
// const updateStatus =  async (req,res) => {
//     try {
//       await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
//       res.json({success:true , message:"Status Updated"})
//     } catch (error) {
//       console.log(error);
//       res.json({success:false , message:"Error"})
      
//     }
// }


// export { placeOrder , verifyOrder , userOrders,listOrders , updateStatus};






// Import necessary modules
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import paypal from "@paypal/checkout-server-sdk";

// PayPal environment setup
const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_SECRET
);
const client = new paypal.core.PayPalHttpClient(environment);

// Placing user order from frontend
const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5174";

  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });
    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    const items = req.body.items.map((item) => ({
      name: item.name,
      unit_amount: {
        currency_code: "INR",
        value: (item.price * 80).toFixed(2),
      },
      quantity: item.quantity.toString(),
    }));

    // Add delivery charges
    items.push({
      name: "Delivery Charges",
      unit_amount: {
        currency_code: "INR",
        value: (2 * 80).toFixed(2),
      },
      quantity: "1",
    });

    // PayPal order creation
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "INR",
            value: (req.body.amount * 80 + 160).toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "INR",
                value: (req.body.amount * 80 + 160).toFixed(2),
              },
            },
          },
          items: items,
        },
      ],
      application_context: {
        return_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
        cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
      },
    });

    const order = await client.execute(request);
    res.json({ success: true, approval_url: order.result.links.find(link => link.rel === "approve").href });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Verifying the payment
const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: true, message: "Not Paid" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// User orders for frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// Listing orders for admin panel
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find();
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// API for updating order status
const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
