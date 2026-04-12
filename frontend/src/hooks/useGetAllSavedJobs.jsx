import { setSavedJobs } from "@/redux/jobSlice";
import { JOB_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
const useGetAllSavedJobs = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchSavedJobs = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/saved-jobs`, { withCredentials: true });
        if (res.data.success) {
          dispatch(setSavedJobs(res.data.savedJobs));
        }
      } catch (error) {
        console.error("Error fetching saved jobs:", error);
      }
    };
    fetchSavedJobs();
  }, [dispatch]);
};
export default useGetAllSavedJobs;
