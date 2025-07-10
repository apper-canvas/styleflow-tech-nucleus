import reviewsData from "@/services/mockData/reviews.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getReviews = async (productId) => {
  await delay(300);
  
  const reviews = reviewsData.filter(review => review.productId === productId);
  return [...reviews];
};

export const addReview = async (reviewData) => {
  await delay(300);
  
  const newId = reviewsData.length > 0 ? Math.max(...reviewsData.map(r => r.Id)) + 1 : 1;
  const newReview = {
    Id: newId,
    ...reviewData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  reviewsData.push(newReview);
  return { ...newReview };
};

export const updateReview = async (id, reviewData) => {
  await delay(300);
  
  const index = reviewsData.findIndex(r => r.Id === id);
  if (index === -1) {
    throw new Error("Review not found");
  }
  
  reviewsData[index] = { 
    ...reviewsData[index], 
    ...reviewData,
    updatedAt: new Date().toISOString()
  };
  return { ...reviewsData[index] };
};

export const deleteReview = async (id) => {
  await delay(300);
  
  const index = reviewsData.findIndex(r => r.Id === id);
  if (index === -1) {
    throw new Error("Review not found");
  }
  
  reviewsData.splice(index, 1);
  return { success: true };
};

export const getReviewsSummary = async (productId) => {
  await delay(200);
  
  const reviews = reviewsData.filter(review => review.productId === productId);
  
  if (reviews.length === 0) {
    return {
      totalReviews: 0,
      averageRating: 0,
      ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };
  }
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;
  
  const ratingBreakdown = reviews.reduce((breakdown, review) => {
    breakdown[review.rating] = (breakdown[review.rating] || 0) + 1;
    return breakdown;
  }, { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
  
  return {
    totalReviews: reviews.length,
    averageRating: parseFloat(averageRating.toFixed(1)),
    ratingBreakdown
  };
};