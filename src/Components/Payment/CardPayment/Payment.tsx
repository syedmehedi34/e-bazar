"use client"
import React, { useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'

import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useDeliveryDate } from '@/hook/useDeliveryDate/useDeliveryDate';
import { color } from 'framer-motion';

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
  products: ProductDetails
  formData: {
    name: string;
    phone: string;
    email: string;
    note: string;
    address: string;
    deliveryAddress: string;
    paymentMethod: string;
  };

}

const Payment: React.FC<PaymentProps> = ({ onClose, products, formData }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState("");
  const [cardError, setCardError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter()
  const deliveryData = useDeliveryDate(3)
  const generateTransactionId = () => {
    const prefix = "pay-e-bazaar";
    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${randomNumber}-${randomChars}`;
  }


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
      (res)
      const clientSecret = res?.data?.clientSecret;
      //confirm payment
      const { paymentIntent, error: confirmError } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: card,
            billing_details: {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,


            }
          }
        })

      if (confirmError) {
        toast.error(confirmError.message)
      }

      if (paymentIntent?.status === 'succeeded') {

        const orderDetails = {
          customer: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            deliveryAddress: formData.deliveryAddress,
            note: formData.note || "",
          },
          product: {
            id: products.productId,
            name: products.productName,
            brand: products.productBrand,
            category: products.productCategory,
            sizes: Array.isArray(products.productSizes) ? products.productSizes : [products.productSizes],
            colors: Array.isArray(products.productColors) ? products.productColors : [products.productColors],
            quantity: products.quantity,
            totalPrice: products.totalPrice,
            currency: products.productCurrency,
            image: products.productImage,
            description: products.productDescription,
          },
          payment: {
            method: formData.paymentMethod || "Card",
            orderStatus: "pending",
            paymentStatus: 'paid',
            verifiedByAdmin: false,
            transactionId: generateTransactionId(),
            amount: products.totalPrice,
            currency: products.productCurrency,
          },
          delivery: {
            date: deliveryData,
            status: "pending",
            charge: 100,
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const res = await axios.post('http://localhost:5000/order', { orderDetails })

        if (res.status === 200) {
          toast.success('Your Payment Successfully!')
          router.push('/my_orders')
        } else {
          console.error(res.data.message)
        }
      }
    } catch (error) {
      setError("Payment failed. Please try again.");
      console.error("Payment error:", (error as Error).message);
    } finally {
      setLoading(false)
    }

  }



  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <form
        onSubmit={handlePayment}
        className="w-[400px] bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white p-6 rounded-2xl shadow-xl relative border border-gray-200"
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
        <h2 className="text-2xl font-bold text-black dark:text-white mb-6 text-center">
          Payment By Card
        </h2>

        {/* Card Input */}
        <div className="p-3 border border-gray-300 rounded-lg mb-4 bg-gray-50  ">
          <CardElement
            
            options={{ 
              style: {
                base: {
                  fontSize: "16px",
                  color: "#000", 
                  fontFamily: "Rubik, sans-serif",
                  "::placeholder": {color:"#555"},
                 
                },
                invalid: { color: "#e53935" }, 
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

          {loading ? <span className="loading loading-bars loading-xs"></span> : `Pay ৳ ${products.totalPrice}`}
        </button>
      </form>

    </div>
  )
}

export default Payment
