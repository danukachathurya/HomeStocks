import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  const handleBuyNow = () => {
    navigate("/add-card"); // path to AddCardPage
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-sm transition-transform hover:scale-105 hover:shadow-xl">
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-48 object-cover rounded-md"
      />
      <h2 className="text-lg font-semibold mt-3">{product.title}</h2>
      <p className="text-gray-600 text-sm mt-1">{product.description}</p>
      <div className="flex justify-between items-center mt-4">
        <span className="text-green-600 font-bold text-md">${product.price}</span>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
          onClick={handleBuyNow}
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
};
