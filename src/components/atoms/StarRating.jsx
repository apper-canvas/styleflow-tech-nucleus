import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StarRating = ({ 
  rating = 0, 
  maxRating = 5, 
  size = 16, 
  readOnly = false, 
  onRatingChange = null,
  className = ""
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const handleStarClick = (starValue) => {
    if (!readOnly && onRatingChange) {
      onRatingChange(starValue);
    }
  };

  const handleStarHover = (starValue) => {
    if (!readOnly) {
      setHoverRating(starValue);
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    if (!readOnly) {
      setHoverRating(0);
      setIsHovering(false);
    }
  };

  const getStarColor = (starIndex) => {
    const currentRating = isHovering ? hoverRating : rating;
    return starIndex <= currentRating ? "text-yellow-400" : "text-gray-300";
  };

  const getStarFill = (starIndex) => {
    const currentRating = isHovering ? hoverRating : rating;
    return starIndex <= currentRating ? "Star" : "Star";
  };

  return (
    <div 
      className={cn(
        "flex items-center gap-1", 
        !readOnly && "cursor-pointer",
        className
      )}
      onMouseLeave={handleMouseLeave}
    >
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        return (
          <button
            key={index}
            type="button"
            disabled={readOnly}
            onClick={() => handleStarClick(starValue)}
            onMouseEnter={() => handleStarHover(starValue)}
            className={cn(
              "focus:outline-none transition-colors duration-150",
              !readOnly && "hover:scale-110 transform transition-transform duration-150",
              readOnly && "cursor-default"
            )}
          >
            <ApperIcon
              name={getStarFill(starValue)}
              size={size}
              className={cn(
                getStarColor(starValue),
                starValue <= (isHovering ? hoverRating : rating) && "fill-current"
              )}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;