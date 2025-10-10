"use client"
import Image from 'next/image'
import React from 'react'

const page = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rubik transition-colors duration-300">
      {/* ---------- Page Banner ---------- */}
      <nav
        className="bg-cover w-full h-[200px] flex justify-center items-center"
        style={{
          backgroundImage: `url("https://preview.colorlib.com/theme/cozastore/images/bg-01.jpg.webp")`,
        }}
      >
        <h2 className="text-3xl font-bold text-white tracking-wide">
          About Us
        </h2>
      </nav>

      {/* ---------- Container ---------- */}
      <div className="container-custom py-12 space-y-20">
        {/* ---------- Our Story Section ---------- */}
        <section className="grid lg:grid-cols-2 gap-10 ">
          {/* Text */}
          <div className="space-y-4">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 border-l-4 border-gray-900 dark:border-white pl-3">
              Our Story – The Journey of E-Bazaar
            </h1>
            <article className="space-y-4 leading-relaxed text-gray-700 dark:text-gray-300">
              <p>
                In today’s fast-paced digital world, online shopping has become
                more than just a convenience — it’s a lifestyle. But before
                E-Bazaar became a trusted name in Bangladesh’s e-commerce space,
                it started as a simple dream — a dream to make online shopping
                easier, safer, and more reliable for everyone.
              </p>
              <p>
                The story of E-Bazaar began with a small but passionate team of
                young tech enthusiasts who believed that the people of
                Bangladesh deserve a better online shopping experience. They
                noticed that although online stores were growing rapidly, many
                customers were struggling with low-quality products, delayed
                deliveries, and lack of trust. That’s when the idea of E-Bazaar
                was born — to bridge the gap between quality and convenience.
              </p>
              <p>
                From day one, E-Bazaar’s mission was clear: to deliver authentic
                products at fair prices with a seamless shopping experience. The
                founders spent months researching customer behavior, studying
                product quality, and building strong relationships with trusted
                suppliers. Every decision was driven by one question — “How can
                we make our customers’ online shopping experience better?”
              </p>
              <p>
                In the early days, E-Bazaar started small — with just a few
                product categories like fashion, electronics, and accessories.
                But with a growing base of satisfied customers and a reputation
                for honesty, the platform quickly expanded into home appliances,
                beauty products, groceries, and tech gadgets. Each product that
                appears on E-Bazaar goes through a strict quality check,
                ensuring customers receive nothing but the best.
              </p>
              <p>
                Today, E-Bazaar stands as a growing e-commerce ecosystem that
                connects thousands of customers with trusted sellers across the
                country. But this is just the beginning. The goal is to make
                E-Bazaar not only a shopping platform but also a digital
                lifestyle companion — where people can discover new trends,
                compare products, and enjoy an effortless buying experience.
              </p>

            </article>
          </div>

          {/* Image */}
          <div className="relative">
            <Image
              src="https://img.freepik.com/free-photo/young-trans-man-with-apron-working-as-waiter_23-2149409812.jpg?t=st=1760091890~exp=1760095490~hmac=f83d05abefb4dcfc37cb0cefc3ec3b281bc93c02c705c0b9974019de5201d204&w=2000"
              width={600}
              height={400}
              alt="Our Story"
              className="rounded-2xl shadow-md w-[100%] md:w-[80%] object-cover mx-auto"
            />
          </div>
        </section>

        {/* ---------- Our Mission Section ---------- */}
        <section className="grid lg:grid-cols-2 gap-10 items-center rubik text-gray-800 dark:text-gray-200">
          {/* Text */}
          <div className="space-y-4 order-1 md:order-2">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 border-l-4 border-gray-900 dark:border-white pl-3">
              Our Mission
            </h1>

            <article className="space-y-4 leading-relaxed">
              <p>
                At <span className="font-semibold">E-Bazaar</span>, our mission is simple yet powerful —
                to redefine online shopping in Bangladesh by making it more reliable,
                affordable, and customer-focused. We believe that every person deserves
                access to quality products and a smooth, trustworthy shopping experience
                from the comfort of their home.
              </p>
              <p>
                We are committed to creating an ecosystem that connects customers directly
                with authentic brands and verified sellers. Every product listed on
                E-Bazaar is carefully reviewed to ensure quality and value. From fashion
                and electronics to daily essentials, our goal is to offer everything our
                customers need — all in one reliable platform.
              </p>
            </article>

            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Build Trust:</strong> Create a reliable platform where customers can
                shop with confidence; every product is authentic and verified.
              </li>
              <li>
                <strong>Ensure Quality:</strong> Offer only high-quality products from trusted
                brands and suppliers, ensuring real value for money.
              </li>
              <li>
                <strong>Empower Local Sellers:</strong> Support small and local businesses by
                giving them digital visibility and growth opportunities.
              </li>
              <li>
                <strong>Enhance Convenience:</strong> Provide a seamless shopping experience
                with fast delivery, easy returns, and secure payments.
              </li>
              <li>
                <strong>Innovate Continuously:</strong> Use modern technology to improve the
                user experience — from smart recommendations to responsive design.
              </li>
              <li>
                <strong>Customer Satisfaction First:</strong> Act on feedback and constantly
                improve our services to meet customer needs.
              </li>
              <li>
                <strong>Transparency & Integrity:</strong> Operate with honesty and openness in
                every step — from pricing to delivery.
              </li>
              <li>
                <strong>Sustainability:</strong> Encourage ethical practices and eco-friendly
                packaging for a better tomorrow.
              </li>
            </ul>
          </div>

          {/* Image */}
          <div className="relative order-2 md:order-1 flex justify-center">
            <div className="relative"> <Image src="https://img.freepik.com/free-photo/people-sharing-ideas-while-studying_23-2147656100.jpg?t=st=1760092036~exp=1760095636~hmac=5001107f4dc19daab17a83e19343f657f0393cb2caf71e79ef1cec658f1f7526&w=2000" width={600} height={400} alt="Our Story" className="rounded-2xl shadow-md w-[100%] lg:w-[90%] object-cover " /> </div>
          </div>
        </section>

      </div>
    </div>
  )
}

export default page
