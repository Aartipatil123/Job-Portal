import React, { useEffect } from 'react';
import Navbar from './shared/Navbar';
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
const Browse = () => {
    useGetAllJobs();
    const { allJobs } = useSelector(store => store.job);
    const dispatch = useDispatch();
    useEffect(() => {
        return () => {
            dispatch(setSearchedQuery(""));
        };
    }, [dispatch]);
    const now = new Date();
    const validJobs = allJobs.filter((job) => {
        const jobEndDate = new Date(job?.endDate);
        jobEndDate.setHours(jobEndDate.getHours() + 24);
        return now <= jobEndDate;
    });
    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto my-10'>
                <h1 className='font-bold my-10 text-xl'>Search Results ({validJobs.length})</h1>
                <div className='grid grid-cols-3 gap-4'>
                    {validJobs.length > 0 ? (
                        validJobs.map((job) => <Job key={job._id} job={job} />)
                    ) : (
                        <div className="col-span-3 text-gray-500 text-xl">
                            No active jobs found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default Browse;
