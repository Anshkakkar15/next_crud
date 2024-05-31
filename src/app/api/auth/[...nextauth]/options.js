import dbConnect from "@/lib/db";
import userModel from "@/model/User";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        dbConnect();
        try {
          const user = await userModel.findOne({
            $or: [
              { email: credentials.identifier },
              { password: credentials.identifier },
            ],
          });

          if (!user) {
            throw new Error("No User found with this email and username");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your email first before login");
          }

          const isPasswordCorrected = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (isPasswordCorrected) {
            return user;
          } else {
            throw new Error("Incorrect Password");
          }
        } catch (error) {
          throw new Error(error);
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      return session;
    },

    async jwt({ token, user }) {
      return user;
    },
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/sign-in",
  },
};
