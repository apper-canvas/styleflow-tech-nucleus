import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="w-20 h-20 bg-error bg-opacity-10 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name="AlertCircle" size={40} className="text-error" />
      </div>
      
      <h3 className="text-2xl font-bold text-secondary mb-2">Oops!</h3>
      <p className="text-gray-600 text-center mb-8 max-w-md">
        {message}
      </p>
      
      {onRetry && (
        <Button onClick={onRetry} className="flex items-center gap-2">
          <ApperIcon name="RefreshCw" size={16} />
          Try Again
        </Button>
      )}
    </motion.div>
  );
};

export default Error;