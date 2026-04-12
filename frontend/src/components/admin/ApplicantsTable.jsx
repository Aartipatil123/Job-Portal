import React, { useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { Input } from '../ui/input';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { updateApplicantStatus } from '@/redux/applicantSlice';
import { useNavigate } from 'react-router-dom';
const ApplicantsTable = () => {
    const dispatch = useDispatch();
    const { applicants } = useSelector(store => store.application);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 10;
    const [showModal, setShowModal] = useState(false);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [statusText, setStatusText] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const openModal = (applicant) => {
        setSelectedApplicant(applicant);
        setStatusText(applicant?.status || '');
        setShowModal(true);
    };
    const closeModal = () => {
        setShowModal(false);
        setSelectedApplicant(null);
        setStatusText('');
    };
    const statusHandler = async () => {
        if (!selectedApplicant) return;
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${selectedApplicant._id}/update`, { status: statusText });
            if (res.data.success) {
                dispatch(updateApplicantStatus({ id: selectedApplicant._id, status: statusText }));
                toast.success('Status updated successfully!');
                closeModal();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred');
        }
    };
    const filteredApplicants = applicants.applications.filter(item =>
        item?.applicant?.fullname.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = filteredApplicants.slice(indexOfFirstEntry, indexOfLastEntry);
    const totalPages = Math.ceil(filteredApplicants.length / entriesPerPage);
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
        <div>
            <div className="flex items-center mt-6 mb-6 gap-4">
                <h2 className="text-lg font-semibold">Search:</h2>
                <Input className='w-fit' value={searchQuery} placeholder='Filter By Name or Role' onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            {currentEntries.length <= 0 ? (
                <div className="text-center text-red-500">No applicants found!</div>
            ) : (
                <div className="border rounded-lg shadow-lg max-w-6xl mx-auto">
                    <div className="bg-gray-100">
                        <Table className="min-w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className='w-16'>#</TableHead>
                                    <TableHead className='w-60'>Name</TableHead>
                                    <TableHead className='w-60'>Email</TableHead>
                                    <TableHead className='w-18'>Contact</TableHead>
                                    <TableHead className='w-34'>Resume</TableHead>
                                    <TableHead className='w-26'>Date</TableHead>
                                    <TableHead className='w-30'>Application Status</TableHead>
                                    <TableHead className='text-right'>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                        </Table>
                    </div>
                    <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
                        <Table className="min-w-full">
                            <TableBody>
                                {currentEntries.map((item, index) => (
                                    <TableRow key={item._id}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{item?.applicant?.fullname}</TableCell>
                                        <TableCell>{item?.applicant?.email}</TableCell>
                                        <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                                        <TableCell className='text-blue-600'>
                                            {item?.applicant?.profile?.resume ? (
                                                <a href={item?.applicant?.profile?.resume} target='_blank' rel='noopener noreferrer'>
                                                    {item?.applicant?.profile?.resumeOriginalName}
                                                </a>
                                            ) : (
                                                <span className='text-xs text-red-500'>N.A</span>
                                            )}
                                        </TableCell>
                                        <TableCell>{item?.createdAt.split('T')[0]}</TableCell>
                                        <TableCell>{item?.status}</TableCell>
                                        <TableCell className='text-right'>
                                            <button
                                                onClick={() => openModal(item)}
                                                className="px-3 py-1 bg-[#7209B7] text-white rounded hover:bg-[#2f1143]"
                                            >
                                                Update Status
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    {showModal && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
                                <h2 className="text-xl font-bold mb-4">Update Applicant Status</h2>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded mb-4"
                                    placeholder="Enter new status"
                                    value={statusText}
                                    onChange={(e) => setStatusText(e.target.value)}
                                />
                                <div className="flex justify-end gap-2">
                                    <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-[#2f1143]" onClick={closeModal}>
                                        Cancel
                                    </button>
                                    <button className="px-4 py-2 bg-[#7209B7] text-white rounded hover:bg-[#2f1143]" onClick={statusHandler}>
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
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
            )}
        </div>
    );
};
export default ApplicantsTable;
