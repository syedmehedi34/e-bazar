import axios from "axios";

export const getCategory = async ()=>{
    const res = await axios.get(`http://localhost:5000/shopping`);
    const products = await res?.data?.allProducts
    
    return products
}

