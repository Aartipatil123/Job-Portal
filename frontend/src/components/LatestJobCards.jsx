import { useNavigate } from 'react-router-dom';
import { Badge } from './ui/badge.jsx';
import React from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarImage } from './ui/avatar';
function LatestJobCards({ job }) {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const jobEndDate = job?.endDate?.split("T")[0];
  if (jobEndDate < today) {
    return null;
  }
  return (
    <div 
      onClick={() => navigate(`/description/${job._id}`)} 
      className='border-t-4 border-t-[#7209B7] p-5 rounded-md shadow-xl bg-white border border-gray-100 cursor-pointer hover:shadow-2xl transition-shadow duration-300 w-full text-left'
    >
      <div className='flex flex-col md:flex-row items-start gap-4 my-2'>
        <Button className="p-6" variant="outline" size="icon">
          <Avatar>
            <AvatarImage
              src={job?.company?.logo || 'https://static.vecteezy.com/system/resources/previews/008/214/517/non_2x/abstract-geometric-logo-for-your-company-free-vector.jpg'}
            />
          </Avatar>
        </Button>
        <div className='text-left'>
          <h1 className='font-medium text-lg'>{job?.company?.name}</h1>
          <p className='text-sm text-gray-500'>{job?.location}</p>
        </div>
      </div>
      <div className='text-left'>
        <h1 className='font-bold text-lg my-2'>{job?.title}</h1>
        <p className='text-sm text-gray-600'>{job?.description}</p>
      </div>
      <div className="mt-2">
        <div className="flex flex-col md:flex-row items-start gap-2">
          <p className="text-sm font-bold text-[#7209B7]">Apply till date :</p>
          <p className="font-bold text-green-600">{jobEndDate}</p>
        </div>
      </div>
      <div className='flex flex-col md:flex-row items-start gap-2 mt-4'>
        <Badge className={'text-blue-700 font-bold'} variant='ghost'>Positions: {job?.position}</Badge>
        <Badge className={'text-[#F83002] font-bold'} variant='ghost'>{job?.jobType}</Badge>
        <Badge className={'text-[#7209B7] font-bold'} variant='ghost'>Salary: {job?.salary} LPA</Badge>
      </div>
    </div>
  );
}
export default LatestJobCards;