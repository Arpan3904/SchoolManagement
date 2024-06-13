const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubmissionSchema = new Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    submissionDate: {
        type: Date,
        default: Date.now
    },
    submissionFile: {
        type: String,
        required: true
    },
    isPending: {
        type: Boolean,
        default: true
    }
});

const HomeworkSchema = new Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    questionLink: {
        type: String,
        required: true
    },
    submissions: [SubmissionSchema]
});

const Homework = mongoose.model('Homework', HomeworkSchema);

module.exports = Homework;