import React from "react";
import HeroSection from "../components/home/HeroSection";
import Suggestions from "../components/home/Suggestions";
import Features from "../components/home/Features";

const HomePage = () => {
  return (
    <div className="bg-gray-100">
      <HeroSection />
      <Features />
      <Suggestions />

      <footer className="bg-yellow-600 text-white text-center py-4">
        <p>&copy; 2024 FoodieVi. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
