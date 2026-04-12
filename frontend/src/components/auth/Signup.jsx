import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar.jsx'
import { Label } from '../ui/label.jsx'
import { Input } from '../ui/input.jsx'
import { RadioGroup } from '../ui/radio-group.jsx'
import { Button } from '../ui/button.jsx'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant.js'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice.js'
import { Loader2 } from 'lucide-react'
function signup() {
    const [input, setInput] = useState({ fullname: "", email: "", phoneNumber: "", password: "", role: "", file: "" });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, user } = useSelector(store => store.auth);
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files[0] });
    };
    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('fullname', input.fullname);
        formData.append('email', input.email);
        formData.append('phoneNumber', input.phoneNumber);
        formData.append('password', input.password);
        formData.append('role', input.role);
        if (input.file) {
            formData.append('file', input.file);
        }
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true,
            })
            if (res.data.success) {
                navigate('/login');
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            dispatch(setLoading(false));
        }
    };
    useEffect(() => {
        if (user) {
            navigate('/');
        }
    })
    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center max-w-4xl mx-auto'>
                <form onSubmit={submitHandler} className='w-1/2 border-t-4 border-t-[#7209B7] p-5 rounded-md shadow-xl bg-white border border-gray-100 cursor-pointer hover:shadow-2xl transition-shadow duration-300 my-10'>
                    <h1 className='font-bold text-xl text-center mb-5'>Sign Up</h1>
                    <div className='my-2'>
                        <Label>Full Name</Label>
                        <Input
                            type="text"
                            value={input.fullname}
                            name="fullname"
                            onChange={changeEventHandler}
                            placeholder="Enter your full name"
                        />
                    </div>
                    <div className='my-2'>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="Enter your email address"
                        />
                    </div>
                    <div className='my-2'>
                        <Label>Contact number</Label>
                        <Input
                            type="text"
                            value={input.phoneNumber}
                            name="phoneNumber"
                            onChange={changeEventHandler}
                            placeholder="Enter your contact number"
                        />
                    </div>
                    <div className='my-2'>
                        <Label>Password</Label>
                        <Input
                            type="password"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            placeholder="Enter your password"
                        />
                    </div>
                    <div className='flex items-center justify-between'>
                        <RadioGroup defaultValue="student" className="flex items-center gap-4 my-5">
                            <div className="flex items-center space-x-2">
                                <Input type="radio" name="role" value="student" checked={input.role === 'student'} onChange={changeEventHandler} className="cursor-pointer"></Input>
                                <Label htmlFor="r1">Student</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input type="radio" name="role" value="recruiter" checked={input.role === 'recruiter'} onChange={changeEventHandler} className="cursor-pointer"></Input>
                                <Label htmlFor="r2">Recruiter</Label>
                            </div>
                            {}
                        </RadioGroup>
                        <div className='flex items-center gap-2'>
                            <Label>Profile</Label>
                            <Input accept="image/*" type="file" onChange={changeFileHandler} className="cursor-pointer" />
                        </div>
                    </div>
                    {
                        loading ? <Button className="w-full my-4"><Loader2 className='mr-2 h-4 w-4 animate-spin' />Please wait</Button> : <Button type="submit" className="w-full my-4 bg-[#7209B7]">Sign Up</Button>
                    }
                    <span className='text-sm'>Alerady have an account? <Link to="/login" className="text-blue-600">login</Link></span>
                </form>
            </div>
        </div>
    )
}
export default signup