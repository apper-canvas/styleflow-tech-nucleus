// Initialize ApperClient with Project ID and Public Key
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const getProducts = async (filters = {}, sortBy = "featured", limit = null) => {
  try {
    const tableName = 'product';
    
    // Build where conditions based on filters
    let whereConditions = [];
    let whereGroups = [];
    
    // Search filter
    if (filters.search) {
      whereGroups.push({
        operator: "OR",
        subGroups: [
          {
            conditions: [
              {
                fieldName: "Name",
                operator: "Contains",
                values: [filters.search],
                include: true
              }
            ],
            operator: "OR"
          },
          {
            conditions: [
              {
                fieldName: "brand",
                operator: "Contains", 
                values: [filters.search],
                include: true
              }
            ],
            operator: "OR"
          },
          {
            conditions: [
              {
                fieldName: "category",
                operator: "Contains",
                values: [filters.search],
                include: true
              }
            ],
            operator: "OR"
          }
        ]
      });
    }
    
    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      whereConditions.push({
        FieldName: "category",
        Operator: "ExactMatch",
        Values: filters.categories,
        Include: true
      });
    }
    
    // Brand filter
    if (filters.brands && filters.brands.length > 0) {
      whereConditions.push({
        FieldName: "brand",
        Operator: "ExactMatch",
        Values: filters.brands,
        Include: true
      });
    }
    
    // Size filter
    if (filters.sizes && filters.sizes.length > 0) {
      whereConditions.push({
        FieldName: "sizes",
        Operator: "Contains",
        Values: filters.sizes,
        Include: true
      });
    }
    
    // Color filter
    if (filters.colors && filters.colors.length > 0) {
      whereConditions.push({
        FieldName: "colors",
        Operator: "Contains",
        Values: filters.colors,
        Include: true
      });
    }
    
    // Price range filter
    if (filters.priceRange) {
      if (filters.priceRange.min > 0) {
        whereConditions.push({
          FieldName: "price",
          Operator: "GreaterThanOrEqualTo",
          Values: [filters.priceRange.min.toString()],
          Include: true
        });
      }
      if (filters.priceRange.max < 10000) {
        whereConditions.push({
          FieldName: "price", 
          Operator: "LessThanOrEqualTo",
          Values: [filters.priceRange.max.toString()],
          Include: true
        });
      }
    }
    
    // Discount filter
    if (filters.discount && filters.discount > 0) {
      whereConditions.push({
        FieldName: "discount_price",
        Operator: "HasValue",
        Values: [],
        Include: true
      });
    }
    
    // Build order by based on sortBy
    let orderBy = [];
    switch (sortBy) {
      case "price-low":
        orderBy.push({ fieldName: "price", sorttype: "ASC" });
        break;
      case "price-high":
        orderBy.push({ fieldName: "price", sorttype: "DESC" });
        break;
      case "newest":
        orderBy.push({ fieldName: "Id", sorttype: "DESC" });
        break;
      case "popularity":
        orderBy.push({ fieldName: "Id", sorttype: "ASC" });
        break;
      case "discount":
        orderBy.push({ fieldName: "discount_price", sorttype: "DESC" });
        break;
      default:
        orderBy.push({ fieldName: "Id", sorttype: "ASC" });
        break;
    }
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "brand" } },
        { field: { Name: "price" } },
        { field: { Name: "discount_price" } },
        { field: { Name: "images" } },
        { field: { Name: "sizes" } },
        { field: { Name: "colors" } },
        { field: { Name: "category" } },
        { field: { Name: "subcategory" } },
        { field: { Name: "in_stock" } },
        { field: { Name: "description" } }
      ],
      where: whereConditions,
      whereGroups: whereGroups,
      orderBy: orderBy,
      pagingInfo: {
        limit: limit || 100,
        offset: 0
      }
    };
    
    const response = await apperClient.fetchRecords(tableName, params);
    
    if (!response.success) {
      console.error(response.message);
      return [];
    }
    
    // Handle empty or non-existent data
    if (!response || !response.data || response.data.length === 0) {
      return [];
    }
    
    return response.data.map(product => ({
      ...product,
      name: product.Name,
      inStock: product.in_stock,
      discountPrice: product.discount_price
    }));
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching products:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    return [];
  }
};

export const getProductById = async (id) => {
  try {
    const tableName = 'product';
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "brand" } },
        { field: { Name: "price" } },
        { field: { Name: "discount_price" } },
        { field: { Name: "images" } },
        { field: { Name: "sizes" } },
        { field: { Name: "colors" } },
        { field: { Name: "category" } },
        { field: { Name: "subcategory" } },
        { field: { Name: "in_stock" } },
        { field: { Name: "description" } }
      ]
    };
    
    const response = await apperClient.getRecordById(tableName, id, params);
    
    if (!response || !response.data) {
      return null;
    }
    
    return {
      ...response.data,
      name: response.data.Name,
      inStock: response.data.in_stock,
      discountPrice: response.data.discount_price
    };
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error(`Error fetching product with ID ${id}:`, error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    return null;
  }
};

export const createProduct = async (productData) => {
  try {
    const tableName = 'product';
    
    const params = {
      records: [
        {
          Name: productData.name,
          brand: productData.brand,
          price: productData.price,
          discount_price: productData.discountPrice,
          images: productData.images,
          sizes: productData.sizes,
          colors: productData.colors,
          category: productData.category,
          subcategory: productData.subcategory,
          in_stock: productData.inStock !== undefined ? productData.inStock : true,
          description: productData.description
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
      console.error("Error creating product:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    return null;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const tableName = 'product';
    
    const updateRecord = {
      Id: parseInt(id),
      Name: productData.name,
      brand: productData.brand,
      price: productData.price,
      discount_price: productData.discountPrice,
      images: productData.images,
      sizes: productData.sizes,
      colors: productData.colors,
      category: productData.category,
      subcategory: productData.subcategory,
      in_stock: productData.inStock,
      description: productData.description
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
      
      return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
    }
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error updating product:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    return null;
  }
};

export const deleteProduct = async (id) => {
  try {
    const tableName = 'product';
    
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
      console.error("Error deleting product:", error?.response?.data?.message);
    } else {
      console.error(error.message);
    }
    return false;
  }
};