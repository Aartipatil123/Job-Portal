import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar.jsx';
import { Label } from '../ui/label.jsx';
import { Input } from '../ui/input.jsx';
import { RadioGroup } from '../ui/radio-group.jsx';
import { Button } from '../ui/button.jsx';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant.js';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/redux/authSlice.js';

function Signup() {

    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "student",
        file: null
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector(store => store.auth);

    const changeEventHandler = (e) => {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        });
    };

    const changeFileHandler = (e) => {
        setInput({
            ...input,
            file: e.target.files[0]
        });
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (
            !input.fullname ||
            !input.email ||
            !input.phoneNumber ||
            !input.password ||
            !input.role
        ) {
            toast.error("Please fill all fields");
            return;
        }

        try {

            dispatch(setLoading(true));

            const formData = new FormData();

            formData.append("fullname", input.fullname);
            formData.append("email", input.email);
            formData.append("phoneNumber", input.phoneNumber);
            formData.append("password", input.password);
            formData.append("role", input.role);

            if (input.file) {
                formData.append("file", input.file);
            }

            const res = await axios.post(
                `${USER_API_END_POINT}/register`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    },
                    withCredentials: true
                }
            );

            console.log(res.data);

            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/login");
            }

        } catch (error) {

            console.log(error);

            toast.error(
                error?.response?.data?.message || "Signup failed"
            );

        } finally {

            dispatch(setLoading(false));

        }
    };

    useEffect(() => {

        dispatch(setLoading(false));

        if (user) {
            navigate('/');
        }

    }, [user, navigate, dispatch]);

    return (
        <div>

            <Navbar />

            <div className='flex items-center justify-center max-w-4xl mx-auto'>

                <form
                    onSubmit={submitHandler}
                    className='w-full md:w-1/2 border-t-4 border-t-[#7209B7] p-5 rounded-md shadow-xl bg-white border border-gray-100 my-10'
                >

                    <h1 className='font-bold text-2xl text-center mb-5'>
                        Sign Up
                    </h1>

                    <div className='my-3'>
                        <Label>Full Name</Label>

                        <Input
                            type="text"
                            name="fullname"
                            value={input.fullname}
                            onChange={changeEventHandler}
                            placeholder="Enter your full name"
                        />
                    </div>

                    <div className='my-3'>
                        <Label>Email</Label>

                        <Input
                            type="email"
                            name="email"
                            value={input.email}
                            onChange={changeEventHandler}
                            placeholder="Enter your email address"
                        />
                    </div>

                    <div className='my-3'>
                        <Label>Contact Number</Label>

                        <Input
                            type="text"
                            name="phoneNumber"
                            value={input.phoneNumber}
                            onChange={changeEventHandler}
                            placeholder="Enter your contact number"
                        />
                    </div>

                    <div className='my-3'>
                        <Label>Password</Label>

                        <Input
                            type="password"
                            name="password"
                            value={input.password}
                            onChange={changeEventHandler}
                            placeholder="Enter your password"
                        />
                    </div>

                    <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>

                        <RadioGroup
                            defaultValue="student"
                            className="flex items-center gap-4 my-3"
                        >

                            <div className="flex items-center space-x-2">

                                <input
                                    type="radio"
                                    id="student"
                                    name="role"
                                    value="student"
                                    checked={input.role === 'student'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer"
                                />

                                <Label htmlFor="student">
                                    Student
                                </Label>

                            </div>

                            <div className="flex items-center space-x-2">

                                <input
                                    type="radio"
                                    id="recruiter"
                                    name="role"
                                    value="recruiter"
                                    checked={input.role === 'recruiter'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer"
                                />

                                <Label htmlFor="recruiter">
                                    Recruiter
                                </Label>

                            </div>

                        </RadioGroup>

                        <div className='flex items-center gap-2'>

                            <Label>Profile</Label>

                            <Input
                                type="file"
                                accept="image/*"
                                onChange={changeFileHandler}
                                className="cursor-pointer"
                            />

                        </div>

                    </div>

                    <Button
                        type="submit"
                        className="w-full my-4 bg-[#7209B7] hover:bg-[#5e0a95]"
                    >
                        Sign Up
                    </Button>

                    <span className='text-sm'>
                        Already have an account?{" "}

                        <Link
                            to="/login"
                            className="text-blue-600"
                        >
                            Login
                        </Link>

                    </span>

                </form>

            </div>

        </div>
    );
}

export default Signup;