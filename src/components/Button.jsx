const Button = ({ text, onClick, type = "button" }) => (
  <button
    type={type}
    onClick={onClick}
    
  >
    {text}
  </button>
);
export default Button;
