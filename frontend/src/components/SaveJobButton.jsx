import React from "react";
import { Button } from "./ui/button";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
export const SaveJobButton = ({ jobId, isSaved, setIsSaved }) => {
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const handleClick = async () => {
        if (!user) {
            toast.error("Please login to save jobs");
            navigate('/login');
            return;
        }
        if (!jobId) {
            toast.error("Invalid Job ID!");
            return;
        }
        setIsSaved((prev) => !prev);
        try {
            if (!isSaved) {
                const res = await axios.post(
                    `${JOB_API_END_POINT}/save-job/${jobId}`,
                    {},
                    { withCredentials: true }
                );
                if (!res.data.success) throw new Error(res.data.message);
                toast.success(res.data.message);
            } else {
                const res = await axios.delete(
                    `${JOB_API_END_POINT}/saved-job/${jobId}`,
                    { withCredentials: true }
                );
                if (!res.data.success) throw new Error(res.data.message);
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error("Error toggling save job:", error);
            toast.error(error.response?.data?.message || "Something went wrong");
            setIsSaved((prev) => !prev);
        }
    };
    return (
        <Button
            className={`w-32 border transition-all duration-200 
                ${isSaved ? "border-green-500 text-green-500" : "border-gray-300 text-black"} 
                hover:bg-gray-100`}
            onClick={handleClick}
            variant="outline"
        >
            {isSaved ? <BookmarkCheck className="text-green-500" /> : <Bookmark />} {isSaved ? "Saved" : "Save Job"}
        </Button>
    );
};
