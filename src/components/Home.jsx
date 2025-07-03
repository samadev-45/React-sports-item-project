import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div
      className="w-full h-screen bg-cover bg-center flex items-center"
      style={{
        backgroundImage: "url('./bgimg1.png')",
      }}
    >
      <div className="ml-10 max-w-xl bg-white bg-opacity-80 p-8 rounded shadow">
        <h1 className="text-4xl md:text-5xl font-bold text-red-600 mb-4">
          Fuel Your Game
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Explore premium-quality sports gear and apparel for champions.
          Whether you're on the field or the track — we’ve got you covered.
        </p>
        <Link
          to="/products"
          className="inline-block px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
};

export default Home;
