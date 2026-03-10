import Banner from "@/Components/Banner";
import Blogs from "@/Components/Blogs/Blogs";
import Faq from "@/Components/Faq";
import Fashion from "@/Components/Footer/Fashion";
import Offers from "@/Components/Offers/Offers";
import Products from "@/Components/Products/Products";
import Subscribe from "@/Components/Subscribe";
import Testimonial from "@/Components/Testimonial";
import TrustCard from "@/Components/TrustCard";
import useUser from "@/hook/useUser";
export default function Home() {
  return (
    <div>
      <Banner />
      <Fashion />
      <Products /> {/* Just For You section */}
      <Offers />
      <Blogs />
      <Faq />
      <Testimonial />
      <TrustCard />
      <Subscribe /> {/* need to add email subscription (emailjs) */}
    </div>
  );
}
