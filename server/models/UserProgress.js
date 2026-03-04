import mongoose from 'mongoose';

const userProgressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
        index: true
    },
    completedModules: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module'
    }],
    quizChoices: [{
        moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module' },
        questionIndex: Number,
        selectedOption: String
    }],
    isCourseCompleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Ensure one progress record per user per course
userProgressSchema.index({ user: 1, course: 1 }, { unique: true });

export default mongoose.model('UserProgress', userProgressSchema);
