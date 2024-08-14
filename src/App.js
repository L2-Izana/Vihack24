import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import ForYouPage from "./pages/ForYouPage";
import AskUsPage from "./pages/AskUsPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BottomNavBar from "./components/BottomNavBar";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Router>
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/for-you" element={<ForYouPage />} />
            <Route path="/ask-us" element={<AskUsPage />} />
            <Route
              path="*"
              element={<div className="text-center mt-10">Not Found</div>}
            />
          </Routes>
        </div>
        <BottomNavBar />
      </Router>
    </div>
  );
}
