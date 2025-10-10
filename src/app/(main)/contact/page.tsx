"use client"
import React, { useState } from 'react'
import { AiOutlineMail } from "react-icons/ai";
import { CiLocationOn } from "react-icons/ci";
import { PiPhoneThin } from "react-icons/pi";
import { toast } from 'react-toastify';
interface FormData {
    fastName: string,
    lastName: string,
    email: string,
    message: string

}
const ContactPage = () => {
    const [formData, setFormData] = useState<FormData>({
        fastName: '',
        lastName: "",
        email: "",
        message:'',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev => ({ ...prev, [name]: value })))
    }
    const handleSubmit = (e: React.FormEvent<HTMLElement>) => {
        e.preventDefault();
        if (!formData.fastName || !formData.lastName || !formData.email || !formData.message) {
            return toast.error("Please fill in all fields!");
        }
        if (formData.fastName || formData.email || formData.lastName || formData.message) {
            toast.success("Your Message Send Successfully!");
            setFormData({
                fastName: '',
                lastName: "",
                email: "",
                message:''
            })
        }
    }



    return (
        <div className='min-h-screen'>
            <nav className='bg-cover w-full h-[200px]' style={{ backgroundImage: `url("https://preview.colorlib.com/theme/cozastore/images/bg-01.jpg.webp")` }}>
                <h2 className='flex justify-center items-center h-full text-2xl font-bold text-white tracking-wide'>Contact</h2>
            </nav>

            <div className="container-custom my-10 rubik">
                <div className='grid md:grid-cols-2'>
                    <form onSubmit={handleSubmit} className='border border-gray-300 dark:border-gray-600 md:p-8 p-4'>
                        <div className='flex justify-center items-center my-10'>
                            <p className='text-xl font-bold tracking-wide dark:text-white'>Send Your Message</p>
                        </div>
                        <div className='grid sm:grid-cols-2 gap-2 mb-4'>
                            <input
                                name="fastName"
                                value={formData.fastName}
                                onChange={handleChange}
                                placeholder="Enter Your Fast Name..."
                                className="w-full  px-4 border rounded-sm border-gray-300 dark:border-gray-600  py-3 dark:bg-gray-800 dark:text-white"
                            />
                            <input
                                name='lastName'
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Enter Your last Name..."
                                className="w-full  px-4  border rounded-sm border-gray-300 dark:border-gray-600  py-3 dark:bg-gray-800 dark:text-white"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="relative block">
                                <input
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter Your Email..."
                                    className="w-full  pl-12  border rounded-sm border-gray-300 dark:border-gray-600  py-3 dark:bg-gray-800 dark:text-white"
                                />
                                <p className='absolute top-[50%] translate-y-[-50%] left-3 dark:text-white'><AiOutlineMail size={24} /></p>
                            </label>
                        </div>

                        <div className='mb-6'>
                            <textarea
                                rows={8}
                                name='message'
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Write Your Message..."
                                className="w-full  p-2 border rounded-sm border-gray-300 dark:border-gray-600  py-3 dark:bg-gray-800 dark:text-white"
                            />
                        </div>
                        <input
                            type="submit"
                            placeholder="Enter Your Email..."
                            className="w-full  bg-gray-900 text-white  border rounded-sm border-gray-300 dark:border-gray-600  py-3 dark:bg-gray-800 dark:text-white"
                        />
                    </form>
                    <div className='border border-gray-300 dark:border-gray-600 dark:text-white md:p-16 p-8 '>
                        <div className='flex gap-5 mb-10'>
                            <div>
                                <CiLocationOn size={24} />
                            </div>
                            <div className=''>
                                <h2 className='text-xl font-medium mb-2 text-gray-600 dark:text-gray-100'>Address</h2>
                                <p className='text-gray-600 tracking-wide dark:text-gray-200'>E-Bazaar Industries Ltd.</p>
                                <p className='text-gray-600 tracking-wide dark:text-gray-200'>Dhanmondi 04, Dhaka , 1208 BD</p>
                            </div>
                        </div>
                        <div className='flex gap-5 mb-10'>
                            <div>
                                <PiPhoneThin size={24} />
                            </div>
                            <div className=''>
                                <h2 className='text-xl font-medium mb-2 text-gray-600 dark:text-gray-100'> Lets Talk</h2>
                                <p className='text-gray-600 tracking-wide dark:text-gray-200'>+880-1390000000</p>
                                <p className='text-gray-600 tracking-wide dark:text-gray-200'>+880-1600349990</p>
                            </div>
                        </div>
                        <div className='flex gap-5'>
                            <div>
                                <AiOutlineMail size={24} />
                            </div>
                            <div className=''>
                                <h2 className='text-xl font-medium mb-2 text-gray-600 dark:text-gray-100'>Support Email</h2>
                                <p className='text-gray-600 tracking-wide dark:text-gray-200'>e.bazaar@infogamil.com</p>
                                <p className='text-gray-600 tracking-wide dark:text-gray-200'>e.support@gmail.com</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='my-10'>
                    <iframe
                        className='w-full h-[400px] rounded-box border-2 border-gray-300'
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.893739459512!2d90.370923974792!3d23.751168388747917!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755bf529efccf5f%3A0x2febb133fe906d72!2s1208%2C%2004%20Dhanmondi%20Bridge%2C%20Dhaka%201205!5e0!3m2!1sen!2sbd!4v1760075990963!5m2!1sen!2sbd" loading="lazy" ></iframe>
                </div>
            </div>
        </div>
    )
}

export default ContactPage