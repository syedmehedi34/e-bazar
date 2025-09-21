
export const  getCheckoutDataById = async (id:string) => {
    const res = await fetch(`${process.env.BASE_URL}checkout/${id}`);
    const data = await res.json();
    return data
}