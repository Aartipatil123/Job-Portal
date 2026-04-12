import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage } from './ui/avatar';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { SaveJobButton } from '@/components/SaveJobButton.jsx';
import { JOB_API_END_POINT } from '@/utils/constant';
const Job = ({ job }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user?._id);
  const [isSaved, setIsSaved] = useState(false);
  useEffect(() => {
    if (!user || !job._id) return;
    const fetchSavedJobs = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/saved-jobs`, {
          withCredentials: true
        });
        if (res.data.success) {
          const jobIsSaved = res.data.savedJobs.some(savedJob => savedJob.job._id === job._id);
          setIsSaved(jobIsSaved);
        }
      } catch (error) {
        console.error("Error fetching saved jobs:", error);
      }
    };
    fetchSavedJobs();
  }, [user, job._id]);
  const dayAgo = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = Math.floor((currentTime - createdAt) / (1000 * 60 * 60 * 24));
    return timeDifference === 0 ? "Today" : `${timeDifference} days ago`;
  };
  const isJobExpired = new Date(job.endDate).setHours(23, 59, 59, 999) < new Date();
  return (
    <div className={`p-3 pl-6 rounded-md shadow-md border border-gray-100 mt-2 mx-auto max-w-[380px] w-full border-t-4 border-t-[#7209B7] 
            ${isSaved ? 'bg-green-100' : 'bg-white'}`}>
      <div className='flex items-center justify-between'>
        <p className='text-sm font-bold text-gray-500'>{dayAgo(job?.createdAt)}</p>
        <div className="flex gap-2 ml-auto mr-2">
          <p className='text-sm font-bold text-[#7209B7]'>Apply till date:</p>
          <p className='text-sm font-bold text-green-500'>{job?.endDate.split("T")[0]}</p>
        </div>
      </div>
      <div className='flex items-center mx-4 gap-4 my-2'>
        <Button className="p-6" variant="outline" size="icon">
          <Avatar>
            <AvatarImage src={job?.company?.logo || 'https://static.vecteezy.com/system/resources/previews/008/214/517/non_2x/abstract-geometric-logo-for-your-company-free-vector.jpg'} />
          </Avatar>
        </Button>
        <div>
          <h1 className='font-medium text-lg'>{job?.company?.name}</h1>
          <p className='text-sm text-gray-500'>{job?.location}</p>
        </div>
      </div>
      <div>
        <h1 className='font-bold mx-4 text-lg my-2'>{job?.title}</h1>
        <p className='text-gray-600 mx-4 text-sm'>{job?.description}</p>
      </div>
      <div className="flex flex-wrap mx-4 gap-1.2 mt-2">
        <Badge className="text-blue-700 font-bold bg-white text-center" variant="ghost">
          Positions: {job?.position}
        </Badge>
        <Badge className="text-[#F83002] font-bold bg-white text-center" variant="ghost">
          {job?.jobType}
        </Badge>
        <Badge className="text-[#7209B7] font-bold bg-white text-center" variant="ghost">
          Salary: {job?.salary} LPA
        </Badge>
      </div>
      <div className='flex justify-between items-center mt-3'>
        {isJobExpired ? (
          <Button
            variant="outline"
            className="text-[#F83002] mx-5 font-bold cursor-not-allowed hover:bg-white"
          >
            Not accepting further applications.
          </Button>
        ) : (
          <div className="flex items-center gap-3">
            <Button
              className="mx-4 w-32 bg-[#7209B7] text-white hover:bg-[#ce74f8]"
              variant="outline"
              onClick={() => navigate(`/description/${job._id}`)}
            >
              Details
            </Button>
            {}
            <SaveJobButton jobId={job._id} isSaved={isSaved} setIsSaved={setIsSaved} />
          </div>
        )}
      </div>
    </div>
  );
};
export default Job;
