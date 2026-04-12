import mongoose from "mongoose";
const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    requirements: [{
        type: String,
        required: true
    }],
    salary: {
        type: String,
        required: true
    },
    experienceLevel: {
        type: String,
        required: true
    },
    location: [{
        type: String,
        required: true
    }],
    jobType: {
        type: String,
        required: true
    },
    position: {
        type: Number,
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    savedJobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SavedJob'
    }],
    applications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application'
    }],
    endDate: { type: Date, required: true },
}, { timestamps: true })
export const Job = mongoose.model('Job', jobSchema);