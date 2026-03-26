import mongoose  from "mongoose";

type ConnectionObject = { 
    isConnected?: number
}

const connection: ConnectionObject = {}

async function dbConnect(): Promise<void> {
    // to avoid multiple connection (is already connected)
    if(connection.isConnected){
        console.log("Already connected to database");
        return;
    }

    try{
        const db = await mongoose.connect(process.env.MONGODB_URI as string);
        connection.isConnected = db.connections[0].readyState
        console.log("DB connected successfully")
    } catch (err) {
        console.error("DB connection failes", err)
        process.exit(1)
    }
}

export default dbConnect;