import mongoose from 'mongoose';

export const connectDB = async () => {
    await mongoose.connect("mongodb://localhost:27017/mediCare").then(() => {
        console.log('MongoDB connected successfully');
    }).catch((error) => {
        console.error('MongoDB connection error:', error);
    });
};
