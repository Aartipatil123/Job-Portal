import React from 'react';
import Navbar from './shared/Navbar.jsx';
import HeroSection from './HeroSection.jsx';
import LatestJob from './LatestJob.jsx';
import Footer from './Footer.jsx';
import useGetAllJobs from '@/hooks/useGetAllJobs.jsx';
function Home() {
  useGetAllJobs();
  return (
    <div className='bg-[rgb(250,250,250)]'>
      <Navbar />
      <HeroSection />
      <LatestJob />
      <Footer />
    </div>
  );
}
export default Home;