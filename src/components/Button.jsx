const Button = ({ text, onClick, type = "button" }) => (
  <button
    type={type}
    onClick={onClick}
    className="px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 
                   text-white font-semibold text-lg rounded-full shadow-lg 
                   hover:scale-105 hover:shadow-xl transition duration-300 ease-in-out"
  >
    {text}
  </button>
);
export default Button;
