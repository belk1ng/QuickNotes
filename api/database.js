import mongoose from "mongoose";

class DatabaseClient {
    static MONGODB_HOST = process.env.MONGODB_HOST;

    connect () {
        mongoose.connect(DatabaseClient.MONGODB_HOST);
    
        mongoose.connection.on('error', (error) => {
            console.log(error);
            console.log("❌ MongoDB connection error. Make sure MongoDB is running")
        })
    }
    
    close () {
        mongoose.connection.close();
    }
    
}

export default new DatabaseClient()
