import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { addToCart } from "@/services/api/cartService";

const QuickViewModal = ({ product, isVisible, onClose, mousePosition }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || "M");
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || "Default");

  const discountPercentage = product?.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product.inStock) {
      toast.error("Product is out of stock");
      return;
    }

    setIsLoading(true);
    try {
      await addToCart({
        productId: product.Id,
        quantity: 1,
        size: selectedSize,
        color: selectedColor
      });
      toast.success("Added to cart successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setIsLoading(false);
    }
  };

  if (!product) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed z-50 quick-view-modal"
            style={{
              left: Math.min(mousePosition.x + 20, window.innerWidth - 400),
              top: Math.min(mousePosition.y - 100, window.innerHeight - 500),
            }}
          >
            <div className="bg-white rounded-lg shadow-2xl w-96 max-w-[90vw] overflow-hidden">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
              >
                <ApperIcon name="X" size={16} />
              </button>

              {/* Product Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={product.images?.[0] || "/api/placeholder/300/400"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                
                {discountPercentage > 0 && (
                  <Badge variant="sale" className="absolute top-2 left-2 transform -rotate-12">
                    {discountPercentage}% OFF
                  </Badge>
                )}
              </div>

              {/* Product Details */}
              <div className="p-6">
                <h3 className="font-display font-semibold text-lg text-secondary mb-1">
                  {product.brand}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.name}
                </p>

                {/* Price */}
                <div className="flex items-center gap-2 mb-4">
                  {product.discountPrice ? (
                    <>
                      <span className="text-xl font-bold text-secondary">
                        ₹{product.discountPrice.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        ₹{product.price.toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <span className="text-xl font-bold text-secondary">
                      ₹{product.price.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Size Selection */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Size:</p>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-3 py-1 text-sm border rounded transition-colors ${
                            selectedSize === size
                              ? 'border-primary bg-primary text-white'
                              : 'border-gray-300 hover:border-primary'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Selection */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Color:</p>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-3 py-1 text-sm border rounded transition-colors ${
                            selectedColor === color
                              ? 'border-primary bg-primary text-white'
                              : 'border-gray-300 hover:border-primary'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add to Cart Button */}
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || isLoading}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />
                      Adding...
                    </>
                  ) : !product.inStock ? (
                    "Out of Stock"
                  ) : (
                    <>
                      <ApperIcon name="ShoppingCart" size={16} className="mr-2" />
                      Quick Add to Cart
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QuickViewModal;