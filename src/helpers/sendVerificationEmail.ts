import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmal";
import { APIResponse } from "@/types/APIResponse";


export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<APIResponse>{
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Mystery message | Verification Code',
            react: VerificationEmail({ username, otp: verifyCode })
        });
        return{
            success: true,
            message: "Verification email sent successfully"
        }

    } catch (emailError){
        console.error("Failed to send verification email", emailError);
        return{
            success: false,
            message: "Failed to send verification email"
        }
    }
}