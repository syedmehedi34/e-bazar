import React from 'react'

const Faq = () => {
    const faqs = [
        {
            question: "How can I place an order?",
            answer:
                "Browse our products, add your desired items to the cart, and proceed to checkout. You can complete your order by providing shipping details and payment information.",
        },
        {
            question: "What payment methods do you accept?",
            answer:
                "We accept major credit/debit cards, mobile banking (Bkash, Nagad, Rocket), and Cash on Delivery (COD) for local orders.",
        },
        {
            question: "How long does delivery take?",
            answer:
                "Delivery usually takes 2-5 business days within Bangladesh. International shipping times vary depending on the destination.",
        },
        {
            question: "Can I return or exchange a product?",
            answer:
                "Yes, you can return or exchange products within 7 days of delivery if they are unused and in original packaging. Some items may not be eligible for return (e.g., sale items).",
        },
        {
            question: "Do you offer discounts for bulk purchases?",
            answer:
                "Yes, we offer special pricing and discounts for bulk or wholesale orders. Please contact our support team for more details.",
        },
    ];

    return (
        <div className='py-16'>
            <div className='container-custom'>
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                    Frequently Asked Questions
                </h2>
                <p className="text-gray-600 mt-2 text-sm md:text-base max-w-2xl mx-auto">
                    Find answers to common questions about orders, payments, delivery, and more. 
                    If you still need help, feel free to contact our support team anytime.
                </p>
            </div>
                <div className="join join-vertical w-full space-y-4 ">
                    {
                        faqs.map((faq) => (
                            <div key={faq.answer} className="collapse collapse-arrow join-item border-gray-800 border-l rubik">
                                <input type="radio" name="my-accordion-4" defaultChecked />
                                <div className="collapse-title font-semibold">{faq.question}</div>
                                <div className="collapse-content text-sm">{faq.answer}</div>
                            </div>
                        ))
                    }

                </div>
            </div>
        </div>
    )
}

export default Faq