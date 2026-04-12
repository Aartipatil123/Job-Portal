import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Edit2, Eye, MoreHorizontal, Trash } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { setAllAdminJobs } from '@/redux/jobSlice';
import { toast } from 'sonner';
const AdminJobsTable = () => {
    const { allAdminJobs, searchJobByText } = useSelector(store => store.job);
    const [filterJobs, setFilterJobs] = useState(allAdminJobs);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 10;
    useEffect(() => {
        const filteredJob = allAdminJobs.length >= 0 && allAdminJobs.filter((job) => {
            if (!searchJobByText) {
                return true;
            }
            return job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) || job?.company?.name.toLowerCase().includes(searchJobByText.toLowerCase());
        });
        setFilterJobs(filteredJob);
    }, [allAdminJobs, searchJobByText]);
    const handleDeleteJob = async (jobId) => {
        try {
            const response = await axios.delete(`${JOB_API_END_POINT}/deletejob/${jobId}`, { withCredentials: true });
            if (response.data.success) {
                const updatedJobs = filterJobs.filter(job => job._id !== jobId);
                setFilterJobs(updatedJobs);
                dispatch(setAllAdminJobs(updatedJobs));
                toast.success("Job deleted successfully!");
            } else {
                toast.error("Server problem");
            }
        } catch (error) {
            console.error('Error deleting job:', error);
            toast.error("Error deleting job:");
        }
    };
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = filterJobs.slice(indexOfFirstEntry, indexOfLastEntry);
    const totalPages = Math.ceil(filterJobs.length / entriesPerPage);
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };
    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };
    return (
        <div className="border rounded-lg shadow-lg max-w-6xl mx-auto">
            <div className="bg-gray-100">
                <Table className="min-w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12 p-2.5 text-center whitespace-nowrap">#</TableHead>
                            <TableHead className="w-28 p-2.5 text-center whitespace-nowrap">Date</TableHead>
                            <TableHead className="w-32 p-2.5 text-center whitespace-nowrap">End date</TableHead>
                            <TableHead className="w-48 p-2.5 text-center whitespace-nowrap">Company Name</TableHead>
                            <TableHead className="w-40 p-2.5 text-center whitespace-nowrap">Role</TableHead>
                            <TableHead className="w-40 p-2.5 text-center whitespace-nowrap">Experience</TableHead>
                            <TableHead className="w-28 p-2.5 text-center whitespace-nowrap">Vacancies</TableHead>
                            <TableHead className="w-40 p-2.5 text-center whitespace-nowrap">Location</TableHead>
                            <TableHead className="w-40 p-2.5 text-center whitespace-nowrap">Job Type</TableHead>
                            <TableHead className="w-35 p-2.5 text-center whitespace-nowrap">Applications</TableHead>
                            <TableHead className="w-12 p-2.5 text-center whitespace-nowrap">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                </Table>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
                <Table className="min-w-full">
                    <TableBody>
                        {
                            currentEntries.length <= 0 ? (
                                <TableRow >
                                    <TableCell colSpan="8" className="text-center text-gray-500">
                                        You haven't created any job posts.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                currentEntries?.map((job, index) => {
                                    const isExpired = new Date(job?.endDate) < new Date();
                                    return (
                                        <TableRow key={job._id} className={isExpired ? "bg-red-200 hover:bg-red-300" : ""}>
                                            <TableCell className="w-12 p-2.5 text-cente whitespace-nowrapr">{index + 1}</TableCell>
                                            <TableCell className="w-28 p-2.5 text-center whitespace-nowrap">{job?.createdAt.split("T")[0]}</TableCell>
                                            <TableCell className={isExpired ? "w-32 p-2.5 text-center font-bold whitespace-nowrap text-[#F83002]" : "w-28 p-2.5 text-center font-bold whitespace-nowrap text-green-500"}>{job?.endDate.split("T")[0]}</TableCell>
                                            <TableCell className="w-48 p-2.5 whitespace-nowrap">{job?.company?.name}</TableCell>
                                            <TableCell className="w-40 p-2.5 whitespace-nowrap">{job?.title}</TableCell>
                                            <TableCell className="w-40 p-2.5 whitespace-nowrap">{job?.experienceLevel}</TableCell>
                                            <TableCell className="w-28 p-2.5 whitespace-nowrap">{job?.position}</TableCell>
                                            <TableCell className="w-40 p-2.5 text-center whitespace-nowrap">{job?.location}</TableCell>
                                            <TableCell className="w-40 p-2.5 whitespace-nowrap">{job?.jobType}</TableCell>
                                            <TableCell className="w-40 p-2.5 whitespace-nowrap">{job?.applications?.length || 0}</TableCell>
                                            <TableCell className="w-12 p-2.5 text-center cursor-pointer whitespace-nowrap">
                                                <Popover>
                                                    <PopoverTrigger><MoreHorizontal /></PopoverTrigger>
                                                    <PopoverContent className='w-32'>
                                                        <div onClick={() => navigate(`/admin/companies/${job._id}`)} className='flex items-center gap-2 w-fit cursor-pointer'>
                                                            <Edit2 className='w-4' />
                                                            <span>Edit</span>
                                                        </div>
                                                        <div onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)} className='flex items-center w-fit gap-2 cursor-pointer'>
                                                            <Eye className='w-4' />
                                                            <span>Applicants</span>
                                                        </div>
                                                        <div onClick={() => handleDeleteJob(job._id)} className='flex items-center gap-2 w-fit cursor-pointer'>
                                                            <Trash className='w-4' />
                                                            <span>Delete</span>
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )
                        }
                    </TableBody>
                </Table>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-100">
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                >
                    Previous
                </button>
                <span className="text-gray-700">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                >
                    Next
                </button>
            </div>
        </div>
    );
};
export default AdminJobsTable;
