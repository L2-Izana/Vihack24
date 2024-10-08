import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import RestaurantCard from "../components/restaurants/RestaurantCard";

export default function RecommendationsPage() {
  const [showNotification, setShowNotification] = useState(true);
  const [showCheckoutBtn, setShowCheckoutBtn] = useState(false);
  const location = useLocation();
  const { recommendations } = location.state || {};
  const recommendedRestaurants = recommendations.sort(
    (a, b) => -a.isOpening + b.isOpening
  );

  const handleLikeRestaurants = () => {
    setShowCheckoutBtn(true);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="p-4">
        {recommendedRestaurants.map((restaurant, index) => (
          <RestaurantCard
            key={index}
            {...restaurant}
            handleLikeRestaurants={handleLikeRestaurants}
          />
        ))}
      </div>
      {showNotification && (
        <Notification
          message="Like your ideal restaurants"
          onClose={() => setShowNotification(false)}
        />
      )}
      {showCheckoutBtn && (
        <button className="fixed bottom-16 right-4 bg-red-400 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-red-500">
          Check out
        </button>
      )}
    </div>
  );
}

const Notification = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-1 right-0 bg-red-600 text-white border border-gray-300 rounded-lg shadow-md p-1">
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};
