import React from 'react';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 py-4 mb-6">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 text-white p-2 rounded-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5 5 0 00-4.591-3.441 5 5 0 00-4.381 2.95A4.735 4.735 0 003 15z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-8xl tracking-tight">HorizonWeather</h1>
        </div>
        <span className="text-xs bg-blue-50 text-blue-700 font-medium px-2.5 py-1 rounded-full border border-blue-100">
          AI Engineering Assessment Workspace
        </span>
      </div>
    </header>
  );
}