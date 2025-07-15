import React from 'react'

const Navbar = () => {
    return (
        <div className='flex justify-between items-center px-6 py-5 bg-white border-b border-gray-200'>
            {/* Left side - B2B Marketing text */}
            <div>
                <h1 className='text-sm font-semibold text-gray-600 tracking-wider'>
                    B2B MARKETING
                </h1>
            </div>

            {/* Right side - Logout button */}
            <div>
                <button className='px-6 py-2  bg-blue-700 text-white text-sm font-medium rounded-3xl hover:bg-blue-700 transition-colors'>
                    Logout
                </button>
            </div>
        </div>
    )
}

export default Navbar