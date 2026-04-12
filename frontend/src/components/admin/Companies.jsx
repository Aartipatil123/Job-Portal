import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import CompaniesTable from './CompaniesTable'
import { useNavigate } from 'react-router-dom'
import useGetAllCompanies from '@/hooks/useGetAllCompanies'
import { useDispatch } from 'react-redux'
import { setSearchCompanyByText } from '@/redux/companySlice'
const Companies = () => {
    useGetAllCompanies();
    const [input, setInput] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(() => {
        dispatch(setSearchCompanyByText(input));
    }, [input])
    return (
        <div>
            <Navbar />
            <div className='max-w-6xl mx-auto my-10'>
                <h1 className="text-3xl font-bold mb-2 text-center">Registered Companies</h1>
                <div className="flex items-center justify-between gap-4 my-5">
                    <div className="flex items-center gap-4">
                        <h2 className="text-lg font-semibold">Search:</h2>
                        <Input className='w-fit' placeholder='Filter By Name' onChange={(e) => setInput(e.target.value)} />
                    </div>
                    <Button onClick={() => navigate('/admin/companies/create')}>
                        New Company
                    </Button>
                </div>
                <CompaniesTable />
            </div>
        </div>
    )
}
export default Companies
