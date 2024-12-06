import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">
          YouTube Weekly Creator Tracker
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Track your content creation journey and maintain your weekly streak
        </p>
      </div>
    </header>
  );
};