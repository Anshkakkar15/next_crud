import dbConnect from "@/lib/db";
import userModel from "@/model/User";

export async function POST(request) {
  dbConnect();
  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await userModel.findOne({ username: decodedUsername });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        { sucess: true, message: "Account Verified" },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        { sucess: false, message: "Verify code expired please sign up again" },
        { status: 400 }
      );
    } else {
      return Response.json(
        { sucess: false, message: "Incorrect Verification Code" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error in verification of email", error);
    return Response.json(
      { sucess: false, message: "Error verifying user" },
      { status: 500 }
    );
  }
}
