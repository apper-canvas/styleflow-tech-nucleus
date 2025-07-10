import productsData from "@/services/mockData/products.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getProducts = async (filters = {}, sortBy = "featured", limit = null) => {
  await delay(300);
  
  let filteredProducts = [...productsData];
  
  // Apply filters
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredProducts = filteredProducts.filter(product => 
      product.name.toLowerCase().includes(searchTerm) ||
      product.brand.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );
  }
  
  if (filters.categories && filters.categories.length > 0) {
    filteredProducts = filteredProducts.filter(product => 
      filters.categories.includes(product.category)
    );
  }
  
  if (filters.brands && filters.brands.length > 0) {
    filteredProducts = filteredProducts.filter(product => 
      filters.brands.includes(product.brand)
    );
  }
  
  if (filters.sizes && filters.sizes.length > 0) {
    filteredProducts = filteredProducts.filter(product => 
      product.sizes && product.sizes.some(size => filters.sizes.includes(size))
    );
  }
  
  if (filters.colors && filters.colors.length > 0) {
    filteredProducts = filteredProducts.filter(product => 
      product.colors && product.colors.some(color => filters.colors.includes(color))
    );
  }
  
  if (filters.priceRange) {
    filteredProducts = filteredProducts.filter(product => {
      const price = product.discountPrice || product.price;
      return price >= (filters.priceRange.min || 0) && price <= (filters.priceRange.max || 10000);
    });
  }
  
  if (filters.discount && filters.discount > 0) {
    filteredProducts = filteredProducts.filter(product => {
      if (product.discountPrice) {
        const discountPercentage = Math.round(((product.price - product.discountPrice) / product.price) * 100);
        return discountPercentage >= filters.discount;
      }
      return false;
    });
  }
  
  // Apply sorting
  switch (sortBy) {
    case "price-low":
      filteredProducts.sort((a, b) => {
        const priceA = a.discountPrice || a.price;
        const priceB = b.discountPrice || b.price;
        return priceA - priceB;
      });
      break;
    case "price-high":
      filteredProducts.sort((a, b) => {
        const priceA = a.discountPrice || a.price;
        const priceB = b.discountPrice || b.price;
        return priceB - priceA;
      });
      break;
    case "newest":
      filteredProducts.sort((a, b) => b.Id - a.Id);
      break;
    case "popularity":
      filteredProducts.sort((a, b) => Math.random() - 0.5);
      break;
    case "discount":
      filteredProducts.sort((a, b) => {
        const discountA = a.discountPrice ? ((a.price - a.discountPrice) / a.price) * 100 : 0;
        const discountB = b.discountPrice ? ((b.price - b.discountPrice) / b.price) * 100 : 0;
        return discountB - discountA;
      });
      break;
    default:
      // Featured - keep original order
      break;
  }
  
  if (limit) {
    filteredProducts = filteredProducts.slice(0, limit);
  }
  
  return filteredProducts;
};

export const getProductById = async (id) => {
  await delay(200);
  
  const product = productsData.find(p => p.Id === id);
  if (!product) {
    throw new Error("Product not found");
  }
  
  return { ...product };
};

export const createProduct = async (productData) => {
  await delay(300);
  
  const newId = Math.max(...productsData.map(p => p.Id)) + 1;
  const newProduct = {
    Id: newId,
    ...productData,
    inStock: true
  };
  
  productsData.push(newProduct);
  return { ...newProduct };
};

export const updateProduct = async (id, productData) => {
  await delay(300);
  
  const index = productsData.findIndex(p => p.Id === id);
  if (index === -1) {
    throw new Error("Product not found");
  }
  
  productsData[index] = { ...productsData[index], ...productData };
  return { ...productsData[index] };
};

export const deleteProduct = async (id) => {
  await delay(300);
  
  const index = productsData.findIndex(p => p.Id === id);
  if (index === -1) {
    throw new Error("Product not found");
  }
  
  productsData.splice(index, 1);
  return { success: true };
};