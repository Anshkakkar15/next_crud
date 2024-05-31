import { resend } from "@/lib/resend";

import VerificationEmail from "../../email/VerificationEmail";

export async function sendVerificationEmail(email, username, verifyCode) {
  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verification Code",
      react: VerificationEmail({ username: username, otp: verifyCode }),
    });
    console.log(data);
    console.log(error, "if error");
    return { success: true, message: "Verification email sent successfully." };
  } catch (emailError) {
    console.error("Error sending verification email:", emailError);
    return { success: false, message: "Failed to send verification email." };
  }
}
