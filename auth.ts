import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/mongoose"
import Teacher from "@/models/Teacher"
import { authConfig } from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const username = credentials.username as string;
        const password = credentials.password as string;

        if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
          return { id: "admin", name: "Admin", role: "admin" }
        }

        await dbConnect();
        const teacher = await Teacher.findOne({ username });
        if (!teacher) return null;

        const isMatch = await bcrypt.compare(password, teacher.password);
        if (!isMatch) return null;

        return { id: teacher._id.toString(), name: teacher.fullName, role: "teacher" };
      }
    })
  ],
  session: { strategy: "jwt" }
})
