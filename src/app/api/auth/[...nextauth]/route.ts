import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import axios from 'axios'
import CredentialsProvider from 'next-auth/providers/credentials'

declare module "next-auth" {
  interface User {
    role?: string;
    id?: string;
  }
  interface Session {
    user: {
      id?: string;
      role?: string;
      email?: string;
      name?: string;
      image?: string;
    };
  }
}


const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'your@email.com' },
        password: { label: 'Password', type: 'password' }

      },
      async authorize (credentials) {
        // Replace this with your actual user authentication logic
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const userInfo = {
            email: credentials?.email,
            password: credentials?.password
          }
          const res = await axios.post(`http://localhost:5000/login`, userInfo)
          if (res.status === 200) {
            console.log(res.data)
            return res?.data.user
          }
        } catch (error) {
          console.error(error)
          return null
        }
      }
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    })
  ],

  pages: {
    signIn: '/src/Components/Login/login.tsx'
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60
  },
  secret: process.env.NEXTAUTH_SECRET as string,

  callbacks: {
    async jwt ({ token, user }) {
      if (user) {
      token.id = user.id;
      token.role = user.role; 
    }
      return token
    },
    async session ({ session, token }) {
      if (token) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session
    },
    async signIn ({ user }) {
      return true
    }
  }
})

export { handler as GET, handler as POST }
