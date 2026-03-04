import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        auth0Id: {
            type: String,
            required: true,
            unique: true,
            index: true,       // fast lookup by Auth0 sub on every login
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        name: {
            type: String,
            trim: true,
            default: '',
        },
        picture: {
            type: String,
            default: '',
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,       // createdAt, updatedAt managed automatically
    }
);

const User = mongoose.model('User', userSchema);
export default User;
