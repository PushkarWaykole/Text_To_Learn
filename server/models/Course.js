import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Course title is required'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        description: {
            type: String,
            trim: true,
            default: '',
        },
        topic: {
            type: String,
            required: [true, 'Topic is required'],
            trim: true,
        },
        language: {
            type: String,
            default: 'en',
            enum: ['en', 'hi', 'hinglish'],
        },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,      // fast lookups for "my courses" queries
        },
        modules: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Module',
            },
        ],
        isDeleted: {
            type: Boolean,
            default: false,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index: list all non-deleted courses for a user, sorted by date
courseSchema.index({ creator: 1, isDeleted: 1, createdAt: -1 });

const Course = mongoose.model('Course', courseSchema);
export default Course;
