import axios from "axios";
import { setSavedJobs } from "./jobSlice";
import { toast } from "sonner";
import { JOB_API_END_POINT } from "@/utils/constant";
export const saveJob = (jobId) => async (dispatch) => {
    try {
        const res = await axios.post(`${JOB_API_END_POINT}/save-job/${jobId}`, {}, { withCredentials: true });
        if (res.data.success) {
            dispatch(getSavedJobs());
            toast.success(res.data.message);
        }
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to save job");
    }
};
export const getSavedJobs = () => async (dispatch, getState) => {
    try {
        const { user } = getState().auth;
        const res = await axios.get(`${JOB_API_END_POINT}/saved-jobs`, { withCredentials: true });
        if (res.data.success) {
            let savedJobs = res.data.savedJobs;
            if (user) {
                savedJobs = savedJobs.filter(job => job.userId === user._id);
            }
            dispatch(setSavedJobs(savedJobs));
        }
    } catch (error) {
        console.error(error);
    }
};
export const removeSavedJob = (jobId) => async (dispatch) => {
    try {
        const res = await axios.delete(`${JOB_API_END_POINT}/saved-job/${jobId}`, { withCredentials: true });
        if (res.data.success) {
            dispatch(getSavedJobs());
            toast.success(res.data.message);
        }
    } catch (error) {
        toast.error(error.response?.data?.message || "Failed to remove saved job");
    }
};
