import { User } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import getDataUri from '../utils/dataURI.js';
import cloudinary from '../utils/cloudinary.js';
export const register = async (req, res) => {
    try {

        const { fullname, email, phoneNumber, role, password } = req.body;

        if (!fullname || !email || !phoneNumber || !role || !password) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        // check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
                success: false
            });
        }

        let profilePhoto = "";

        // upload image only if file exists
        if (req.file) {

            const fileURI = getDataUri(req.file);

            const cloudResponse = await cloudinary.uploader.upload(
                fileURI.content
            );

            profilePhoto = cloudResponse.secure_url;
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user
        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto
            }
        });

        return res.status(201).json({
            message: "Account created successfully",
            success: true
        });

    } catch (error) {

        console.log("REGISTER ERROR:", error);

        return res.status(500).json({
            message: "Registration failed",
            success: false
        });
    }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
        success: false
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false
      });
    }

    if (user.suspended) {
      return res.status(403).json({
        message: "Your account has been suspended by the admin.",
        success: false
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false
      });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: '1d' }
    );

    const roleRedirects = {
      admin: '/allUsers',
      recruiter: '/admin/companies',
      student: '/'
    };
    const redirectUrl = roleRedirects[user.role] || '/';

    const userData = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'strict'
      })
      .json({
        message: `Welcome back, ${user.fullname}!`,
        success: true,
        user: userData,
        redirectUrl
      });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({
      message: "Internal server error. Please try again later.",
      success: false
    });
  }
};
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "User logged out successfully",
            success: true
        })
    } catch {
        console.log(error);
    }
}
export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const file = req.file;
        let cloudResponse;
        if (file) {
            const fileURI = getDataUri(file);
            cloudResponse = await cloudinary.uploader.upload(fileURI.content);
        }
        let skillsArray;
        if (skills) {
            skillsArray = skills.split(',');
        }
        const userId = req.id;
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found!",
                success: false
            });
        }

        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skillsArray) user.profile.skills = skillsArray;

        if (cloudResponse) {
            user.profile.resume = cloudResponse.secure_url;
            user.profile.resumeOriginalName = file.originalname;
        }
        await user.save();
        const updatedUser = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };
        return res.status(200).json({
            message: "Profile updated successfully!",
            user: updatedUser,
            success: true
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({
            message: "An error occurred while updating the profile.",
            success: false
        });
    }
};
