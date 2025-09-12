import Banner from "@/Components/Banner/Banner";
import Offers from "@/Components/Offers/Offers";
import Products from "@/Components/Products/Products";
import TrustCard from "@/Components/Trustcard/TrustCard";




export default function Home() {

  return (
  <div>
    <Banner/>
    <TrustCard/>
    <Products/>
    <Offers/>
    
  </div>
  );
}
