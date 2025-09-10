import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import axios from 'axios'
console.log(process.env.GOOGLE_CLIENT_ID ,process.env.GOOGLE_CLIENT_SECRET ,process.env.NEXTAUTH_SECRET)
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    })
  ],
   secret: process.env.NEXTAUTH_SECRET as string,

   callbacks: {
  async signIn({ user }) {
    // if (!user) return false;

    // try {
    //   const res = await axios.post("http://localhost:5000/create/user", {
    //     name: user.name,
    //     email: user.email,
    //   });
    //   console.log("User API Response:", res.data);
    // } catch (error: any) {
    //   console.error("Error while creating user:", error.response?.data || error.message);
    //   return false;
    // }

    return true; // Sign in allow
  }
}

})

export { handler as GET, handler as POST };