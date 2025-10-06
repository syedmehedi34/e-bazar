import axios from "axios"

export const fetchData = async (endpoint :  string)=>{
    try {
        const res = await axios.get(`http://localhost:5000/${endpoint}`);
        return res?.data;
    } catch (error) {
        (error)
    }
}