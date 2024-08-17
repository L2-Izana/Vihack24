import { useState } from "react";
import { FaHeart } from "react-icons/fa";

export default function RestaurantCard({
  image,
  name,
  rating,
  isOpening,
  offers,
  handleLikeRestaurants,
}) {
  const [isLoved, setIsLoved] = useState(false);
  const toggleLoved = () => {
    setIsLoved(!isLoved);
    handleLikeRestaurants();
  };
  return (
    <div className="flex items-center p-4 border-b">
      <img
        src={image}
        alt={name}
        className="w-16 h-16 rounded-lg object-cover"
      />
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
      {isLoved ? (
        <FaHeart className="text-red-500" onClick={toggleLoved} />
      ) : (
        <FaHeart className="text-gray-400" onClick={toggleLoved} />
      )}
    </div>
  );
}
