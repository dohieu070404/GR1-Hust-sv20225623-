import mongoose from "mongoose";

const Connection= async () => {
    try {
        const conn = await mongoose.connect( 'mongodb+srv://dohieu:11223344@cluster0.yx0gtlz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default Connection;