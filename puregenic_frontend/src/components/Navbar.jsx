// Navbar component
import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { IoMdSearch } from 'react-icons/io';
import { HiOutlineUpload } from "react-icons/hi";

const Navbar = ({ searchTerm, setSearchTerm, user }) => {

    // Navigate to search page
    const navigate = useNavigate();

    // If user is not logged in, return null
    if (!user) return null;

    return (
        <div className='flex gap-w md:gap-5 w-full mt-5 pb-7'>
            <div className='flex justify-start items-center w-full px-2 rounded-md bg-white border-none outline-none focus-within:shadow-sm'>
                <IoMdSearch fontSize={21} className='ml-1' />

                {/* Search input */}
                <input
                    type='text'
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder='Search'
                    value={searchTerm}
                    onFocus={() => navigate('/search')}
                    className='p-2 w-full bg-white outline-none'
                />
            </div>
            <div className='flex gap-3'>
                <Link to={`user-profile/${user?._id}`} className='hidden md:block'>
                    <img src={user.image} alt='user' className='w-14 h-12 rounded-full shadow-md hover:shadow-xl' />
                </Link>
                <Link to='create-pin' className='w-12 h-12 md:w-14 md:h-12 flex justify-center hover:text-purple-700 rounded-full items-center hover:shadow-inner text-2xl'>
                    <HiOutlineUpload />
                </Link>
            </div>
        </div >
    )
}

export default Navbar