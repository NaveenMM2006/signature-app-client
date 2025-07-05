import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800">
      <Navbar />
      <section className="flex-grow flex flex-col items-center justify-center px-4 text-center bg-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up">
          ✍ Digitally Sign Your PDFs with Ease
        </h1>
        <p className="text-lg md:text-xl mb-6 max-w-2xl animate-fade-in-up delay-150 text-gray-600">
          Welcome to Snap Sign — a fast, secure and eco-friendly way to sign documents online. Say goodbye to printers and scanners!
        </p>
        <Link
          to="/register"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition-all animate-fade-in-up delay-300"
        >
          Get Started
        </Link>
      </section>
      <Footer />
    </div>
  );
}