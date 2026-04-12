
import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAllJobs } from "@/redux/jobSlice";
import { JOB_API_END_POINT } from '@/utils/constant';
const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const { searchedQuery } = useSelector((state) => state.job);
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const url = searchedQuery
                    ? `${JOB_API_END_POINT}/get?keyword=${encodeURIComponent(searchedQuery)}`
                    : `${JOB_API_END_POINT}/get`;
                const res = await axios.get(url);
                if (res.data.success) {
                    dispatch(setAllJobs(res.data.jobs));
                }
            } catch (error) {
                console.error("Error fetching jobs:", error);
            }
        };
        fetchJobs();
    }, [dispatch, searchedQuery]);
};
export default useGetAllJobs;
