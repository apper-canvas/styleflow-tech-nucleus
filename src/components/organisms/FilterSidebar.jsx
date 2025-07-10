import { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";

const FilterSidebar = ({ filters, onFiltersChange, onClearFilters }) => {
  const [isOpen, setIsOpen] = useState(false);

  const categories = ["Men", "Women", "Kids", "Beauty", "Home & Living"];
  const brands = ["Nike", "Adidas", "Zara", "H&M", "Uniqlo", "Levi's", "Puma"];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const colors = ["Black", "White", "Red", "Blue", "Green", "Yellow", "Pink", "Purple"];

  const handleFilterChange = (type, value) => {
    const currentValues = filters[type] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onFiltersChange({
      ...filters,
      [type]: newValues
    });
  };

  const handlePriceChange = (type, value) => {
    onFiltersChange({
      ...filters,
      priceRange: {
        ...filters.priceRange,
        [type]: Number(value)
      }
    });
  };

  const FilterSection = ({ title, items, filterType }) => (
    <div className="border-b border-gray-200 pb-4">
      <h3 className="font-semibold text-secondary mb-3">{title}</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <label key={item} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters[filterType]?.includes(item) || false}
              onChange={() => handleFilterChange(filterType, item)}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <span className="text-sm text-gray-700">{item}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-6">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-center gap-2"
        >
          <ApperIcon name="Filter" size={16} />
          Filters
        </Button>
      </div>

      {/* Filter Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`
          ${isOpen ? "block" : "hidden"} lg:block
          fixed lg:static top-0 left-0 w-full lg:w-auto h-full lg:h-auto
          bg-surface lg:bg-transparent z-50 lg:z-auto
          p-4 lg:p-0 overflow-y-auto
        `}
      >
        <div className="flex items-center justify-between mb-4 lg:hidden">
          <h2 className="text-xl font-bold">Filters</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="p-2"
          >
            <ApperIcon name="X" size={20} />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Clear Filters */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-secondary hidden lg:block">Filters</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-primary hover:bg-primary hover:text-white"
            >
              Clear All
            </Button>
          </div>

          {/* Categories */}
          <FilterSection
            title="Categories"
            items={categories}
            filterType="categories"
          />

          {/* Brands */}
          <FilterSection
            title="Brands"
            items={brands}
            filterType="brands"
          />

          {/* Price Range */}
          <div className="border-b border-gray-200 pb-4">
            <h3 className="font-semibold text-secondary mb-3">Price Range</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-700 mb-1 block">Min Price</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={filters.priceRange?.min || ""}
                  onChange={(e) => handlePriceChange("min", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-gray-700 mb-1 block">Max Price</label>
                <Input
                  type="number"
                  placeholder="10000"
                  value={filters.priceRange?.max || ""}
                  onChange={(e) => handlePriceChange("max", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Sizes */}
          <FilterSection
            title="Sizes"
            items={sizes}
            filterType="sizes"
          />

          {/* Colors */}
          <FilterSection
            title="Colors"
            items={colors}
            filterType="colors"
          />

          {/* Discount */}
          <div className="border-b border-gray-200 pb-4">
            <h3 className="font-semibold text-secondary mb-3">Discount</h3>
            <div className="space-y-2">
              {[10, 20, 30, 40, 50].map((discount) => (
                <label key={discount} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="discount"
                    checked={filters.discount === discount}
                    onChange={() => onFiltersChange({ ...filters, discount })}
                    className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">{discount}% and above</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default FilterSidebar;