import React from 'react'
import { FaShippingFast } from "react-icons/fa";
import { MdOutlineSupportAgent } from "react-icons/md";
import { RiUserSharedFill } from "react-icons/ri";
import { FaGift } from "react-icons/fa6";
const TrustCard = () => {
    const cards = [
        {
            icons:<FaShippingFast />,
            title:"Free Shipping",
            description:"When you spend ৳ 2K +"
        },
        {
            icons:<MdOutlineSupportAgent />,
            title:"Call Us Anytime",
            description:"+880-123222323"
        },
        {
            icons:<RiUserSharedFill />,
            title:"Cart With Us",
            description:"We offer 24 hour chat support"
        },
        {
            icons:<FaGift />,
            title:"Gift Cards",
            description:"For your loved one, in any amount"
        }
    ]
  return (
    <div className='my-5'>
        <div className='w-11/12 mx-auto'>
            <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                {
                    cards.map((card)=>{
                        return(
                            <div className='flex items-center gap-4 shadow shadow-white py-6 px-4 rounded-md cursor-pointer'>
                                <div className='text-3xl bg-purple-600 p-2 rounded-md'>
                                    {card.icons}
                                </div>
                                <div className=''>
                                    <p className='text-lg font-bold'>{card.title}</p>
                                    <p className='text-sm '>{card.description}</p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    </div>
  )
}

export default TrustCard