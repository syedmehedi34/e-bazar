import axios from "axios";

export const fetchData = async (
  endpoint: string,
  params?: Record<string, unknown>,
) => {
  try {
    const query = params
      ? "?" + new URLSearchParams(params as Record<string, string>).toString()
      : "";
    const res = await axios.get(
      `https://e-bazaar-server-three.vercel.app/${endpoint}${query}`,
      { withCredentials: true },
    );
    return res.data;
  } catch (error) {
    console.error((error as Error).message);
  }
};
