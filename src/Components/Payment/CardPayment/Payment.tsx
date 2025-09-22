import React from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io'
import { IoClose } from 'react-icons/io5'

type PaymentProps = {
  onClose: () => void
}

const Payment: React.FC<PaymentProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="w-[400px] h-[200px] bg-white p-4 rounded-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 cursor-pointer"
        >
          <IoClose size={24}/>
        </button>
        <h2 className="text-xl font-semibold mb-4">Payment By Card</h2>
        <button className='btn btn-block bg-black text-white rounded-box'>Payment</button>
      </div>
    </div>
  )
}

export default Payment
