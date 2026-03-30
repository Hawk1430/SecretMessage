import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModal from "@/model/User";
import { NextAuthOptions } from "next-auth";
import { email } from "zod";


export const authOptions: NextAuthOptions = {
   providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith@gmail.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any>{
                await dbConnect();
                try{
                    //used the MongoDB $or operator to check if the user exists with either the provided email or username. This allows users to log in using either their email address or their username, providing flexibility in the authentication process.
                    const user = await UserModal.findOne({
                        $or: [
                            {email: credentials.identifier},
                            {username: credentials.identifier}
                        ]
                    })
                    if(!user){
                        throw new Error("No user found with the provided email or username");
                    }
                    if(!user.isVerified){
                        throw new Error("Please verify your account before logging in");
                    }
                    
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                    if(!isPasswordCorrect){
                        throw new Error("Incorrect password");
                    }
                    return user;

                } catch(error){
                    throw new Error(error);
                }
            }
        })
   ],
   pages: {
        signIn: "sign-in",  
   },
   session: {
    strategy: "jwt",
   },
   secret: process.env.NEXTAUTH_SECRET,
}