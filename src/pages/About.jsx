import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-gray-800">
      <Navbar />

      <main className="flex-grow px-6 py-10 max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-indigo-700 text-center animate-fade-in-up">
          About Snap Sign
        </h1>

        <p className="text-lg leading-relaxed animate-fade-in-up delay-100">
          <strong>Snap Sign</strong> is a secure, user-friendly platform designed to help you digitally sign PDF documents with just a few clicks — no printer, scanner, or pen required!
        </p>

        <ul className="list-disc pl-6 mt-6 space-y-3 animate-fade-in-up delay-200 text-base sm:text-lg">
          <li>📄 Upload and view PDFs instantly.</li>
          <li>🖋 Add your signature using an image or draw directly with your mouse.</li>
          <li>🔐 Keep documents private — only you can access and sign them.</li>
          <li>🚀 Save signed files and download them instantly.</li>
          <li>🧑‍💼 Ideal for students, professionals, and remote teams.</li>
        </ul>

        <div className="mt-10 text-center">
          <p className="text-base text-gray-600 italic">
            Built for the modern digital world, Snap Sign is your trusted tool for fast, paperless, and secure document signing.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}