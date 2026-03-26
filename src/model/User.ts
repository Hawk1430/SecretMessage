import mongoose, {Schema, Document} from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }
})

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMeaage: boolean;
    messages: Message[];
    createdAt: Date;
}


const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],     //[condition, error message]
        trim: true,     //To remove spaces
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [ /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi  , "Please provide a valid email address"]    //To match using regex
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    verifyCode: {
        type: String,
        required: [true, "Verify code is required"],
    },
    verifyCodeExpiry: {
        type: Date,
         required: [true, "Verify code expiry is required"]
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAcceptingMeaage: {
        type: Boolean,
        default: true,
    },
    messages: [MessageSchema],    //As it have custom schema
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

//As NextJs is edge time framework( means it will run when user requests ), so running backend in it when we export model we do like this as if model is already created then it will not create again

const UserModal = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User", UserSchema);



export default UserModal