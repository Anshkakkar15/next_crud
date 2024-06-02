import dbConnect from "@/lib/db";
import userModel from "@/model/User";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();
        try {
          const user = await userModel.findOne({
            $or: [
              { email: credentials.identifier },
              { password: credentials.identifier },
            ],
          });

          console.log(user);

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
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.username = token.username;
        session.user.email = token.email;
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.username = user.username;
        token.email = token.email;
      }
      return token;
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
