/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import Script from "next/script";

export default function BuyPremiumButton() {
  const createOrder = useAction(api.payments.createOrder);
  const verifyPayment = useAction(api.payments.verifyPayment);

  const handlePayment = async () => {
    // 1. Create Order
    const order = await createOrder({});

    // 2. Open Razorpay Modal
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use public env var
      amount: "49900",
      currency: "INR",
      name: "SircuS Premium",
      description: "Lifetime access to Aptitude",
      order_id: order.id,
      handler: async function (response: any) {
        // 3. Verify Payment on Success
        try {
          await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          alert("Payment Successful! Welcome to Premium.");
          window.location.reload(); // Refresh to update UI
        } catch (err) {
          alert("Payment verification failed");
        }
      },
      prefill: {
        name: "Student Name",
        email: "student@example.com",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp1 = new (window as any).Razorpay(options);
    rzp1.open();
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <button
        onClick={handlePayment}
        className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded shadow-lg transition-transform transform hover:scale-105"
      >
        Unlock Aptitude (₹499)
      </button>
    </>
  );
}
