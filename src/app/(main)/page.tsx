'use client'

import Banner from "@/Components/Banner/Banner";
import Blogs from "@/Components/Blogs/Blogs";
import Faq from "@/Components/Faq/Faq";
import Fashion from "@/Components/Footer/Fashion/Fashion";
import Offers from "@/Components/Offers/Offers";
import Products from "@/Components/Products/Products";
import Subscribe from "@/Components/Subscribe/Subscribe";
import Testimonial from "@/Components/Testimonial/Testimonial";
import TrustCard from "@/Components/Trustcard/TrustCard";
export default function Home() {

  return (
    <div>
      <Banner />
      <Fashion />
      <Products />
      <Offers />
      <Blogs />

      <Faq />

      <Testimonial />

      <TrustCard />
      <Subscribe />
    </div>
  );
}
