import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
export const applyJob = async (req,res) =>{
    try {
        const userId = req.id;
        const jobId = req.params.id;

        if (!userId) {
            return res.status(401).json({
                message: "Please log in to apply for jobs",
                success: false
            });
        }
        if(!jobId){
            return res.status(400).json({
                message: "Invalid job ID",
                success: false
            });
        }

        const existingApplication = await Application.findOne({job:jobId, applicant:userId});
        if(existingApplication){
            return res.status(400).json({
                message: "You have already applied for this job",
                success: false
            });
        }

        const job = await Job.findById(jobId);
        if(!job){
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        };

        const newApplication = await Application.create({
            job:jobId,
            applicant:userId
        });
        job.applications.push(newApplication._id);
        await job.save();
        return res.status(201).json({
            message: "Application submitted successfully!",

            success: true
        });
        } catch (error) {
        console.log(error);
    }
};
export const getAppliedJobs = async (req,res) =>{
    try {
        const userId = req.id;
        const application = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
            path:"job",
            options:{sort:{createdAt:-1}},
            populate:{
                path:"company",
                options:{sort:{createdAt:-1}}
            }
        });
        if(!application){
            return res.status(404).json({
                message: "No Applications found!",
                success:false
            });
        }
        return res.status(200).json({
            application,
            success:true
        });
    } catch (error) {
        console.log(error);
    }
}

export const getApplicants = async (req, res) => {
    try {
      const jobId = req.params.id;
      const job = await Job.findById(jobId).populate({
          path: "applications",
          options: { sort: { createdAt: -1 } },
          populate: {
              path: "applicant"
          }
      });

      console.log("Job retrieved from DB:", job);
      if (!job) {
          return res.status(404).json({
              message: "Applicant not found",
              success: false
          });
      };

      console.log(job);
      return res.status(200).json({
          job,
          success: true
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  }

export const updateStatus = async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ success: false, message: "Status is required" });
      }

      const application = await Application.findById(id);
      if (!application) {
        return res.status(404).json({ success: false, message: "Application not found" });
      }

      application.status = status;
      await application.save();
      return res.status(200).json({ success: true, message: "Application status updated successfully", application });
    } catch (error) {
      console.error("Error updating status:", error);
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };