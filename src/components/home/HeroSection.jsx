export default function HeroSection() {
  return (
    <header className="bg-yellow-600 text-white text-center py-12">
      <h1 className="text-4xl font-bold mb-4">Not Sure What to Eat?</h1>
      <p className="text-xl mb-8">
        Let us help you decide! Get meal suggestions based on your preferences.
      </p>
      <a
        href="#suggestions"
        className="bg-yellow-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-yellow-600 transition"
      >
        Get Suggestions
      </a>
    </header>
  );
}
