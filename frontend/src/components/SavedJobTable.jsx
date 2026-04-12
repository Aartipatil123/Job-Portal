import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table.jsx';
import { Button } from './ui/button.jsx';
import { useNavigate } from 'react-router-dom';
const SavedJobTable = () => {
  const { savedJobs = [] } = useSelector(store => store.job);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = savedJobs.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(savedJobs.length / entriesPerPage);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  return (
    <div className="border border-green-600 rounded-lg shadow-lg max-w-6xl mx-auto">
      <div className="bg-gray-100">
        <Table>
          <TableHeader>
            <TableRow className="border-b">
              <TableHead className="w-12 text-center font-semibold">#</TableHead>
              <TableHead className="w-28 font-semibold">Saved On</TableHead>
              <TableHead className="w-28 font-semibold whitespace-nowrap">End Date</TableHead>
              <TableHead className="w-44 font-semibold">Job Role</TableHead>
              <TableHead className="w-36 font-semibold">Company</TableHead>
              <TableHead className="w-36 font-semibold">Location</TableHead>
              <TableHead className="w-24 font-semibold">Salary</TableHead>
              <TableHead className="w-24 text-center font-semibold">Action</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      </div>
      <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
        <Table>
          <TableBody>
            {currentEntries.length === 0 ? (
              <TableRow>
                <TableCell colSpan="8" className="text-center text-red-600">
                  **You haven't saved any jobs yet**
                </TableCell>
              </TableRow>
            ) : (
              currentEntries.map((item, index) => {
                const isExpired = new Date(item?.job?.endDate) < new Date();
                return (
                  <TableRow key={item._id} className={isExpired ? "bg-red-200 hover:bg-red-300" : "hover:bg-gray-50"}>
                    <TableCell className="w-12 text-center">{index + 1}</TableCell>
                    <TableCell className="w-28 whitespace-nowrap">{formatDate(item?.createdAt)}</TableCell>
                    <TableCell 
                      className={`w-28 whitespace-nowrap ${isExpired ? 'text-[#F83002] font-bold' : 'text-green-600 font-bold'}`}
                    >
                      {formatDate(item?.job?.endDate)}
                    </TableCell>
                    <TableCell className="w-44">{item?.job?.title}</TableCell>
                    <TableCell className="w-36">{item?.job?.company?.name}</TableCell>
                    <TableCell className="w-36">{item?.job?.location}</TableCell>
                    <TableCell className="w-24 whitespace-nowrap">{item?.job?.salary} LPA</TableCell>
                    <TableCell className="w-24 text-center">
                      <Button
                        className="bg-[#7209B7] hover:bg-[#ce74f8] text-white"
                        size="sm"
                        onClick={() => navigate(`/description/${item.job._id}`)}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between items-center p-4 bg-gray-100 border-t">
          <Button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            variant="outline"
            className="bg-[#7209B7] text-white hover:bg-[#ce74f8] disabled:bg-gray-300"
          >
            Previous
          </Button>
          <span className="text-gray-700 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            variant="outline"
            className="bg-[#7209B7] text-white hover:bg-[#ce74f8] disabled:bg-gray-300"
          >
            Next
          </Button>
      </div>
    </div>
  );
};
export default SavedJobTable;