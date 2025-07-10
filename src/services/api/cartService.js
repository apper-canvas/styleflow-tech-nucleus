// Initialize ApperClient with Project ID and Public Key
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const getCartItems = async () => {
  try {
    const tableName = 'cart_item';
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "quantity" } },
        { field: { Name: "size" } },
        { field: { Name: "color" } },
        { field: { Name: "added_at" } },
        { 
          field: { Name: "product_id" },
          referenceField: { 
            field: { Name: "Name" } 
          }
        },
        { 
          field: { Name: "product_id" },
          referenceField: { 
            field: { Name: "brand" } 
          }
        },
        { 
          field: { Name: "product_id" },
          referenceField: { 
            field: { Name: "price" } 
          }
        },
        { 
          field: { Name: "product_id" },
          referenceField: { 
            field: { Name: "discount_price" } 
          }
        },
        { 
          field: { Name: "product_id" },
          referenceField: { 
            field: { Name: "images" } 
          }
        }
      ],
      orderBy: [
        { fieldName: "added_at", sorttype: "DESC" }
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
    
    return response.data.map(item => ({
      ...item,
      productId: item.product_id?.Id || item.product_id,
      addedAt: item.added_at,
      product: item.product_id ? {
        Id: item.product_id.Id,
        name: item.product_id.Name,
        brand: item.product_id.brand,
        price: item.product_id.price,
        discountPrice: item.product_id.discount_price,
        images: item.product_id.images
      } : null
    })).filter(item => item.product);
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching cart items:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    return [];
  }
};

export const addToCart = async (cartItem) => {
  try {
    const tableName = 'cart_item';
    
    // Check if item already exists
    const existingParams = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "quantity" } },
        { field: { Name: "product_id" } },
        { field: { Name: "size" } },
        { field: { Name: "color" } }
      ],
      whereGroups: [
        {
          operator: "AND",
          subGroups: [
            {
              conditions: [
                {
                  fieldName: "product_id",
                  operator: "EqualTo",
                  values: [cartItem.productId.toString()]
                }
              ]
            },
            {
              conditions: [
                {
                  fieldName: "size",
                  operator: "EqualTo",
                  values: [cartItem.size || ""]
                }
              ]
            },
            {
              conditions: [
                {
                  fieldName: "color",
                  operator: "EqualTo",
                  values: [cartItem.color || ""]
                }
              ]
            }
          ]
        }
      ]
    };
    
    const existingResponse = await apperClient.fetchRecords(tableName, existingParams);
    
    if (existingResponse.success && existingResponse.data && existingResponse.data.length > 0) {
      // Update existing item
      const existingItem = existingResponse.data[0];
      const updateParams = {
        records: [
          {
            Id: existingItem.Id,
            quantity: existingItem.quantity + cartItem.quantity
          }
        ]
      };
      
      const updateResponse = await apperClient.updateRecord(tableName, updateParams);
      
      if (updateResponse.success && updateResponse.results) {
        const successfulUpdates = updateResponse.results.filter(result => result.success);
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }
    } else {
      // Create new item
      const params = {
        records: [
          {
            Name: `Cart Item - Product ${cartItem.productId}`,
            quantity: cartItem.quantity,
            size: cartItem.size || "",
            color: cartItem.color || "",
            product_id: cartItem.productId,
            added_at: new Date().toISOString()
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
        
        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error adding to cart:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    return null;
  }
};

export const updateCartItem = async (id, updateData) => {
  try {
    const tableName = 'cart_item';
    
    const params = {
      records: [
        {
          Id: parseInt(id),
          quantity: updateData.quantity
        }
      ]
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
      
      return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error updating cart item:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    return null;
  }
};

export const removeFromCart = async (id) => {
  try {
    const tableName = 'cart_item';
    
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
      console.error("Error removing from cart:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    return false;
  }
};

export const clearCart = async () => {
  try {
    // Get all cart items first
    const cartItems = await getCartItems();
    
    if (cartItems.length === 0) {
      return { success: true };
    }
    
    const tableName = 'cart_item';
    const itemIds = cartItems.map(item => item.Id);
    
    const params = {
      RecordIds: itemIds
    };
    
    const response = await apperClient.deleteRecord(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      return { success: false };
    }
    
    return { success: true };
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error clearing cart:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    return { success: false };
  }
};

export const getWishlistItems = async () => {
  try {
    const tableName = 'wishlist_item';
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "added_at" } },
        { 
          field: { Name: "product_id" },
          referenceField: { 
            field: { Name: "Name" } 
          }
        },
        { 
          field: { Name: "product_id" },
          referenceField: { 
            field: { Name: "brand" } 
          }
        },
        { 
          field: { Name: "product_id" },
          referenceField: { 
            field: { Name: "price" } 
          }
        },
        { 
          field: { Name: "product_id" },
          referenceField: { 
            field: { Name: "discount_price" } 
          }
        },
        { 
          field: { Name: "product_id" },
          referenceField: { 
            field: { Name: "images" } 
          }
        },
        { 
          field: { Name: "product_id" },
          referenceField: { 
            field: { Name: "sizes" } 
          }
        },
        { 
          field: { Name: "product_id" },
          referenceField: { 
            field: { Name: "colors" } 
          }
        },
        { 
          field: { Name: "product_id" },
          referenceField: { 
            field: { Name: "category" } 
          }
        },
        { 
          field: { Name: "product_id" },
          referenceField: { 
            field: { Name: "in_stock" } 
          }
        }
      ],
      orderBy: [
        { fieldName: "added_at", sorttype: "DESC" }
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
    
    return response.data.map(item => ({
      Id: item.product_id?.Id || item.product_id,
      name: item.product_id?.Name,
      brand: item.product_id?.brand,
      price: item.product_id?.price,
      discountPrice: item.product_id?.discount_price,
      images: item.product_id?.images,
      sizes: item.product_id?.sizes,
      colors: item.product_id?.colors,
      category: item.product_id?.category,
      inStock: item.product_id?.in_stock
    })).filter(item => item.Id);
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching wishlist items:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    return [];
  }
};

export const addToWishlist = async (productId) => {
  try {
    const tableName = 'wishlist_item';
    
    // Check if item already exists
    const existingParams = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "product_id" } }
      ],
      where: [
        {
          FieldName: "product_id",
          Operator: "EqualTo",
          Values: [productId.toString()],
          Include: true
        }
      ]
    };
    
    const existingResponse = await apperClient.fetchRecords(tableName, existingParams);
    
    if (existingResponse.success && existingResponse.data && existingResponse.data.length > 0) {
      throw new Error("Product already in wishlist");
    }
    
    const params = {
      records: [
        {
          Name: `Wishlist Item - Product ${productId}`,
          product_id: productId,
          added_at: new Date().toISOString()
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
      
      return successfulRecords.length > 0 ? successfulRecords[0].data : null;
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error adding to wishlist:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};

export const removeFromWishlist = async (productId) => {
  try {
    const tableName = 'wishlist_item';
    
    // Find the wishlist item for this product
    const findParams = {
      fields: [
        { field: { Name: "Name" } }
      ],
      where: [
        {
          FieldName: "product_id",
          Operator: "EqualTo",
          Values: [productId.toString()],
          Include: true
        }
      ]
    };
    
    const findResponse = await apperClient.fetchRecords(tableName, findParams);
    
    if (!findResponse.success || !findResponse.data || findResponse.data.length === 0) {
      throw new Error("Product not found in wishlist");
    }
    
    const wishlistItem = findResponse.data[0];
    
    const params = {
      RecordIds: [wishlistItem.Id]
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
      console.error("Error removing from wishlist:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    throw error;
  }
};