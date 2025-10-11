import axios from "axios"

export const fetchData = async (endpoint :  string)=>{
    try {
        const res = await axios.get(`https://e-bazaar-server-three.vercel.app/${endpoint}`);
        return res?.data;
    } catch (error) {
        console.error((error as Error).message)
    }
}