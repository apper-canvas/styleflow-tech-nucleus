// Initialize ApperClient with Project ID and Public Key
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const getReviews = async (productId) => {
  try {
    const tableName = 'review';
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "user_name" } },
        { field: { Name: "rating" } },
        { field: { Name: "comment" } },
        { field: { Name: "created_at" } },
        { field: { Name: "updated_at" } },
        { field: { Name: "product_id" } }
      ],
      where: [
        {
          FieldName: "product_id",
          Operator: "EqualTo",
          Values: [productId.toString()],
          Include: true
        }
      ],
      orderBy: [
        { fieldName: "created_at", sorttype: "DESC" }
      ]
    };
    
    const response = await apperClient.fetchRecords(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      return [];
    }
    
    if (!response || !response.data || response.data.length === 0) {
      return [];
    }
    
    return response.data.map(review => ({
      ...review,
      userName: review.user_name,
      productId: review.product_id,
      createdAt: review.created_at,
      updatedAt: review.updated_at
    }));
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching reviews:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    return [];
  }
};

export const addReview = async (reviewData) => {
  try {
    const tableName = 'review';
    
    const params = {
      records: [
        {
          Name: `Review by ${reviewData.user_name}`,
          user_name: reviewData.user_name,
          rating: reviewData.rating,
          comment: reviewData.comment,
          product_id: reviewData.product_id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
    };
    
    const response = await apperClient.createRecord(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      return null;
    }
    
    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
      }
      
      if (successfulRecords.length > 0) {
        const record = successfulRecords[0].data;
        return {
          ...record,
          userName: record.user_name,
          productId: record.product_id,
          createdAt: record.created_at,
          updatedAt: record.updated_at
        };
      }
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error creating review:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    return null;
  }
};

export const updateReview = async (id, reviewData) => {
  try {
    const tableName = 'review';
    
    const updateRecord = {
      Id: parseInt(id),
      user_name: reviewData.user_name,
      rating: reviewData.rating,
      comment: reviewData.comment,
      product_id: reviewData.product_id,
      updated_at: new Date().toISOString()
    };
    
    const params = {
      records: [updateRecord]
    };
    
    const response = await apperClient.updateRecord(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      return null;
    }
    
    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
      }
      
      if (successfulUpdates.length > 0) {
        const record = successfulUpdates[0].data;
        return {
          ...record,
          userName: record.user_name,
          productId: record.product_id,
          createdAt: record.created_at,
          updatedAt: record.updated_at
        };
      }
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error updating review:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    return null;
  }
};

export const deleteReview = async (id) => {
  try {
    const tableName = 'review';
    
    const params = {
      RecordIds: [parseInt(id)]
    };
    
    const response = await apperClient.deleteRecord(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      return false;
    }
    
    if (response.results) {
      const successfulDeletions = response.results.filter(result => result.success);
      const failedDeletions = response.results.filter(result => !result.success);
      
      if (failedDeletions.length > 0) {
        console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
      }
      
      return successfulDeletions.length > 0;
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting review:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    return false;
  }
};

export const getReviewsSummary = async (productId) => {
  try {
    const reviews = await getReviews(productId);
    
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
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error getting review summary:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    return {
      totalReviews: 0,
      averageRating: 0,
      ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };
  }
};