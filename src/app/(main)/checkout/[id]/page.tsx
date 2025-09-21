import { getCheckoutDataById } from '@/hook/CheckoutDataFatch/checkoutDataFeatch'
import React from 'react'
import ImagesGallery from '@/Components/Checkout/ImagesGallery'
const CheckoutPage = async ({params}: { params: Promise<{ id: string }> }) => {
    const {id} = await params
    const products = await getCheckoutDataById(id)
   
    return (
        <div className='min-h-screen '>
            <div className="container-custom">
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-10'>
                    <div>
                        <ImagesGallery products={products}/>
                    </div>
                    <div>2</div>
                </div>
            </div>
        </div>
    )
}

export default CheckoutPage