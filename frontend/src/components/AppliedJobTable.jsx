import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table.jsx';
import { Badge } from './ui/badge.jsx';
import { Button } from './ui/button.jsx';
const AppliedJobTable = () => {
  const { allAppliedJobs = [] } = useSelector(store => store.job);
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = allAppliedJobs.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(allAppliedJobs.length / entriesPerPage);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  return (
    <div className="border border-[#7209B7] rounded-lg shadow-lg max-w-6xl mx-auto">
      <div className="bg-gray-100">
        <Table>
          <TableHeader>
            <TableRow className="border-b">
              <TableHead className="w-10 text-center font-semibold px-4 whitespace-nowrap">#</TableHead>
              <TableHead className="w-24 font-semibold px-4 whitespace-nowrap">Application Date</TableHead>
              <TableHead className="w-28 font-semibold px-3 ml-[-8px] whitespace-nowrap">End Date</TableHead>  {}
              <TableHead className="w-48 font-semibold px-4 whitespace-nowrap">Job Role</TableHead>
              <TableHead className="w-40 font-semibold px-4 whitespace-nowrap">Company</TableHead>
              <TableHead className="w-40 font-semibold px-4 whitespace-nowrap">Location</TableHead>
              <TableHead className="w-28 font-semibold px-4 whitespace-nowrap">Salary</TableHead>
              <TableHead className="w-32 text-center font-semibold px-4 whitespace-nowrap">Status</TableHead>
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
                  **You haven't applied to any jobs yet**
                </TableCell>
              </TableRow>
            ) : (
              currentEntries.map((item, index) => {
                const isExpired = new Date(item?.job?.endDate) < new Date();
                return (
                  <TableRow key={item._id} className={isExpired ? "bg-red-200 hover:bg-red-300" : "hover:bg-gray-50"}>
                    <TableCell className="w-16 text-center px-4 whitespace-nowrap">{index + 1}</TableCell>
                    <TableCell className="w-32 px-4 whitespace-nowrap">{formatDate(item?.createdAt)}</TableCell>
                    <TableCell
                      className={`w-32 px-4 whitespace-nowrap ${isExpired ? 'text-[#F83002] font-bold' : 'text-green-600 font-bold'}`}
                    >
                      {formatDate(item?.job?.endDate)}
                    </TableCell>
                    <TableCell className="w-48 px-4 whitespace-nowrap">{item?.job?.title}</TableCell>
                    <TableCell className="w-40 px-4 whitespace-nowrap">{item?.job?.company?.name}</TableCell>
                    <TableCell className="w-40 px-4">{item?.job?.location}</TableCell>
                    <TableCell className="w-28 px-4 whitespace-nowrap">{item?.job?.salary} LPA</TableCell>
                    <TableCell className="w-32 text-center px-4">
                      <Badge className="bg-[#121212] text-white text-xs">
                        {item?.status.toUpperCase()}
                      </Badge>
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
export default AppliedJobTable;