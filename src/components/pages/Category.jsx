import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Select from "@/components/atoms/Select";
import FilterSidebar from "@/components/organisms/FilterSidebar";
import ProductGrid from "@/components/organisms/ProductGrid";
import ApperIcon from "@/components/ApperIcon";

const Category = () => {
  const { categoryName } = useParams();
  const [filters, setFilters] = useState({
    categories: [categoryName],
    brands: [],
    sizes: [],
    colors: [],
    priceRange: { min: 0, max: 10000 },
    discount: 0
  });
  const [sortBy, setSortBy] = useState("featured");

  const categoryTitles = {
    men: "Men's Fashion",
    women: "Women's Fashion",
    kids: "Kids Collection",
    beauty: "Beauty & Personal Care",
    home: "Home & Living"
  };

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "newest", label: "Newest First" },
    { value: "popularity", label: "Most Popular" },
    { value: "discount", label: "Highest Discount" }
  ];

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      categories: [categoryName],
      brands: [],
      sizes: [],
      colors: [],
      priceRange: { min: 0, max: 10000 },
      discount: 0
    });
  };

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      categories: [categoryName]
    }));
  }, [categoryName]);

  const activeFiltersCount = Object.values(filters).reduce((count, value) => {
    if (Array.isArray(value)) {
      return count + value.length;
    }
    if (typeof value === "object" && value !== null) {
      return count + (value.min > 0 || value.max < 10000 ? 1 : 0);
    }
    return count + (value > 0 ? 1 : 0);
  }, 0) - 1; // Subtract 1 for the default category filter

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-secondary mb-2">
          {categoryTitles[categoryName] || "Products"}
        </h1>
        <p className="text-gray-600">
          Discover our curated collection of {categoryTitles[categoryName]?.toLowerCase()}
        </p>
      </motion.div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {activeFiltersCount > 0 && (
              <span className="font-medium">
                {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""} applied
              </span>
            )}
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ApperIcon name="ArrowUpDown" size={16} className="text-gray-600" />
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="min-w-[180px]"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex gap-8">
        {/* Filters */}
        <div className="w-64 flex-shrink-0">
          <FilterSidebar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Products */}
        <div className="flex-1">
          <ProductGrid
            filters={filters}
            sortBy={sortBy}
          />
        </div>
      </div>
    </div>
  );
};

export default Category;