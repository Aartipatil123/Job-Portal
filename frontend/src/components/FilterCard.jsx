import { useDispatch } from 'react-redux';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import React, { useEffect, useState } from 'react';
import { setSearchedQuery } from '@/redux/jobSlice';
const filterData = [
    {
        filterType: "Location",
        array: [
            "Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Ahmedabad", "Chennai",
            "Kolkata", "Pune", "Jaipur", "Surat", "Lucknow", "Kanpur", "Nagpur",
            "Indore", "Thane", "Bhopal", "Visakhapatnam", "Patna", "Vadodara",
            "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut",
            "Rajkot", "Kalyan-Dombivli", "Vasai-Virar", "Varanasi", "Srinagar",
            "Aurangabad", "Dhanbad", "Amritsar", "Navi Mumbai", "Allahabad",
            "Ranchi", "Howrah", "Coimbatore", "Jabalpur", "Gwalior", "Vijayawada",
            "Jodhpur", "Madurai", "Raipur", "Kota", "Guwahati", "Chandigarh",
            "Solapur", "Hubli-Dharwad", "Mysuru", "Tiruchirappalli", "Bareilly",
            "Aligarh", "Tiruppur", "Moradabad", "Jalandhar", "Bhubaneswar",
            "Salem", "Warangal", "Guntur", "Bhiwandi", "Saharanpur", "Gorakhpur",
            "Bikaner", "Amravati", "Noida", "Jamshedpur", "Bhilai", "Cuttack",
            "Firozabad", "Kochi", "Bhavnagar", "Dehradun", "Durgapur",
            "Asansol", "Nanded", "Ajmer", "Jamnagar", "Ujjain", "Sangli",
            "Loni", "Jhansi", "Ulhasnagar", "Nellore", "Jammu", "Belagavi",
            "Mangalore", "Erode", "Tirunelveli", "Malegaon", "Gulbarga",
            "Ichalkaranji", "Davanagere", "Kozhikode", "Akola", "Kurnool",
            "Bokaro Steel City", "Rajahmundry", "Ballari", "Agartala",
            "Bhagalpur", "Latur", "Dhule", "Korba", "Bhilwara", "Berhampur",
            "Muzaffarpur", "Ahmednagar", "Mathura", "Kollam", "Avadi",
            "Kadapa", "Kamarhati", "Bilaspur", "Shahjahanpur", "Bijapur",
            "Rampur", "Shivamogga", "Chandrapur", "Junagadh", "Thrissur",
            "Alwar", "Bardhaman", "Kulti", "Nizamabad", "Parbhani", "Tumkur",
            "Khammam", "Ozhukarai", "Bihar Sharif", "Panipat", "Darbhanga",
            "Bally", "Aizawl", "Dewas", "Ichalkaranji", "Karnal", "Bathinda",
            "Jalna", "Eluru", "Barasat", "Kirari Suleman Nagar", "Purnia",
            "Satna", "Mau", "Sonipat", "Farrukhabad", "Sagar", "Rourkela",
            "Durg", "Imphal", "Ratlam", "Hapur", "Arrah", "Anantapur",
            "Karimnagar", "Etawah", "Ambernath", "North Dumdum", "Bharatpur",
            "Begusarai", "New Delhi", "Gandhinagar", "Puducherry",
            "Port Blair", "Silvassa", "Daman", "Aizawl", "Shillong",
            "Itanagar", "Dispur", "Panaji", "Gangtok", "Kohima"
        ]
    },
    {
        filterType: "Industry",
        array: [
            "Frontend Developer", "Backend Developer", "MERN Developer",
            "Testing", "UI Design", "Full-Stack Developer", "Data Scientist",
            "DevOps Engineer", "Mobile App Developer", "Product Manager"
        ]
    }
];
const FilterCard = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [selectedIndustries, setSelectedIndustries] = useState([]);
    const [filteredLocations, setFilteredLocations] = useState(filterData[0].array);
    const [filteredIndustries, setFilteredIndustries] = useState(filterData[1].array);
    const [filteredResults, setFilteredResults] = useState([]);
    const [showAllLocations, setShowAllLocations] = useState(false);
    const [showAllIndustries, setShowAllIndustries] = useState(false);
    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const [isIndustryOpen, setIsIndustryOpen] = useState(false);
    const dispatch = useDispatch();
    const handleLocationChange = (value) => {
        setSelectedLocations((prev) => {
            if (prev.includes(value)) {
                return prev.filter((item) => item !== value);
            } else {
                return [...prev, value];
            }
        });
    };
    const handleIndustryChange = (value) => {
        setSelectedIndustries((prev) => {
            if (prev.includes(value)) {
                return prev.filter((item) => item !== value);
            } else {
                return [...prev, value];
            }
        });
    };
    useEffect(() => {
        const combinedFilters = [...selectedLocations, ...selectedIndustries];
        setFilteredResults(combinedFilters);
        dispatch(setSearchedQuery(combinedFilters.join(', ')));
    }, [selectedLocations, selectedIndustries, dispatch]);
    useEffect(() => {
        const lowerCaseQuery = searchQuery.toLowerCase();
        const filteredLocations = filterData[0].array.filter((location) =>
            location.toLowerCase().includes(lowerCaseQuery)
        );
        const filteredIndustries = filterData[1].array.filter((industry) =>
            industry.toLowerCase().includes(lowerCaseQuery)
        );
        setFilteredLocations(filteredLocations);
        setFilteredIndustries(filteredIndustries);
        dispatch(setSearchedQuery(searchQuery));
    }, [searchQuery, dispatch]);
    return (
        <div className='w-full p-3 rounded-md bg-white shadow-sm'>
            <h1 className='font-bold text-lg'>Filter Jobs</h1>
            <hr className='mt-3' />
            {}
            <input
                type="text"
                placeholder="Search by location, industry, etc."
                className="w-full p-2 border rounded-md mb-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            {}
            <div className="mb-4">
                <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setIsLocationOpen(!isLocationOpen)}
                >
                    <h1 className='font-bold text-lg'>Location</h1>
                    <span>{isLocationOpen ? '▲' : '▼'}</span>
                </div>
                {isLocationOpen && (
                    <div className="max-h-[200px] overflow-y-auto mt-2">
                        {filteredLocations.slice(0, showAllLocations ? filteredLocations.length : 4).map((location, idx) => {
                            const itemId = `location-${idx}`;
                            return (
                                <div key={idx} className='flex items-center space-x-2 my-2'>
                                    <Checkbox
                                        id={itemId}
                                        checked={selectedLocations.includes(location)}
                                        onCheckedChange={() => handleLocationChange(location)}
                                    />
                                    <Label htmlFor={itemId}>{location}</Label>
                                </div>
                            );
                        })}
                        {filteredLocations.length > 4 && (
                            <button
                                className="text-blue-500 underline mt-2"
                                onClick={() => setShowAllLocations(!showAllLocations)}
                            >
                                {showAllLocations ? "Show Less" : "Show More"}
                            </button>
                        )}
                    </div>
                )}
            </div>
            {}
            <div className="mb-4">
                <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setIsIndustryOpen(!isIndustryOpen)}
                >
                    <h1 className='font-bold text-lg'>Industry</h1>
                    <span>{isIndustryOpen ? '▲' : '▼'}</span>
                </div>
                {isIndustryOpen && (
                    <div className="max-h-[200px] overflow-y-auto mt-2">
                        {filteredIndustries.slice(0, showAllIndustries ? filteredIndustries.length : 4).map((industry, idx) => {
                            const itemId = `industry-${idx}`;
                            return (
                                <div key={idx} className='flex items-center space-x-2 my-2'>
                                    <Checkbox
                                        id={itemId}
                                        checked={selectedIndustries.includes(industry)}
                                        onCheckedChange={() => handleIndustryChange(industry)}
                                    />
                                    <Label htmlFor={itemId}>{industry}</Label>
                                </div>
                            );
                        })}
                        {filteredIndustries.length > 4 && (
                            <button
                                className="text-blue-500 underline mt-2"
                                onClick={() => setShowAllIndustries(!showAllIndustries)}
                            >
                                {showAllIndustries ? "Show Less" : "Show More"}
                            </button>
                        )}
                    </div>
                )}
            </div>
            {}
        </div>
    );
};
export default FilterCard;