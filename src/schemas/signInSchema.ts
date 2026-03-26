import z from "zod";

export const signInSchema = z.object({
    indentifier: z.email({message: "Please provide a valid email address"}).toLowerCase(),
    password: z.string().min(6, {message: "Password must be at least 6 characters long"})   
})