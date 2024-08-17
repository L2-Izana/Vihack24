import { FaHeart } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const RestaurantCard = ({ image, name, rating, isOpening, offers }) => (
  <div className="flex items-center p-4 border-b">
    <img src={image} alt={name} className="w-16 h-16 rounded-lg object-cover" />
    <div className="ml-4 flex-1">
      <h3 className="text-lg font-semibold">{name}</h3>
      <div className="text-gray-500 text-sm">
        {offers && <span className="text-green-600 mr-2">{offers}</span>}
        {isOpening ? (
          <span className="text-green-500">Opening</span>
        ) : (
          <span className="text-red-600">Closed</span>
        )}
        <span className="ml-2">⭐ {rating}</span>
      </div>
    </div>
    <FaHeart className="text-gray-400" />
  </div>
);

export default function RecommendationsPage() {
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

  return (
    <div className="bg-white min-h-screen">
      <div className="p-4">
        {recommendedRestaurants.map((restaurant, index) => (
          <RestaurantCard key={index} {...restaurant} />
        ))}
      </div>
    </div>
  );
}
