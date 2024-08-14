import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormElement from "../components/auth/FormElement";
import { PIZZA_ICON, APPLE_ICON } from "../assets/icons";

const AuthPage = () => {
  // State for form inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");

  // Handle input changes
  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleRetypePasswordChange = (e) => setRetypePassword(e.target.value);
  const [isLogin, setIsLogin] = useState(true);

  const handleToggle = () => {
    setIsLogin(!isLogin);
  };

  const navigate = useNavigate();

  const restartRegister = () => {
    setUsername("");
    setPassword("");
    setRetypePassword("");
  };

  // Later, replace with function that checks with database for credentials
  const isPasswordValid = password.length > 6;
  const isUserNameValid = username.length > 6;
  const isPasswordValidLogin = isLogin && isPasswordValid;
  const isPassWordValidRegister = retypePassword.length > 6 && isPasswordValid;
  const isLoginValid = isUserNameValid && isPasswordValidLogin;
  const isRegisterValid = isPassWordValidRegister && isUserNameValid;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isLoginValid || isRegisterValid) {
      localStorage.setItem("vihackapp-username", username);
    } else {
      restartRegister();
      return;
    }

    navigate("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-yellow-50 p-4">
      <div className="w-full max-w-sm p-6 bg-white shadow-lg rounded-lg border border-gray-200">
        <div className="text-center mb-4">
          {isLogin ? PIZZA_ICON : APPLE_ICON}
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
          <FormElement
            elementID="username"
            elementType="text"
            elementPlaceholder="Enter your username"
            value={username}
            onChange={handleUsernameChange}
          />
          <FormElement
            elementID="password"
            elementType="password"
            elementPlaceholder="Enter your password"
            value={password}
            onChange={handlePasswordChange}
          />
          {!isLogin && (
            <FormElement
              elementID="retype password"
              elementType="password"
              elementPlaceholder="Retype your password"
              value={retypePassword}
              onChange={handleRetypePasswordChange}
            />
          )}
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
