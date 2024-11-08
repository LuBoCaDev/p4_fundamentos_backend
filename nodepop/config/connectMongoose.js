// En config/connectMongoose.js
import mongoose from 'mongoose';

const connectMongoose = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/nodepop');
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection error:', error);
    }
};

export default connectMongoose;
