import { setAllUsers } from "@/redux/userSlice";
import { WEBADMIN_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
const useGetAllUsers = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get(`${WEBADMIN_API_END_POINT}/allUsers`, {
                    withCredentials: true
                });
                if (res.data.allUsers) {
                    dispatch(setAllUsers(res.data.allUsers));
                }
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);
};
export default useGetAllUsers;
