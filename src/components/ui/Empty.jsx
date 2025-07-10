import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No items found", 
  description = "Start exploring our amazing collection", 
  actionText = "Browse Products",
  actionLink = "/",
  icon = "Package"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="w-20 h-20 bg-gradient-to-r from-primary to-accent bg-opacity-10 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} size={40} className="text-primary" />
      </div>
      
      <h3 className="text-2xl font-bold text-secondary mb-2">{title}</h3>
      <p className="text-gray-600 text-center mb-8 max-w-md">
        {description}
      </p>
      
      <Button asChild>
        <Link to={actionLink} className="flex items-center gap-2">
          <ApperIcon name="ArrowRight" size={16} />
          {actionText}
        </Link>
      </Button>
    </motion.div>
  );
};

export default Empty;