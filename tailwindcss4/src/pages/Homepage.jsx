import React from 'react';

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-semibold text-center">Welcome to Our Crowdfunding Platform</h1>
      <p className="text-xl mt-4 text-center">
        Discover amazing campaigns and make a difference in the world.
      </p>
      <div className="mt-8 flex justify-center">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700">
          Start a Campaign
        </button>
      </div>
    </div>
  );
}

export default HomePage;
