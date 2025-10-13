
import { getCheckoutDataById } from '@/hook/CheckoutDataFatch/checkoutDataFeatch'
import React from 'react'

import CheckoutDescription from '@/Components/Checkout/CheckoutDescription'

import BackButton from '@/Components/Button/BackButton/BackButton'
import ImagesGalleryClientWrapper from '@/Components/Checkout/ImagesGalleryClientWrapper'

const CheckoutPage = async ({params}: { params: Promise<{ id: string }> }) => {
    const {id} = await params;
  
    const products = await getCheckoutDataById(id)
  
    return (
        <div className='min-h-screen py-10 '>
            <div className="container-custom ">
                <div className='mb-4'>
                    <BackButton/>
                </div>
                    <ImagesGalleryClientWrapper products={products} />

                <div >
                    {/* <CheckoutDescription/> */}
                    <CheckoutDescription products={products}/>
                </div>
            </div>
        </div>
    )
}

export default CheckoutPage