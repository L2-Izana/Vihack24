// import { FaSearch } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";

// export default function Suggestions() {
//   const [restaurants, setRestaurants] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       const data = await getRestaurantSuggestions();
//       setRestaurants(data);
//     };
//     fetchData();
//   }, []);

//   return (
//     <section id="suggestions" className="py-16 px-4 bg-yellow-50">
//       <div className="max-w-6xl mx-auto text-center">
//         <h2 className="text-3xl font-bold mb-8">Today's Top Suggestions</h2>
//         <div className="grid grid-cols-1 gap-8">
//           <div className="bg-white p-6 rounded-lg shadow-lg">
//             <FaSearch className="text-yellow-600 text-5xl mb-4 mx-auto" />
//             <h3 className="text-xl font-semibold mb-2">
//               Must-try restaurant today
//             </h3>
//             <p className="text-gray-600 mb-4">
//               A brief description of this delicious restaurant suggestion for
//               you.
//             </p>
//             <button
//               onClick={() => navigate("/restaurant_detail/")}
//               className="text-yellow-600 hover:text-yellow-400"
//             >
//               Check it out!
//             </button>
//           </div>
//           <div className="bg-white p-6 rounded-lg shadow-lg">
//             <FaSearch className="text-yellow-600 text-5xl mb-4 mx-auto" />
//             <h3 className="text-xl font-semibold mb-2">Home Cooked Meal</h3>
//             <p className="text-gray-600 mb-4">
//               A brief description of a delicious home cooked meal suggestion to
//               inspire you.
//             </p>
//             <button
//               onClick={() => navigate("/cook_recipe/")}
//               className="text-yellow-600 hover:text-yellow-400"
//             >
//               Look it up!
//             </button>
//           </div>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {restaurants.length > 0 ? (
//             restaurants.map((restaurant) => (
//               <div className="flex items-center p-4 border-b">
//                 <img
//                   src={
//                     restaurant.photo_reference
//                       ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${restaurant.photo_reference}&key=${API_KEY}`
//                       : "default-image-url"
//                   }
//                   alt={restaurant.name}
//                   className="w-16 h-16 rounded-lg object-cover"
//                 />
//                 <div className="ml-4 flex-1">
//                   <h3 className="text-lg font-semibold">{name}</h3>
//                   <div className="text-gray-500 text-sm">
//                     {restaurant.opening_hours?.open_now ? (
//                       <span className="text-green-500">Opening</span>
//                     ) : (
//                       <span className="text-red-600">Closed</span>
//                     )}
//                     <span className="ml-2">⭐ {restaurant.rating}</span>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-600">
//               No restaurant suggestions available at the moment.
//             </p>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }
