import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useGetAllUsers from '@/hooks/useGetAllUsers';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { MoreHorizontal } from 'lucide-react';
import axios from 'axios';
import { WEBADMIN_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
const AllUsersTable = ({ filterText }) => {
    useGetAllUsers();
    const { allUsers = [] } = useSelector(store => store.user);
    const [filteredUsers, setFilteredUsers] = useState(allUsers);
    const [currentPage, setCurrentPage] = useState(1);
    const entriesPerPage = 10;
    useEffect(() => {
        const filtered = allUsers.filter(user =>
            user.fullname.toLowerCase().includes(filterText.toLowerCase())
        );
        setFilteredUsers(filtered);
        setCurrentPage(1);
    }, [allUsers, filterText]);
    const handleToggleUserStatus = async (userId) => {
        try {
            const response = await axios.put(`${WEBADMIN_API_END_POINT}/toggleUserStatus/${userId}`, {}, { withCredentials: true });
            if (response.data.success) {
                toast.success(`User has been ${response.data.suspended ? 'suspended' : 'unsuspended'} successfully!`);
                const updatedUsers = filteredUsers.map(user =>
                    user._id === userId ? { ...user, suspended: response.data.suspended } : user
                );
                setFilteredUsers(updatedUsers);
            } else {
                toast.error("Failed to update user status.");
            }
        } catch (error) {
            toast.error("Error updating user status.");
        }
    };
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = filteredUsers.slice(indexOfFirstEntry, indexOfLastEntry);
    const totalPages = Math.ceil(filteredUsers.length / entriesPerPage);
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
            {}
            <div className="bg-gray-100">
                <Table className="min-w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12 p-4">#</TableHead>
                            <TableHead className="w-24 p-4">Profile</TableHead>
                            <TableHead className="w-64 p-4">Full Name</TableHead>
                            <TableHead className="w-64 p-4">Email</TableHead>
                            <TableHead className="w-68 p-4">Contact No</TableHead>
                            <TableHead className="w-40 p-4">Registered Date</TableHead>
                            <TableHead className="w-32 p-4 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                </Table>
            </div>
            {}
            <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
                <Table className="min-w-full">
                    <TableBody>
                        {currentEntries.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan="6" className="text-center text-gray-500">
                                    No registered candidates found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            currentEntries.map((user, index) => (
                                <TableRow key={user._id} className={user.suspended ? 'bg-red-100' : ''}>
                                    <TableCell className="w-12 p-4">{index + 1 + (currentPage - 1) * entriesPerPage}</TableCell>
                                    <TableCell className="w-24 p-4">
                                        <Avatar>
                                            <AvatarImage src={user.profile?.profilePhoto || 'https://via.placeholder.com/150'} alt={user.fullname} />
                                        </Avatar>
                                    </TableCell>
                                    <TableCell className="w-64 p-4">{user.fullname}</TableCell>
                                    <TableCell className="w-64 p-4">{user.email}</TableCell>
                                    <TableCell className="w-64 p-4">{user.phoneNumber}</TableCell>
                                    <TableCell className="w-40 p-4">{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="w-32 p-4 text-right cursor-pointer">
                                        <Popover>
                                            <PopoverTrigger>
                                                <MoreHorizontal />
                                            </PopoverTrigger>
                                            <PopoverContent className="w-32">
                                                <div
                                                    className={`flex items-center gap-2 cursor-pointer ${user.suspended ? 'text-green-600' : 'text-red-600'}`}
                                                    onClick={() => handleToggleUserStatus(user._id)}
                                                >
                                                    <span>{user.suspended ? 'Unsuspend' : 'Suspend'}</span>
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
export default AllUsersTable;
