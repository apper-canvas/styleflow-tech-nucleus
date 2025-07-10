import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import promotionalBannerService from "@/services/api/promotionalBannerService";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [banners, setBanners] = useState([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const categories = [
    { name: "Men", path: "/category/men" },
    { name: "Women", path: "/category/women" },
    { name: "Kids", path: "/category/kids" },
    { name: "Beauty", path: "/category/beauty" },
    { name: "Home & Living", path: "/category/home" }
  ];

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const bannersData = await promotionalBannerService.getAll();
        setBanners(bannersData);
      } catch (error) {
        console.error('Failed to fetch promotional banners:', error);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length > 1 && !isHovered) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [banners.length, isHovered]);

  const handleBannerClick = (index) => {
    setCurrentBannerIndex(index);
  };

  return (
    <header className="bg-surface shadow-lg sticky top-0 z-50">
      {/* Promotional Banner Carousel */}
      {banners.length > 0 && (
        <div 
          className="relative overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div
            key={currentBannerIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className={`${banners[currentBannerIndex]?.backgroundColor || 'bg-primary'} text-white py-3 px-4`}
          >
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ApperIcon name="Megaphone" size={20} />
                <div>
                  <span className="font-semibold text-sm">
                    {banners[currentBannerIndex]?.title}
                  </span>
                  <span className="ml-2 text-sm opacity-90">
                    {banners[currentBannerIndex]?.description}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {banners[currentBannerIndex]?.ctaText && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white text-primary hover:bg-gray-100 px-4 py-1 text-sm font-medium"
                    onClick={() => navigate(banners[currentBannerIndex]?.ctaLink || '/')}
                  >
                    {banners[currentBannerIndex]?.ctaText}
                  </Button>
                )}
                {banners.length > 1 && (
                  <div className="hidden md:flex items-center gap-2">
                    {banners.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => handleBannerClick(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          index === currentBannerIndex
                            ? 'bg-white'
                            : 'bg-white/50 hover:bg-white/75'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
              <ApperIcon name="Sparkles" size={24} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-secondary font-display">
              Style<span className="text-primary">Flow</span>
            </span>
          </Link>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.path}
                className="text-secondary font-medium hover:text-primary transition-colors duration-200"
              >
                {category.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:block flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/wishlist")}
              className="relative p-2"
            >
              <ApperIcon name="Heart" size={20} />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                0
              </span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/cart")}
              className="relative p-2"
            >
              <ApperIcon name="ShoppingBag" size={20} />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                0
              </span>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
            </Button>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className="md:hidden pb-4">
          <SearchBar />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-surface border-t border-gray-200"
        >
          <nav className="container mx-auto px-4 py-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.path}
                className="block py-2 text-secondary font-medium hover:text-primary transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </motion.div>
      )}
    </header>
  );
};

export default Header;