import React, { useState } from 'react'
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';
const HeroSection = () => {
  const [query, setQuery] = useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchJobHandler = () => {
    dispatch(setSearchedQuery(query));
    navigate('/browse');
  }
  return (
    <div className='text-center'>
      <div className='flex flex-col gap-5 my-10'>
        <span className='mx-auto text-[25px] px-6 py-4 rounded-full shadow-lg bg-violet-100 text-[#6A38C2] font-bold'><span className='text-orange-500'>In</span><span className='text-white'>di</span><span className='text-green-700'>a's</span> No.1 <span className='text-[#F83002]'>JobHunt</span> Portal</span>
        <h1 className='text-3xl sm:text-5xl font-bold'><span className='text-[#F83002]'>Search</span>,<span className='text-[#F83002]'> Apply</span> & <br /> Get Your <span className='text-[#6A38C2]'>Dream Jobs</span></h1>
        <p className='text-sm sm:text-base'>We provide the latest job opportunities for professionals across multiple industries. Join us and discover your next big career move.</p>
        <div className='flex w-full sm:w-[40%] shadow-lg border bg-white pl-3 rounded-full items-center gap-4 mx-auto'>
          <input
            type="text"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find your dream jobs"
            className="outline-none border-none w-full bg-white text-gray-900 px-4 py-2 rounded-md shadow-sm focus:ring-2 "
          />
          <Button className="rounded-r-full bg-[#6A38C2]">
            <Search onClick={searchJobHandler} className='h-5 w-5'></Search>
          </Button>
        </div>
      </div>
    </div>
  )
}
export default HeroSection;