"use client"
import React from 'react'
import { IoClose } from 'react-icons/io5';
interface PaymentMethodProps {
    onClose: () => void;

}
const PaymentMethod: React.FC<PaymentMethodProps> = ({ onClose }) => {
    return (
        <div className='fixed top-0 left-0 w-full h-full bg-black/60 z-[100] flex flex-col justify-center items-center '>
            <div className='bg-white p-8 rounded-lg shadow-lg  lg:w-6/12 md:w-8/12  w-11/12 relative'>
                <button>
                    <span onClick={onClose} className='btn btn-sm btn-circle absolute top-1 right-2'><IoClose size={24} /></span>
                </button>
            </div>
        </div>
    )
}

export default PaymentMethod