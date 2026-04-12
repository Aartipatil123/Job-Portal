import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Menu, User2, LogOut, Building2 } from 'lucide-react';
import { setUser } from '@/redux/authSlice';
import { USER_API_END_POINT } from '@/utils/constant';
function Navbar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user } = useSelector((store) => store.auth);
    const { companies } = useSelector((store) => store.company);
    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`);
            if (res.data.success) {
                dispatch(setUser(null));
                navigate('/');
                toast.success('Logged Out Successfully');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Logout failed');
        }
    };
    const getNavLinks = () => {
        if (user?.role === 'recruiter') {
            return [
                { name: 'Companies', path: '/admin/companies' },
                { name: 'Jobs', path: '/admin/jobs' },
            ];
        } else if (user?.role === 'admin') {
            return [
                { name: 'All Users', path: '/allUsers' },
                { name: 'All Recruiters', path: '/allRecruiters' },
            ];
        } else {
            return [
                { name: 'Home', path: '/' },
                { name: 'Jobs', path: '/jobs' },
                { name: 'Browse', path: '/browse' },
            ];
        }
    };
    const recruiterCompany =
        user?.role === 'recruiter'
            ? companies?.find((company) => company.userId === user?._id)
            : null;
    return (
        <div className="bg-white shadow-sm w-full">
            <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4 md:px-8">
                {}
                <h1 className="text-2xl font-bold">
                    Job<span className="text-[#f83002]">Portal</span>
                </h1>
                {}
                <div className="hidden md:flex items-center gap-10">
                    <ul className="flex font-medium items-center gap-6">
                        {getNavLinks().map((link, i) => (
                            <li key={i}>
                                <Link className="hover:text-[#7209B7]" to={link.path}>
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    {}
                    {!user ? (
                        <div className="flex items-center gap-2">
                            <Link to="/login">
                                <Button variant="outline" className="border-[#6A38C2] text-[#6A38C2]">
                                    Login
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <Popover>
                            <PopoverTrigger asChild>
                                <Avatar className="cursor-pointer w-12 h-12 border-2 border-[#7209B7]">
                                    <AvatarImage
                                        src={user?.profile?.profilePhoto || '/default-avatar.png'}
                                        alt="Profile"
                                    />
                                </Avatar>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                                {}
                                <div className="flex gap-4 items-start">
                                    <Avatar>
                                        <AvatarImage
                                            src={user?.profile?.profilePhoto || '/default-avatar.png'}
                                            alt="Profile"
                                        />
                                    </Avatar>
                                    <div>
                                        <h4 className="font-semibold">{user?.fullname}</h4>
                                        <p className="text-sm text-gray-500">
                                            {user?.role === 'recruiter'
                                                ? recruiterCompany?.name || 'No company found'
                                                : user?.profile?.bio || 'No bio available'}
                                        </p>
                                    </div>
                                </div>
                                {}
                                <div className="flex flex-col mt-3 text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <User2 size={18} />
                                        <Link to="/profile">
                                            <Button variant="link" className="p-0">
                                                View Profile
                                            </Button>
                                        </Link>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <LogOut size={18} />
                                        <Button
                                            onClick={logoutHandler}
                                            variant="link"
                                            className="p-0 text-red-500"
                                        >
                                            Logout
                                        </Button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}
                </div>
                {}
                <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <Menu size={28} />
                </button>
            </div>
            {}
            {isMenuOpen && (
                <div className="md:hidden flex flex-col gap-4 p-4 bg-white shadow-lg">
                    <ul className="flex flex-col font-medium gap-4">
                        {getNavLinks().map((link, i) => (
                            <li key={i}>
                                <Link className="hover:text-[#7209B7]" to={link.path}>
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    {}
                    <div className="flex flex-col gap-2 mt-2">
                        {!user ? (
                            <>
                                <Link to="/login">
                                    <Button className="w-full">Login</Button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/profile">
                                    <Button className="w-full bg-[#7209B7] text-white">
                                        View Profile
                                    </Button>
                                </Link>
                                <Button
                                    onClick={logoutHandler}
                                    className="w-full bg-red-500 text-white"
                                >
                                    Logout
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
export default Navbar;
