import { setAllRecruiters } from "@/redux/userSlice";
import { WEBADMIN_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
const useGetAllUsers = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(`${WEBADMIN_API_END_POINT}/allRecruiters`, {
                    withCredentials: true
                });
                if (res.data.allRecruiters) {
                    dispatch(setAllRecruiters(res.data.allRecruiters));
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);
};
export default useGetAllUsers;
