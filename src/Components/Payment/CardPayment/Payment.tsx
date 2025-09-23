"use client"
import React, { useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'

import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

interface userData {
  name: string;
  phone: string;
  email: string;
  note: string;
  address: string;
  deliveryAddress: string;
}
interface ProductDetails {
  totalPrice: number;
  quantity: number;
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  productBrand: string;
  productCategory: string;
  productSizes: string | string[];
  productColors: string | string[];
  productStock: number;
  productRating: number;
  productCurrency: string;
  productDescription: string;
}

type PaymentProps = {
  onClose: () => void
  userData: userData
  products: ProductDetails


}

const Payment: React.FC<PaymentProps> = ({ onClose, products, userData }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState("");
  const [cardError, setCardError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }
    const card = elements.getElement(CardElement);
    if (!card) {
      return;
    }
    try {
      setLoading(true);

      const res = await axios.post(`http://localhost:5000/create-payment-intent`,
        { amount: products?.totalPrice, id: products?.productId });
        console.log(res)
      const clientSecret = res?.data?.clientSecret;

      //confirm payment

      const { paymentIntent, error: confirmError } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: card,
            billing_details: {
              name: userData.name,
              email: userData.email,
              phone: userData.phone,

            }
          }
        })

      if (confirmError) {
        alert(confirmError.message)
      }

      if (paymentIntent?.status === 'succeeded') {
        toast.success('Your Payment Successfully!')
        router.push('/shopping')

      }


    } catch (error) {
      setError("Payment failed. Please try again.");
      console.error("Payment error:", error);
    } finally {
      setLoading(false)
    }

  }

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <form
        onSubmit={handlePayment}
        className="w-[400px] bg-white p-6 rounded-2xl shadow-xl relative border border-gray-200"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-black transition"
        >
          <IoClose size={22} />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-black mb-6 text-center">
          Payment By Card
        </h2>

        {/* Card Input */}
        <div className="p-3 border border-gray-300 rounded-lg mb-4 bg-gray-50">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#000", // black text
                  fontFamily: "Rubik, sans-serif",
                  "::placeholder": { color: "#555" }, // dark gray placeholder
                },
                invalid: { color: "#e53935" }, // red for invalid
              },
            }}
            onChange={(event) => {
              if (event.error) {
                setCardError(event.error.message);
              } else {
                setCardError("");
              }
            }}
          />
        </div>

        {/* Error Messages */}
        {cardError && (
          <p className="text-red-600 text-sm text-center mb-2">{cardError}</p>
        )}
        {error && (
          <p className="text-red-600 text-sm text-center mb-2">{error}</p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 transition"
        >
          
          {loading ? <span className="loading loading-bars loading-xs"></span>:`Pay ৳ ${products.totalPrice}`}
        </button>
      </form>

    </div>
  )
}

export default Payment
