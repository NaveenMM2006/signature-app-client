import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-700 text-white py-3 shadow">
      <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-serif font-semibold animate-pulse">Snap Sign</h1>
        <div className="flex gap-4 mt-2 sm:mt-0 text-sm sm:text-base">
          <Link to="/Login" className="hover:text-blue-300">Login</Link>
          <Link to="/register" className="hover:text-blue-300">Register</Link>
          <Link to="/dashboard" className="hover:text-blue-300">Dashboard</Link>
          <Link to="/about" className="hover:text-blue-300">About</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;