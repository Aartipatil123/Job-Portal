import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Input } from '../ui/input';
import AllRecruitersTable from './allRecruitersTable.jsx';
const AllRecruiters = () => {
    const [filterText, setFilterText] = useState('');
    return (
        <div>
            <Navbar />
            <div className='max-w-6xl mx-auto my-10'>
                <h1 className="text-3xl font-bold mb-2 text-center">Registered Recruiters</h1>
                <div className="flex items-center justify-start gap-4 my-5">
                    <h2 className="text-lg font-semibold">Search:</h2>
                    <Input
                        className='w-fit'
                        placeholder='Filter By Name'
                        onChange={(e) => setFilterText(e.target.value)}
                        value={filterText}
                    />
                </div>
                <AllRecruitersTable filterText={filterText} />
            </div>
        </div>
    );
};
export default AllRecruiters;
