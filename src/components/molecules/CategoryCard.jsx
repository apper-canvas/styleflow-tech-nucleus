import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CategoryCard = ({ category, image, link, className = "" }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={className}
    >
      <Link to={link} className="block">
        <div className="relative overflow-hidden rounded-lg shadow-card hover:shadow-card-hover transition-shadow duration-300">
          <img
            src={image}
            alt={category}
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <h3 className="text-white text-xl font-bold">{category}</h3>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;