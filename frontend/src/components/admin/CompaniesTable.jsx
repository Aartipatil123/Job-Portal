import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, MoreHorizontal } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { COMPANY_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { setCompanies } from '@/redux/companySlice';
const CompaniesTable = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { companies = [], searchCompanyByText = '' } = useSelector(store => store.company || {});
    const [filterCompany, setFilterCompany] = useState(Array.isArray(companies) ? companies : []);
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 10;
    useEffect(() => {
        const filtered = (Array.isArray(companies) ? companies : []).filter((company) => {
            if (!searchCompanyByText) return true;
            return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());
        });
        setFilterCompany(filtered);
        const newTotalPages = Math.max(1, Math.ceil(filtered.length / entriesPerPage));
        setCurrentPage(prev => Math.min(prev, newTotalPages));
    }, [companies, searchCompanyByText]);
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = (filterCompany || []).slice(indexOfFirstEntry, indexOfLastEntry);
    const totalPages = Math.max(1, Math.ceil((filterCompany || []).length / entriesPerPage));
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
    const handleDeleteCompany = async (companyId) => {
        try {
            const confirmed = window.confirm('Are you sure you want to delete this company? This action cannot be undone.');
            if (!confirmed) return;
            const response = await axios.delete(`${COMPANY_API_END_POINT}/deletecompany/${companyId}`, {
                withCredentials: true
            });
            if (response?.data?.success) {
                const updatedCompanies = filterCompany.filter(company => company._id !== companyId);
                setFilterCompany(updatedCompanies);
                dispatch(setCompanies(updatedCompanies));
                const newTotalPages = Math.max(1, Math.ceil(updatedCompanies.length / entriesPerPage));
                if (currentPage > newTotalPages) {
                    setCurrentPage(newTotalPages);
                }
                toast.success(response.data.message || "Company deleted successfully!");
            } else {
                toast.error(response?.data?.message || "Server problem while deleting company");
            }
        } catch (error) {
            console.error("Error deleting company:", error);
            const serverMsg = error?.response?.data?.message || error?.message;
            toast.error(serverMsg || "Error deleting company");
        }
    };
    const formatDate = (isoStr) => {
        if (!isoStr) return '-';
        try {
            const d = new Date(isoStr);
            if (isNaN(d)) return isoStr.split?.('T')?.[0] ?? isoStr;
            return d.toISOString().split('T')[0];
        } catch (e) {
            return isoStr.split?.('T')?.[0] ?? isoStr;
        }
    };
    return (
        <div className="border rounded-lg shadow-lg max-w-6xl mx-auto">
            <div className="bg-gray-100">
                <Table className="min-w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12 p-2">#</TableHead>
                            <TableHead className="w-24 p-2">Logo</TableHead>
                            <TableHead className="w-48 p-2">Name</TableHead>
                            <TableHead className="w-48 p-2">Date</TableHead>
                            <TableHead className="w-48 p-2">Website</TableHead>
                            <TableHead className="w-40 p-2">Offices</TableHead>
                            <TableHead className='w-32 p-2 text-right'>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                </Table>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
                <Table className="min-w-full">
                    <TableBody>
                        {
                            currentEntries.length <= 0 ? (
                                <TableRow>
                                    <TableCell colSpan="7" className="text-center text-gray-500">
                                        You haven't created any company.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                currentEntries.map((company, index) => (
                                    <TableRow key={company._id}>
                                        {}
                                        <TableCell className="w-12 p-2">{indexOfFirstEntry + index + 1}</TableCell>
                                        <TableCell className="w-24 p-2">
                                            <Avatar>
                                                <AvatarImage src={company.logo || 'https://via.placeholder.com/150'} />
                                            </Avatar>
                                        </TableCell>
                                        <TableCell className="w-48 p-2">{company.name || '-'}</TableCell>
                                        <TableCell className="w-48 p-2">{formatDate(company?.createdAt)}</TableCell>
                                        <TableCell className="w-48 p-2">{company.website || '-'}</TableCell>
                                        <TableCell className="w-40 p-2">{Array.isArray(company.location) ? company.location.join(', ') : (company.location || '-')}</TableCell>
                                        <TableCell className='w-32 p-2 text-right cursor-pointer'>
                                            <Popover>
                                                <PopoverTrigger><MoreHorizontal /></PopoverTrigger>
                                                <PopoverContent className='w-32'>
                                                    <div onClick={() => navigate(`/admin/companies/${company._id}`)} className='flex items-center gap-2 w-fit cursor-pointer'>
                                                        <Edit2 className='w-4' />
                                                        <span>Edit</span>
                                                    </div>
                                                    <div
                                                        onClick={() => handleDeleteCompany(company._id)}
                                                        className='flex items-center gap-2 w-fit cursor-pointer mt-2 text-red-600'
                                                    >
                                                        {}
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 6h18" /><path d="M8 6v-2a2 2 0 012-2h4a2 2 0 012 2v2" /><path d="M10 11v6" /><path d="M14 11v6" /></svg>
                                                        <span>Delete</span>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )
                        }
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
export default CompaniesTable;
