import faqs from "@/lib/faqs";
import React from "react";

const Faq = () => {
  return (
    <div className="py-16">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 dark:text-white mt-2 text-sm md:text-base max-w-2xl mx-auto">
            Find answers to common questions about orders, payments, delivery,
            and more. If you still need help, feel free to contact our support
            team anytime.
          </p>
        </div>
        <div className="join join-vertical w-full space-y-4 ">
          {faqs.map((faq) => (
            <div
              key={faq.answer}
              className="collapse collapse-arrow join-item border-gray-800 border-l rubik dark:text-white"
            >
              <input type="radio" name="my-accordion-4" defaultChecked />
              <div className="collapse-title font-semibold">{faq.question}</div>
              <div className="collapse-content text-sm">{faq.answer}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faq;
