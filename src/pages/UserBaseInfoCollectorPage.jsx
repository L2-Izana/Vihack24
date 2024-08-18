import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  cuisineOptions,
  allergyOptions,
  foodTypeOptions,
} from "../components/user/user_feature_options";
import { collectUserBaseInfo } from "../utils/save_user_info";

const UserBaseInfoCollectorPage = () => {
  const { register, handleSubmit } = useForm();
  const [allergies, setAllergies] = useState([]);
  const [foodTypes, setFoodTypes] = useState([]);
  const [cuisines, setCuisines] = useState([]);
  const [sex, setSex] = useState("");
  const [realName, setRealName] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const localUsername = localStorage.getItem("vihackapp-username");
      const dataToCollect = JSON.stringify({
        ...data,
        allergies,
        foodTypes,
        cuisines,
        sex,
        realName,
        username: localUsername,
      });
      const saveUserResponse = await collectUserBaseInfo(dataToCollect);
      console.log(saveUserResponse);
      console.log("cc");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          User Information Collector
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Real Name:
            </label>
            <input
              type="text"
              value={realName}
              onChange={(e) => setRealName(e.target.value)}
              placeholder="Enter your real name"
              className="form-input block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-pink-500 focus:ring focus:ring-pink-500 focus:ring-opacity-50"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Select Sex:
            </label>
            <div className="flex gap-4">
              {["Male", "Female", "Other"].map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`flex-1 py-2 px-4 text-white font-bold rounded-md focus:outline-none ${
                    sex === option
                      ? "bg-pink-500"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  onClick={() => setSex(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Select Allergies:
            </label>
            <div className="flex flex-wrap gap-4">
              {allergyOptions.map((option) => (
                <label key={option} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    value={option}
                    {...register("allergies")}
                    onChange={(e) => {
                      const { value, checked } = e.target;
                      setAllergies((prev) =>
                        checked
                          ? [...prev, value]
                          : prev.filter((item) => item !== value)
                      );
                    }}
                    className="form-checkbox h-5 w-5 text-yellow-500"
                  />
                  <span className="ml-2 text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Favorite Food Types:
            </label>
            <div className="flex flex-wrap gap-4">
              {foodTypeOptions.map((option) => (
                <label key={option} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    value={option}
                    {...register("foodTypes")}
                    onChange={(e) => {
                      const { value, checked } = e.target;
                      setFoodTypes((prev) =>
                        checked
                          ? [...prev, value]
                          : prev.filter((item) => item !== value)
                      );
                    }}
                    className="form-checkbox h-5 w-5 text-pink-500"
                  />
                  <span className="ml-2 text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Favorite Cuisines:
            </label>
            <div className="flex flex-wrap gap-4">
              {cuisineOptions.map((option) => (
                <label key={option} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    value={option}
                    {...register("cuisines")}
                    onChange={(e) => {
                      const { value, checked } = e.target;
                      setCuisines((prev) =>
                        checked
                          ? [...prev, value]
                          : prev.filter((item) => item !== value)
                      );
                    }}
                    className="form-checkbox h-5 w-5 text-purple-500"
                  />
                  <span className="ml-2 text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-pink-500 text-white font-bold py-2 px-4 rounded-md hover:bg-pink-600 focus:outline-none focus:ring focus:ring-pink-300 focus:ring-opacity-50"
          >
            Save Information
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserBaseInfoCollectorPage;
