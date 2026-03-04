import mongoose from 'mongoose';

const videoCacheSchema = new mongoose.Schema({
    searchQuery: {
        type: String,
        required: true,
        unique: true,
        index: true,
        lowercase: true,
        trim: true
    },
    videoUrl: {
        type: String,
        required: true
    }
}, { timestamps: true });

export default mongoose.model('VideoCache', videoCacheSchema);
