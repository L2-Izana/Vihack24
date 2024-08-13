import React from "react";
import HeroSection from "../components/home/HeroSection";
import Suggestions from "../components/home/Suggestions";
import Features from "../components/home/Features";
import BottomNavBar from "../components/home/BottomNavBar";

const HomePage = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <HeroSection />
      <Features />
      <Suggestions />
      <BottomNavBar />

      <footer className="bg-yellow-600 text-white text-center py-4">
        <p>&copy; 2024 FoodieVi. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
