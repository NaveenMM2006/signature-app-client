import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-700 text-white py-4 ">
      <div className="max-w-7xl mx-auto text-center text-sm sm:text-base">
        &copy; {new Date().getFullYear()} Snap Sign. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;