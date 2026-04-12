import React from 'react';
import LatestJobCards from './LatestJobCards.jsx';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
const LatestJob = () => {
    const { allJobs } = useSelector(store => store.job);
    const navigate = useNavigate();
    return (
        <div className='max-w-7xl mx-auto my-10 px-4 sm:px-6 lg:px-8'>
            <h1 className='text-3xl sm:text-4xl font-bold text-center sm:text-left'>
                <span className='text-[#6A38C2]'>Latest & Top</span> Job Openings
            </h1>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-8'>
                {allJobs.length === 0 ? (
                    <span className="text-gray-500 text-center col-span-full">No Jobs Available!</span>
                ) : (
                    allJobs.slice(0, 6).map((job, index) => (
                        <motion.div
                            key={job._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            className="w-full"
                        >
                            <LatestJobCards job={job} />
                        </motion.div>
                    ))
                )}
            </div>
            {}
            {allJobs.length > 6 && (
                <div className="flex justify-center mt-6">
                    <button
                        onClick={() => navigate('/jobs')}
                        className="px-6 py-2 bg-[#6A38C2] text-white font-semibold rounded-lg hover:bg-[#8a5de1] transition"
                    >
                        Show All
                    </button>
                </div>
            )}
        </div>
    );
};
export default LatestJob;
