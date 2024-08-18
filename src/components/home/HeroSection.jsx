import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const navigate = useNavigate();
  const handleDailySuggestions = () => {
    const localUsername = localStorage.getItem("vihackapp-username");
    if (localUsername === null) {
      navigate("/for-you", {
        state: { message: "User hasn't logged in" },
      });
    }
  };
  return (
    <header className="bg-yellow-600 text-white text-center py-12">
      <h1 className="text-4xl font-bold mb-4">Not Sure What to Eat?</h1>
      <p className="text-xl mb-8">
        Let us help you decide! Get restaurant and meal suggestions based on
        your preferences.
      </p>
    </header>
  );
}
