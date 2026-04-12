
import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '@radix-ui/react-label'
import { Input } from '../ui/input'
import { Button } from '../ui/button';
import { useSelector } from 'react-redux';
import { Select, SelectContent, SelectGroup, SelectValue, SelectItem, SelectTrigger } from '../ui/select';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
function PostJob() {
    const navigate = useNavigate();
    const [input, setInput] = useState({
        title: '',
        description: '',
        requirements: '',
        salaryMin: '',
        salaryMax: '',
        location: '',
        jobType: '',
        experienceMin: '',
        experienceMax: '',
        position: 0,
        companyId: '',
        endDate: ''
    });
    const [loading, setLoading] = useState(false);
    const { companies } = useSelector(store => store.company);
    const changeEventHandler = (e) => {
        const value = e.target.name === 'position' ? parseInt(e.target.value) || 0 : e.target.value;
        setInput({ ...input, [e.target.name]: value });
    }
    const selectChangeHandler = (value) => {
        const selectedCompany = companies.find((company) => company.name.toLowerCase() === value);
        setInput({ ...input, companyId: selectedCompany ? selectedCompany._id : '' });
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (!input.salaryMin || !input.salaryMax) {
                 toast.error("Please enter both minimum and maximum salary.");
                 setLoading(false);
                 return;
            }
            if (!input.experienceMin || !input.experienceMax) {
                 toast.error("Please enter both minimum and maximum experience.");
                 setLoading(false);
                 return;
            }
            const postData = {
                ...input,
                salary: `${input.salaryMin}-${input.salaryMax}`,
                experience: `${input.experienceMin}-${input.experienceMax}`,
            };
            const res = await axios.post(`${JOB_API_END_POINT}/post`, postData, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                toast(res.data.message);
                navigate('/admin/jobs');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    }
    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center w-screen my-5'>
                <form onSubmit={submitHandler} className='p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md'>
                    <div className='grid grid-cols-2 gap-2'>
                        <div>
                            <Label>Title</Label>
                            <Input
                                type="text" name="title" value={input.title} onChange={changeEventHandler} className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1" />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Input
                                type="text" name="description" value={input.description} onChange={changeEventHandler} className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1" />
                        </div>
                        <div>
                            <Label>Requirements</Label>
                            <Input
                                type="text" name="requirements" value={input.requirements} onChange={changeEventHandler} className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                             <div>
                                <Label>Min. Salary (e.g., in LPA)</Label>
                                <Input
                                    type="text" name="salaryMin" value={input.salaryMin} onChange={changeEventHandler} className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1" />
                            </div>
                             <div>
                                <Label>Max. Salary (e.g., in LPA)</Label>
                                <Input
                                    type="text" name="salaryMax" value={input.salaryMax} onChange={changeEventHandler} className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1" />
                            </div>
                        </div>
                        <div>
                            <Label>Location</Label>
                            <Input
                                type="text" name="location" value={input.location} onChange={changeEventHandler} className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1" />
                        </div>
                        <div>
                            <Label>Job Type</Label>
                            <select
                                name="jobType"
                                value={input.jobType}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1 border rounded-md p-2 w-full"
                            >
                                <option value="">Select Job Type</option>
                                <option value="Part Time">Part Time</option>
                                <option value="Full Time">Full Time</option>
                                <option value="Contract">Contract</option>
                                <option value="Internship">Internship</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label>Min. Experience (in years)</Label>
                                <Input
                                    type="text" name="experienceMin" value={input.experienceMin} onChange={changeEventHandler} className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1" />
                            </div>
                            <div>
                                <Label>Max. Experience (in years)</Label>
                                <Input
                                    type="text" name="experienceMax" value={input.experienceMax} onChange={changeEventHandler} className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1" />
                            </div>
                        </div>
                        <div>
                            <Label>Position</Label>
                            <Input
                                type="number" name="position" value={input.position} onChange={changeEventHandler} className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1" />
                        </div>
                        <div>
                            <Label>Select Company</Label>
                            {
                                companies.length > 0 && (
                                    <Select onValueChange={selectChangeHandler}>
                                        <SelectTrigger className="w-full my-1">
                                            <SelectValue placeholder="Select Company" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                {
                                                    companies.map((company) => (
                                                        <SelectItem key={company._id} value={company?.name?.toLowerCase()}>
                                                            {company.name}
                                                        </SelectItem>
                                                    ))
                                                }
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                )
                            }
                        </div>
                        <div className="col-span-1">
                            <Label>End Date</Label>
                            <Input
                                type="date"
                                name="endDate"
                                value={input.endDate}
                                onChange={changeEventHandler}
                                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                            />
                        </div>
                    </div>
                    {
                        loading ? <Button type='submit' className="w-full my-4"><Loader2 className='mr-2 h-4 w-4 animate-spin' />Please wait</Button> : <Button type="submit" className="w-full my-4">Post New Job</Button>
                    } 
                    {
                        companies.length === 0 && <p className='text-xs text-red-600 font-bold text-center my-3'>* Please Register a company first before posting a job </p>
                    }
                </form>
            </div>
        </div>
    )
}
export default PostJob