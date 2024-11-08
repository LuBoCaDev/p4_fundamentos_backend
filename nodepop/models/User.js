import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    email: { type: String, unique: true },
    password: String
});

userSchema.pre('save', async function (next) {
    if (this.isModified('password') || this.isNew) {
        this.password = await bcrypt.hash(this.password, 7);
    }
    next();
});

userSchema.methods.comparePassword = function (clearPassword) {
    return bcrypt.compare(clearPassword, this.password);
};

userSchema.statics.hashPassword = function (clearPassword) {
    return bcrypt.hash(clearPassword, 7);
};

const User = mongoose.model('User', userSchema);

export default User;
