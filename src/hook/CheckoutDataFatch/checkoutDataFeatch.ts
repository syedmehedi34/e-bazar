
export const  getCheckoutDataById = async (id:string) => {
    const res = await fetch(`https://e-bazaar-server-three.vercel.app/checkout/${id}`);
    const data = await res.json();
    return data
}