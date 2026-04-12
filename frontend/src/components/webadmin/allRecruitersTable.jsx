import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useGetAllRecruiters from '@/hooks/useGetAllRecruiters';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal } from 'lucide-react';
import axios from 'axios';
import { WEBADMIN_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
const AllRecruitersTable = ({ filterText }) => {
    useGetAllRecruiters();
    const { allRecruiters = [] } = useSelector(store => store.user);
    const [filteredRecruiters, setFilteredRecruiters] = useState(allRecruiters);
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 10;
    useEffect(() => {
        const filtered = allRecruiters.filter(recruiter =>
            recruiter.fullname.toLowerCase().includes(filterText.toLowerCase())
        );
        setFilteredRecruiters(filtered);
        setCurrentPage(1);
    }, [allRecruiters, filterText]);
    const handleToggleRecruiterStatus = async (recruiterId) => {
        try {
            const response = await axios.put(`${WEBADMIN_API_END_POINT}/toggleRecruiterStatus/${recruiterId}`, {}, { withCredentials: true });
            if (response.data.success) {
                toast.success(`Recruiter has been ${response.data.suspended ? 'suspended' : 'unsuspended'} successfully!`);
                const updatedRecruiters = filteredRecruiters.map(recruiter =>
                    recruiter._id === recruiterId
                        ? { ...recruiter, suspended: response.data.suspended }
                        : recruiter
                );
                setFilteredRecruiters(updatedRecruiters);
            } else {
                toast.error("Failed to update recruiter status.");
            }
        } catch (error) {
            toast.error("Error updating recruiter status.");
        }
    };
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = filteredRecruiters.slice(indexOfFirstEntry, indexOfLastEntry);
    const totalPages = Math.ceil(filteredRecruiters.length / entriesPerPage);
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
                            <TableHead className="w-12 p-4">#</TableHead>
                            <TableHead className="w-45 p-4">Profile</TableHead>
                            <TableHead className="w-60 p-4">Full Name</TableHead>
                            <TableHead className="w-60 p-4">Email</TableHead>
                            <TableHead className="w-60 p-4">Contact No</TableHead>
                            <TableHead className="w-64 p-4">Company</TableHead>
                            <TableHead className="w-40 p-4">Registered Date</TableHead>
                            <TableHead className="w-32 p-4 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                </Table>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
                <Table className="min-w-full">
                    <TableBody>
                        {currentEntries.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan="7" className="text-center text-gray-500">
                                    No registered recruiters found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            currentEntries.map((recruiter, index) => (
                                <TableRow key={recruiter._id} className={recruiter.suspended ? 'bg-red-100' : ''}>
                                    <TableCell className="w-12 p-4">{indexOfFirstEntry + index + 1}</TableCell>
                                    <TableCell className="w-45 p-4">
                                        <Avatar>
                                            <AvatarImage src={recruiter.profile?.profilePhoto || 'https://via.placeholder.com/150'} alt={recruiter.fullname} />
                                        </Avatar>
                                    </TableCell>
                                    <TableCell className="w-60 p-4">{recruiter.fullname}</TableCell>
                                    <TableCell className="w-60 p-4">{recruiter.email}</TableCell>
                                    <TableCell className="w-60 p-4">{recruiter.phoneNumber}</TableCell>
                                    <TableCell className="w-64 p-4">
                                        {recruiter.companies.length > 0
                                            ? recruiter.companies.map(company => company.name).join(', ')
                                            : 'N/A'}
                                    </TableCell>
                                    <TableCell className="w-40 p-4">{new Date(recruiter.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="w-32 p-4 text-right cursor-pointer">
                                        <Popover>
                                            <PopoverTrigger>
                                                <MoreHorizontal />
                                            </PopoverTrigger>
                                            <PopoverContent className="w-32">
                                                <div
                                                    className={`flex items-center gap-2 cursor-pointer ${recruiter.suspended ? 'text-green-600' : 'text-red-600'}`}
                                                    onClick={() => handleToggleRecruiterStatus(recruiter._id)}
                                                >
                                                    <span>{recruiter.suspended ? 'Unsuspend' : 'Suspend'}</span>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            {}
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
export default AllRecruitersTable;
