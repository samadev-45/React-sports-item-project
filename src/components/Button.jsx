const Button = ({ text, onClick, type = "button" }) => (
  <button
    type={type}
    onClick={onClick}
    className="bg-black text-white px-4 py-3 rounded hover:bg-red-600 transition"
  >
    {text}
  </button>
);
export default Button;
