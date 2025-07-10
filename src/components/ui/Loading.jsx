import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(12)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className="bg-surface rounded-lg shadow-card overflow-hidden"
        >
          <div className="w-full h-64 bg-gray-200 shimmer-effect" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded shimmer-effect" />
            <div className="h-4 bg-gray-200 rounded w-3/4 shimmer-effect" />
            <div className="h-6 bg-gray-200 rounded w-1/2 shimmer-effect" />
            <div className="flex gap-2">
              <div className="h-6 w-8 bg-gray-200 rounded shimmer-effect" />
              <div className="h-6 w-8 bg-gray-200 rounded shimmer-effect" />
              <div className="h-6 w-8 bg-gray-200 rounded shimmer-effect" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Loading;