import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import RestaurantCard from "../components/restaurants/RestaurantCard";
import { FaChevronRight } from "react-icons/fa";

export default function RecommendationsPage() {
  const [showNotification, setShowNotification] = useState(true);
  const [showCheckoutBtn, setShowCheckoutBtn] = useState(false);
  const location = useLocation();
  const { recommendations } = location.state || {};
  const recommendedRestaurants = recommendations
    .map((restaurant) => {
      const restaurantName = restaurant.name;
      const restaurantRating = restaurant.rating;
      const isOpening = restaurant.opening_hours
        ? restaurant.opening_hours.open_now
        : false;
      try {
        const restaurantPhoto = restaurant["photos"];
        const restaurantPhotoObject = restaurantPhoto[0];
        const photoReference = restaurantPhotoObject["photo_reference"];
        const imgUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=AIzaSyBPq_817fag1tlgDk9u18ceM_lSbrJCx1Y`;
        return {
          image: imgUrl,
          name: restaurantName,
          rating: restaurantRating,
          isOpening: isOpening,
        };
      } catch {
        return {
          image:
            "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=600",
          name: restaurantName,
          rating: restaurantRating,
          isOpening: isOpening,
        };
      }
    })
    .sort((a, b) => b.isOpening - a.isOpening);

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
