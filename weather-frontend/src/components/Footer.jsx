import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-10 mt-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: Candidate Portfolio Block */}
        <div className="space-y-3">
          <h4 className="text-white font-semibold text-sm tracking-wide uppercase">
            Technical Submission Context
          </h4>
          <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
            This Full-Stack Weather Orchestration Engine was engineered completely from scratch by 
            <span className="text-blue-400 font-medium ml-1">Muhammad Faseeh Khattak</span> for the 
            AI Engineer Internship Evaluation. 
          </p>
          <div className="text-[11px] text-gray-500">
            Stack Architecture: FastAPI (Asynchronous Python) • React.js (Vite Core) • Tailwind CSS Engine • SQLite Core Storage
          </div>
        </div>

        {/* Right Column: PM Accelerator Corporate Parameters */}
        <div className="space-y-3">
          <h4 className="text-white font-semibold text-sm tracking-wide uppercase">
            About PM Accelerator
          </h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            The Product Manager Accelerator program is designed to cultivate the next tier of product management 
            and AI technical talents. By pairing developers with rigorous design parameters, PM Accelerator 
            fosters extreme scalability, building industry-ready tools and turning conceptual software into market-viable products.
          </p>
          <div>
            <a 
              href="https://www.linkedin.com/school/pmaccelerator/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center text-xs text-blue-400 hover:text-blue-300 font-medium transition space-x-1"
            >
              <span>Verify Corporate Profile on LinkedIn</span>
              <span className="text-[10px]">➔</span>
            </a>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-gray-800 text-center text-[11px] text-gray-600">
        © 2026 HorizonWeather Registry. All infrastructure rights reserved. Managed autonomously.
      </div>
    </footer>
  );
}