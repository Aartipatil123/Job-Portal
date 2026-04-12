import { Job } from "../models/job.model.js";
import { SavedJob } from "../models/SavedJob.model.js";
import mongoose from "mongoose";

export const postJob = async (req, res) => {
    try {
        const {
            title,
            description,
            requirements,
            location,
            salary,
            jobType,
            experience,
            position,
            companyId,
            endDate
        } = req.body;
        const userId = req.id;
        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId || !endDate) {
            return res.status(400).json({
                message: "All fields, including job salary range and experience range, are required",
                success: false
            });
        }
        const requirementsArray = requirements.split(',').map(item => item.trim()).filter(item => item.length > 0);
        const locationArray = location.split(',').map(item => item.trim()).filter(item => item.length > 0);
        const jobEndDate = new Date(endDate);
        if (isNaN(jobEndDate.getTime()) || jobEndDate <= new Date()) {
            return res.status(400).json({
                message: "End date must be a valid future date",
                success: false
            });
        }
        const job = await Job.create({
            title,
            description,
            requirements: requirementsArray,
            salary: salary,
            location: locationArray,
            jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            created_by: userId,
            endDate: jobEndDate
        });
        return res.status(201).json({
            message: "Job created successfully!",
            success: true,
            job
        });
    } catch (error) {
        console.error("Error posting job:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message
        });
    }
};
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || '';
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };
        const jobs = await Job.find(query).populate({
            path: "company"
        }).sort({ createdAt: -1 });
        if (!jobs) {
            return res.status(404).json({
                message: "No jobs found",
                success: false
            });
        }
        return res.status(200).json({
            jobs,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: "applications"
        });
        if (!job) {
            return res.status(404).json({
                message: "Jobs not found",
                success: false
            });
        };
        return res.status(200).json({
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}

export const saveJob = async (req, res) => {
    try {
        console.log("Received jobId:", req.params.id);
        const userId = req.id;
        const jobId = req.params.id;
        if (!userId) {
            return res.status(401).json({ message: "Please log in to save job", success: false });
        }
        if (!jobId) {
            return res.status(400).json({ message: "Invalid job ID", success: false });
        }
        const alreadySaved = await SavedJob.findOne({ job: jobId, user: userId });
        if (alreadySaved) {
            return res.status(400).json({ message: "You have already saved this job", success: false });
        }
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found", success: false });
        }
        const newSavedJob = await SavedJob.create({ job: jobId, user: userId });
        job.savedJobs.push(newSavedJob._id);
        await job.save();
        return res.status(201).json({ message: "Job Saved successfully!", success: true });
    } catch (error) {
        console.error("Error saving job:", error.message);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

export const getSavedJobs = async (req, res) => {
    try {

        const userId = req.id;
        if (!userId) {
            return res.status(401).json({
                message: "Please log in to view saved jobs",
                success: false
            });
        }

        const savedJobs = await SavedJob.find({ user: userId }).sort({ createdAt: -1 }).populate({
            path: "job",
            options: { sort: { createdAt: -1 } },
            populate: {
                path: "company",
                options: { sort: { createdAt: -1 } }
            }
        });
        if (!savedJobs) {
            return res.status(404).json({
                message: "No saved jobs found!",
                success: false
            });
        }
        return res.status(200).json({
            savedJobs,
            success: true
        });
    } catch (error) {
        console.error("Error fetching saved jobs:", error.message);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message
        });
    }
};


















export const removeSavedJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        if (!userId) return res.status(401).json({ message: "User not authenticated", success: false });

        if (!mongoose.Types.ObjectId.isValid(jobId)) return res.status(400).json({ message: "Invalid jobId", success: false });

        const deletedJob = await SavedJob.findOneAndDelete({ job: jobId, user: userId });
        if (!deletedJob) return res.status(404).json({ message: "Saved job not found", success: false });
        res.status(200).json({ message: "Saved job removed successfully!", success: true });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

export const getAdminJob = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path: "company",
            createdAt: -1
        });
        if (!jobs) {
            return res.status(404).json({
                message: "No jobs found",
                success: false
            });
        };
        return res.status(200).json({
            jobs,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}
































export const deleteJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        const deleteJob = await Job.findByIdAndDelete({ _id: jobId, created_by: userId });
        if (!deleteJob) {
            return res.status(404).json({
                message: "Job not found!",
                success: false,
            });
        }
        return res.status(200).json({
            success: true,
            message: "Job deleted successfully!",
        });
    } catch (error) {
        console.log('Error deleting job:', error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message,
        });
    }
};
