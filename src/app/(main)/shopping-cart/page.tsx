'use client'
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { MdDeleteForever } from "react-icons/md";
import { decrementQuantity, incrementQuantity } from '@/redux/feature/addToCart/addToCart';
import Button from '@/Components/Button/Button';
import { MdArrowRightAlt } from "react-icons/md";
const ShoppingCart = () => {
  const cartItems = useSelector((state: any) => state.cart.value);
  const dispatch = useDispatch()
  const subTotal = () => {
    const total = cartItems.reduce((acc: number, cart: any) => acc + cart.price * cart.quantity, 0);
    
    return total;
  }
  const discount = () => {
    const total = cartItems.reduce((acc: number, cart: any) => acc + cart.discountPrice * cart.quantity, 0);
    
    return total;
  }

  const discountPercentage =()=>{
    if(subTotal() ===0) return 0;
    const discountAmount = subTotal()- discount();
    return ((discountAmount / subTotal()*100).toFixed())
  }
  
  return (
    <div className='min-h-screen bg-gray-200'>
      <div className=''>
        <div className='min-h-[24vh] flex justify-center items-center flex-col gap-2 bg-gray-100 rubik'>
          <p className='text-4xl font-bold tracking-wide'> Your Shopping Cart</p>
          <Link className='text-sm font-thin text-gray-500 underline' href={'/shop'}> → Shop</Link>
        </div>
        <div className='w-11/12 mx-auto my-10'>
          <div className='grid lg:grid-cols-3 gap-4'>
            <div className='col-span-2 bg-gray-100 p-4 '>
              <div>
                <nav className='flex justify-between bg-base-100 p-4 mb-4 rounded-box'>
                  <h4 className='text-md rubik'>Your Cart</h4>
                  <button className='cursor-pointer hover:text-red-600 transition-all duration-300'>Delete</button>
                </nav>
              </div>
              <div>
                <div className='space-y-4 rubik list bg-base-100 rounded-box '>
                  {
                    cartItems.map((cart: any) => (
                      <li key={cart._id} className="list-row">
                        <div>
                          <Image className='size-10 rounded-box shadow' src={cart.images[0] || cart.images[1]} width={30} height={30} alt={cart.title} />
                        </div>
                        <div>
                          <p className='tracking-wide'>{cart.title}</p>
                          <p className='text-sm'> <strong>brand: </strong>{cart.brand}</p>
                          <div className="text-xs uppercase font-semibold ">৳ {cart.discountPrice}</div>
                        </div>

                        <div>
                          <div className='flex items-center'>
                            <button
                              onClick={() => dispatch(decrementQuantity(cart._id))}
                              className='btn btn-square'>-</button>
                            <p className='px-4 font-bold'>{cart?.quantity}</p>
                            <button
                              onClick={() => dispatch(incrementQuantity(cart._id))}
                              className='btn btn-square'>+</button>
                          </div>
                        </div>

                        <button className="btn btn-square btn-ghost">
                          <MdDeleteForever size={24} />

                        </button>
                      </li>
                    ))
                  }
                </div>

              </div>
            </div>
            <div className='bg-gray-100 p-4'>
              <div>
                <h4 className='font-bold mb-4'>Order Summary</h4>
                <form className='flex gap-5 mb-8' >
                  <input type="text" className='py-3 border w-full rounded-box px-4 border-gray-400' />
                  <Button text={'Apply'} />
                </form>
                <div className='flex justify-between items-center mb-4'>
                  <p>SubTotal</p>
                  <strong>
                    ৳ {subTotal()}
                  </strong>
                </div>
                <div className='flex justify-between items-center mb-4'>
                  <p className=''>  Discount <strong>({discountPercentage()}%)</strong></p>
                  <strong>
                    ৳ {discount()}
                  </strong>
                </div>
                <div className='flex justify-between items-center mb-4'>
                  <p>Delivery</p>
                  <strong>
                    ৳ 100
                  </strong>
                </div>
                <div className="divider"></div>
                <div className='flex justify-between items-center mb-4'>
                  <p className='font-medium'>Total</p>
                  <strong>
                    ৳ {(discount()) + 100}
                  </strong>
                </div>
                <div>
                  <button className='flex items-center justify-center gap-4 text-center w-11/12 mx-auto bg-gray-800 text-white cursor-pointer p-4 rounded-box hover:bg-gray-900'>
                    Go to Checkout <MdArrowRightAlt />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ShoppingCart