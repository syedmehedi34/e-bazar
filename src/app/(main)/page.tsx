import Banner from "@/Components/Banner/Banner";
import Faq from "@/Components/Faq/Faq";
import Offers from "@/Components/Offers/Offers";
import Products from "@/Components/Products/Products";
import Subscribe from "@/Components/Subscribe/Subscribe";
import Testimonial from "@/Components/Testimonial/Testimonial";
import TrustCard from "@/Components/Trustcard/TrustCard";




export default function Home() {

  return (
  <div>
    <Banner/>
    <TrustCard/>
    <Products/>
    <Offers/>
    <Faq/>
    <Testimonial/>
    <Subscribe/>
    
  </div>
  );
}
