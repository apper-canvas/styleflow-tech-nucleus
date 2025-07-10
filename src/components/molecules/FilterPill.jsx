import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const FilterPill = ({ label, isActive, onClick, onRemove }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`filter-pill ${isActive ? "active" : ""}`}
    >
      <button
        onClick={onClick}
        className="flex items-center gap-2"
      >
        <span>{label}</span>
        {isActive && onRemove && (
          <ApperIcon 
            name="X" 
            size={14} 
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          />
        )}
      </button>
    </motion.div>
  );
};

export default FilterPill;