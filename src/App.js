import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import ForYouPage from "./pages/ForYouPage";
import AskUsPage from "./pages/AskUsPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import UserBaseInfoCollectorPage from "./pages/UserBaseInfoCollectorPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BottomNavBar from "./components/BottomNavBar";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen justify-center items-center">
      <div className="w-full max-w-lg">
        <Router>
          <div className="">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/for-you" element={<ForYouPage />} />
              <Route path="/ask-us" element={<AskUsPage />} />
              <Route
                path="/recommendations"
                element={<RecommendationsPage />}
              />
              <Route
                path="/user-info"
                element={<UserBaseInfoCollectorPage />}
              />
              <Route
                path="*"
                element={<div className="text-center mt-10">Not Found</div>}
              />
            </Routes>
          </div>
          <BottomNavBar />
        </Router>
      </div>
    </div>
  );
}
