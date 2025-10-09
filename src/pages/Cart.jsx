import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import ConfirmModal from "../components/ConfirmModal";
import { toast } from "react-toastify";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Cart = () => {
  const { cart, summary, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);
  const [showModal, setShowModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load Razorpay SDK
  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleRemove = (id) => {
    setItemToRemove(id);
    setShowModal(true);
  };

  const confirmRemove = () => {
    removeFromCart(itemToRemove);
    setShowModal(false);
  };

  const validationSchema = Yup.object({
    address: Yup.string().trim().min(10, "Address must be at least 10 characters").required("Delivery address is required"),
    paymentMethod: Yup.number().required("Please select a payment method"),
  });

  // const handlePlaceOrder = async (values) => {
  //   if (cart.length === 0) {
  //     toast.error("Your cart is empty!");
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     // 1️⃣ Create order on backend
  //     const response = await api.post("/Order/user/create", {
  //       address: values.address.trim(),
  //       paymentMethod: Number(values.paymentMethod),
  //     });

  //     const order = response?.data?.data;
  //     const orderId = order?.id;
  //     const orderAmount = order?.totalPrice;
  //     const razorpayOrderId = order?.paymentId; // Must be returned from backend

  //     // 2️⃣ Online payment
  //     if (values.paymentMethod === 1) {
  //       const ok = await loadRazorpayScript();
       

  //       if (!ok) {
  //         toast.error("Failed to load payment SDK.");
  //         return;
  //       }

  //       const options = {
  //         key: import.meta.env.VITE_RAZORPAY_KEY,
  //         amount: Math.round(orderAmount * 100),
  //         currency: "INR",
  //         name: "Your Shop Name",
  //         description: "Order Payment",
  //         order_id: razorpayOrderId,
  //         handler: async function (response) {
  //           try {
  //             await api.post("/Order/verify-payment", {
  //               OrderId: orderId,
  //               RazorpayOrderId: response.razorpay_order_id,
  //               RazorpayPaymentId: response.razorpay_payment_id,
  //               RazorpaySignature: response.razorpay_signature,
  //             });
  //             toast.success("🎉 Payment successful! Order placed.");
  //             clearCart();
  //             navigate(`/order-success/${orderId}`);
  //           } catch (err) {
  //             console.error("Payment verification failed:", err);
  //             toast.error("Payment verification failed. Contact support.");
  //           }
  //         },
  //         prefill: {
  //           name: values.name,
  //           email: values.email,
  //           contact: values.phone,
  //         },
  //         theme: { color: "#F472B6" },
  //       };

  //       const rzp = new window.Razorpay(options);
  //       rzp.open();
  //     } else {
  //       // COD
  //       toast.success("✅ Order placed successfully! (COD)");
  //       clearCart();
  //       navigate(`/order-success/${orderId}`);
  //     }
  //   } catch (error) {
  //     console.error("Error placing order:", error);
  //     toast.error("Failed to place order.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
//   const handlePlaceOrder = async (values) => {
//   if (cart.length === 0) {
//     toast.error("Your cart is empty!");
//     return;
//   }

//   setLoading(true);

//   try {
//     // 1️⃣ Create order on backend
//     const response = await api.post("/Order/user/create", {
//       address: values.address.trim(),
//       paymentMethod: Number(values.paymentMethod),
//     });

//     const order = response?.data?.data;
//     const orderId = order?.id;
//     const orderAmount = order?.totalPrice;
//     const razorpayOrderId = order?.paymentId; // returned from backend

//     // 2️⃣ Online payment
//     if (values.paymentMethod === 1) {
//       const ok = await loadRazorpayScript();
//       if (!ok) {
//         toast.error("Failed to load payment SDK.");
//         setLoading(false);
//         return;
//       }

//       const options = {
//         key: import.meta.env.VITE_RAZORPAY_KEY,
//         amount: Math.round(orderAmount * 100),
//         currency: "INR",
//         name: "Your Shop Name",
//         description: "Order Payment",
//         order_id: razorpayOrderId,
//         handler: async function (response) {
//           try {
//             // Verify payment on backend
//             await api.post("/Order/verify-payment", {
//               OrderId: orderId,
//               RazorpayOrderId: response.razorpay_order_id,
//               RazorpayPaymentId: response.razorpay_payment_id,
//               RazorpaySignature: response.razorpay_signature,
//             });

//             // ✅ Clear cart AFTER successful payment verification
//             clearCart();

//             toast.success("🎉 Payment successful! Order placed.");
//             navigate(`/order-success/${orderId}`);
//           } catch (err) {
//             console.error("Payment verification failed:", err);
//             toast.error("Payment verification failed. Contact support.");
//           }
//         },
//         prefill: {
//           name: values.name,
//           email: values.email,
//           contact: values.phone,
//         },
//         theme: { color: "#F472B6" },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } else {
//       // COD
//       clearCart(); 
//       toast.success("✅ Order placed successfully! (COD)");
//       navigate(`/order-success/${orderId}`);
//     }
//   } catch (error) {
//     console.error("Error placing order:", error);
//     toast.error("Failed to place order.");
//   } finally {
//     setLoading(false);
//   }
// };

const handlePlaceOrder = async (values) => {
  if (cart.length === 0) {
    toast.error("Your cart is empty!");
    return;
  }

  setLoading(true);

  try {
    // 1️⃣ Create order on backend
    const response = await api.post("/Order/user/create", {
      address: values.address.trim(),
      paymentMethod: Number(values.paymentMethod),
    });

    const order = response?.data?.data;
    const orderId = order?.id;
    const orderAmount = order?.totalPrice;
    const razorpayOrderId = order?.paymentId; // backend Razorpay order id

    // 2️⃣ COD
    if (values.paymentMethod === 0) {
      clearCart(); // Clear cart immediately
      toast.success("✅ Order placed successfully! (COD)");
      navigate('/Orders');
      return;
    }

    // 3️⃣ Online Payment
    const ok = await loadRazorpayScript();
    if (!ok) {
      toast.error("Failed to load payment SDK.");
      setLoading(false);
      return;
    }

    // Razorpay options
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: Math.round(orderAmount * 100),
      currency: "INR",
      name: "Your Shop Name",
      description: "Order Payment",
      order_id: razorpayOrderId,
      handler: async function (response) {
        try {
          // Verify payment on backend
          await api.post("/Order/user/verify-payment", {
            OrderId: orderId,
            RazorpayOrderId: response.razorpay_order_id,
            RazorpayPaymentId: response.razorpay_payment_id,
            RazorpaySignature: response.razorpay_signature,
          });

          // ✅ Clear cart and navigate AFTER verification
          clearCart();
          toast.success("🎉 Payment successful! Order placed.");
          navigate('/Orders');
        } catch (err) {
          console.error("Payment verification failed:", err);
          toast.error("Payment verification failed. Contact support.");
        }
      },
      prefill: {
        name: values.name,
        email: values.email,
        contact: values.phone,
      },
      theme: { color: "#F472B6" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (error) {
    console.error("Error placing order:", error);
    toast.error("Failed to place order.");
  } finally {
    setLoading(false);
  }
};



  if (cart.length === 0)
    return <h1 className="text-center text-2xl font-semibold text-gray-700 mt-10">🛒 Your cart is empty.</h1>;

  return (
    <div className="p-6 grid md:grid-cols-3 gap-6">
      {/* CART ITEMS */}
      <div className="md:col-span-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">YOUR BAG</h2>
          <button className="text-red-500 hover:underline" onClick={clearCart}>Clear Cart</button>
        </div>
        <p className="mb-4 text-gray-600">
          TOTAL ({summary.totalQuantity} item{summary.totalQuantity > 1 ? "s" : ""}) ₹{summary.totalPrice.toFixed(2)}
        </p>
        {cart.map((item) => (
          <div key={item.id} className="flex items-center justify-between border-t py-4">
            <div className="flex items-center gap-4">
              <img src={item.imageUrl || "/placeholder.png"} alt={item.productName} className="w-24 h-24 object-contain" />
              <div>
                <p className="font-semibold">{item.productName}</p>
                <p className="text-gray-600 text-sm">₹{item.price}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="px-2 bg-gray-200 rounded text-xl font-bold">-</button>
                  <span className="px-3">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="px-2 bg-gray-200 rounded text-xl font-bold">+</button>
                </div>
                <p className="text-sm font-semibold mt-1">Subtotal: ₹{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
            <button type="button" onClick={() => handleRemove(item.productId)} className="text-red-500 hover:underline">Remove ❌</button>
          </div>
        ))}
      </div>

      {/* ORDER SUMMARY */}
      <div className="border p-6 rounded shadow h-fit">
        <h3 className="text-xl font-bold mb-4">ORDER SUMMARY</h3>
        <Formik
          initialValues={{ address: "", paymentMethod: 0, name: "", email: "", phone: "" }}
          validationSchema={validationSchema}
          onSubmit={handlePlaceOrder}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <div className="mb-4">
                <label className="block font-medium mb-1">Full Name:</label>
                <Field name="name" className="w-full border rounded px-3 py-2" placeholder="Your full name" />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1">Email:</label>
                <Field name="email" type="email" className="w-full border rounded px-3 py-2" placeholder="Your email" />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1">Phone:</label>
                <Field name="phone" className="w-full border rounded px-3 py-2" placeholder="Your phone number" />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1">Address:</label>
                <Field as="textarea" name="address" className="w-full border rounded px-3 py-2" rows={3} placeholder="Delivery address" />
                <ErrorMessage name="address" component="p" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="mb-4">
                <p className="font-semibold mb-2">Payment Method:</p>
                <label>
                  <Field type="radio" name="paymentMethod" value="0" checked={values.paymentMethod === 0} onChange={() => setFieldValue("paymentMethod", 0)} /> COD
                </label>
                <label className="ml-4">
                  <Field type="radio" name="paymentMethod" value="1" checked={values.paymentMethod === 1} onChange={() => setFieldValue("paymentMethod", 1)} /> Online
                </label>
              </div>

              <div className="flex justify-between font-bold text-lg mb-4">
                <span>Total</span>
                <span>₹{summary.totalPrice.toFixed(2)}</span>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-black text-white py-3 text-center rounded hover:bg-gray-800 disabled:opacity-50">
                {loading ? "Placing Order..." : "PLACE ORDER →"}
              </button>
            </Form>
          )}
        </Formik>
      </div>

      <ConfirmModal isOpen={showModal} onClose={() => setShowModal(false)} onConfirm={confirmRemove} message="Are you sure you want to remove this item from your cart?" />
    </div>
  );
};

export default Cart;
