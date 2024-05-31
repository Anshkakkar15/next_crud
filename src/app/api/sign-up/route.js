import dbConnect from "@/lib/db";
import userModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request) {
  dbConnect();
  try {
    const { username, email, password } = await request.json();
    const existingVerifiedUserByUsername = await userModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUserByUsername) {
      return Response.json(
        {
          message: "Username is already taken",
          success: false,
        },
        { status: 400 }
      );
    }

    const existingUserByEmail = await userModel.findOne({ email });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json({
          success: false,
          message: "User with this email already exist",
        });
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const newUser = new userModel({
        username,
        email,
        verifyCode,
        password: hashedPassword,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
      });

      await newUser.save();
    }

    //   send verification email

    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { success: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User Registered Successfully! Please verify your email",
      },
      { success: 200 }
    );
  } catch (error) {
    console.log("Error registering user", error);
    return Response.json(
      { message: "Error registering user", success: false },
      { status: 500 }
    );
  }
}
