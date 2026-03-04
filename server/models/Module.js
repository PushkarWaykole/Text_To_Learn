import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema(
    {
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
            index: true,      // fast lookup of all modules for a given course
        },
        title: {
            type: String,
            required: [true, 'Module title is required'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters'],
        },
        order: {
            type: Number,
            required: true,
            min: 0,
        },
        // Raw AI-generated JSON content (array of lesson blocks)
        // e.g. [{ type: 'heading', text: '...' }, { type: 'video', url: '...' }]
        content: {
            type: mongoose.Schema.Types.Mixed,
            default: [],
        },
        videoUrl: {
            type: String,
            default: '',
        },
        audioUrl: {
            type: String,
            default: '',
        },
        pdfData: {
            type: Buffer,
            default: null,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Compound index: fetch all modules for a course in order, excluding deleted
moduleSchema.index({ course: 1, isDeleted: 1, order: 1 });

const Module = mongoose.model('Module', moduleSchema);
export default Module;
