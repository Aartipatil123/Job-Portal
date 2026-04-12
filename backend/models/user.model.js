import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true,
        unique: true
    },
    phoneNumber:{
        type:Number,
        required: true,
    },
    password:{
        type:String,
        required: true,
        minlength: 8
    },
    role:{
        type: String,
        enum: ["student", "recruiter", "admin"],
        required: true
    },
    profile:{
        bio:{type: String},
        skills:[{type:String}],
        resume:{type:String},//URL of resume
        resumeOriginalName:{type:String},
        company:{type:mongoose.Schema.Types.ObjectId, ref:'Company'},
        profilePhoto:{type:String,default:""}
    },
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
    suspended: { type: Boolean, default: false },
},{timestamps:true});
UserSchema.virtual('companies', {
    ref: 'Company',
    localField: '_id',
    foreignField: 'userId'
});
UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });
export const User = mongoose.model('User',UserSchema);