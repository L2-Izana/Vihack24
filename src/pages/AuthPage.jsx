import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaAppleAlt, FaPizzaSlice } from "react-icons/fa";
import FormElement from "../components/auth/FormElement";

const AuthPage = () => {
  const pizzaSliceIcon = (
    <FaPizzaSlice className="text-3xl text-red-600 mx-auto mb-2" />
  );
  const appleIcon = (
    <FaAppleAlt className="text-3xl text-green-600 mx-auto mb-2" />
  );

  const [isLogin, setIsLogin] = useState(true);

  const handleToggle = () => {
    setIsLogin(!isLogin);
  };

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    // Add authentication process here

    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-yellow-50 p-4">
      <div className="w-full max-w-sm p-6 bg-white shadow-lg rounded-lg border border-gray-200">
        <div className="text-center mb-4">
          {isLogin ? pizzaSliceIcon : appleIcon}
          <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
            {isLogin ? "Welcome Back!" : "Join Us!"}
          </h2>
          <p className="text-gray-600 text-sm">
            {isLogin
              ? "Login to continue enjoying our delicious recipes."
              : "Sign up to start your culinary adventure!"}
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          {!isLogin && <FormElement elementID="name" elementType="text" />}
          <FormElement elementID="email" elementType="email" />
          <FormElement elementID="password" elementType="password" />

          <button
            type="submit"
            className="w-full py-2 px-4 bg-yellow-500 text-white font-semibold rounded-md shadow-sm hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={handleToggle}
            className="text-yellow-600 hover:underline"
          >
            {isLogin ? "New here? Register" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
