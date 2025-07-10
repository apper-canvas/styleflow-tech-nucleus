import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ProductCard from "@/components/molecules/ProductCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { getWishlistItems } from "@/services/api/cartService";

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWishlistItems = async () => {
    try {
      setLoading(true);
      setError("");
      
      const data = await getWishlistItems();
      setWishlistItems(data);
    } catch (err) {
      setError("Failed to load wishlist items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlistItems();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-8 bg-gray-200 rounded w-48 mb-8 shimmer-effect" />
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Error message={error} onRetry={loadWishlistItems} />
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Empty 
          title="Your wishlist is empty"
          description="Save your favorite products to your wishlist and shop them later"
          actionText="Discover Products"
          actionLink="/"
          icon="Heart"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-secondary mb-2">My Wishlist</h1>
        <p className="text-gray-600">
          {wishlistItems.length} item{wishlistItems.length > 1 ? "s" : ""} in your wishlist
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((product, index) => (
          <motion.div
            key={product.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Button asChild size="lg">
          <Link to="/" className="flex items-center gap-2">
            <ApperIcon name="ArrowLeft" size={16} />
            Continue Shopping
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Wishlist;