import { verifySchema } from './../../../schemas/verifySchema';
import dbConnect from "@/lib/dbConnect";
import UserModal from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request){
    await dbConnect();

    try{
        const {username, email, password} =  await request.json();
        // Check if user already exists with same username or email
        const existingUserVerifiedByUsername = await UserModal.findOne({ username });
        if(existingUserVerifiedByUsername){
            return Response.json(
                { success: false, message: "Username is already taken" },
                { status: 400 }
            )
        }

        const existingUserVerifiedByEmail = await UserModal.findOne({ email});
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString(); //To generate random 6 digit code

        if(existingUserVerifiedByEmail){
            if(existingUserVerifiedByEmail.isVerified){
                return Response.json(
                    { success: false, message: "Email is already registered" },
                    { status: 400 }
                )
            } else{
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserVerifiedByEmail.username = username;
                existingUserVerifiedByEmail.password = hashedPassword;
                existingUserVerifiedByEmail.verifyCode = verifyCode;
                existingUserVerifiedByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000); //To set expiry time for 1 hour
                await existingUserVerifiedByEmail.save();
            }

        } else{
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1); //To set expiry time for 1 hour

            const newUser = new UserModal({
                    username,
                    email,
                    password: hashedPassword,
                    verifyCode,
                    verifyCodeExpiry: expiryDate,
                    isVerified: false,
                    isAcceptingMeaage: true,
                    messages: [],
                    createdAt: new Date()
            })

            await newUser.save();
            
        }

        //Send verification email
        const emailResponse =  await sendVerificationEmail(email, username, verifyCode);

        if(!emailResponse.success){
            return Response.json(
                { success: false, message: emailResponse.message },
                { status: 500 }
            )
        }
        return Response.json(
            { success: true, message: "User registered successfully. Please check your email for verification code." },
            { status: 201 }
        )

    } catch (error){
        console.error("Error in registering user", error);
        return Response.json(
            { success: false, message: "Error in registering user" },
            { status: 500 }
        )
    }
}