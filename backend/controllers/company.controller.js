import { Company } from '../models/company.model.js'
import getDataUri from '../utils/dataURI.js';
import cloudinary from '../utils/cloudinary.js';
import mongoose from "mongoose";

export const getCompany = async (req, res) => {
    try {
        const userId = req.id;
        if (!userId) {
            return res.status(400).json({
                message: "User ID is required!",
                success: false,
            });
        }
        const companies = await Company.find({ userId }).sort({ createdAt: -1 });
        if (!companies) {
            return res.status(400).json({
                message: "No companies found!",
                success: false,
            });
        }
        return res.status(200).json({
            success: true,
            companies,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message,
        });
    }
};

export const registerCompany = async (req, res) => {
    try {
        const { companyName, description, website, location } = req.body;
        if (!companyName && !description && !website && !location) {
            return res.status(400).json({
                message: "Something is missing!",
                success: false
            })
        }
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "Company with this name already exists!",
                success: false
            })
        };
        company = await Company.create({
            name: companyName,
            description: description,
            website: website,
            location: location,
            userId: req.id
        });
        return res.status(201).json({
            message: "Company registered successfully!",
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const deleteCompany = async (req, res) => {
    try {
        const userId = req.id || req.user?.id || req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized', success: false });
        }
        const company = await Company.findOneAndDelete({ userId });
        if (!company) {
            return res.status(404).json({ message: 'No company found for this user', success: false });
        }
        return res.status(200).json({ message: 'Company deleted successfully', success: true });
    } catch (error) {
        console.error('Error in deleteCompany:', error);
        return res.status(500).json({ message: 'Internal Server Error', success: false, error: error.message });
    }
};

export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;

        if (!mongoose.isValidObjectId(companyId)) {
            return res.status(400).json({
                message: "Invalid company ID format!",
                success: false
            });
        }

        const company = await Company.findById(companyId).populate("userId", "name email");

        if (!company) {
            return res.status(404).json({
                message: "Company not found!",
                success: false
            });
        }

        return res.status(200).json({
            success: true,
            company
        });
    } catch (error) {
        console.error("Error fetching company:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message
        });
    }
};

export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;
        let locationArray = location ? location.split(',') : undefined;
        let updateData = { name, description, website, location: locationArray };

        if (req.file) {
            const fileURI = getDataUri(req.file);
            const cloudResponse = await cloudinary.uploader.upload(fileURI.content);
            updateData.logo = cloudResponse.secure_url;
        }

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!company) {
            return res.status(404).json({
                message: "Company not found!",
                success: false
            });
        }
        return res.status(200).json({
            message: "Company information updated successfully!",
            company,
            success: true
        });
    } catch (error) {
        console.error("Error updating company:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message
        });
    }
};
