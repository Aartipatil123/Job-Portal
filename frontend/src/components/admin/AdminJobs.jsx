import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import AdminJobsTable from './AdminJobsTable';
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs';
import { setSearchJobByText } from '@/redux/jobSlice';
const AdminJobs = () => {
  useGetAllAdminJobs();
  const [input, setInput] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(setSearchJobByText(input));
  }, [input]);
  return (
    <div>
      <Navbar />
      <div className='max-w-6xl mx-auto my-10'>
        <h1 className="text-3xl font-bold mb-2 text-center">Registered Jobs</h1>
        {}
        <div className="flex items-center justify-between gap-4 my-5">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">Search:</h2>
            <Input className='w-fit' placeholder='Filter By Name or Role' onChange={(e) => setInput(e.target.value)} />
          </div>
          <Button onClick={() => navigate('/admin/jobs/create')}>Post new Jobs</Button>
        </div>
        {}
        <AdminJobsTable />
      </div>
    </div>
  );
};
export default AdminJobs;
