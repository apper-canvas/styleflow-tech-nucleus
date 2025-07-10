import cartData from "@/services/mockData/cart.json";
import wishlistData from "@/services/mockData/wishlist.json";
import productsData from "@/services/mockData/products.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const getCartItems = async () => {
  await delay(300);
  
  return cartData.map(item => {
    const product = productsData.find(p => p.Id === item.productId);
    return {
      ...item,
      product: product ? { ...product } : null
    };
  }).filter(item => item.product);
};

export const addToCart = async (cartItem) => {
  await delay(300);
  
  const existingItemIndex = cartData.findIndex(
    item => item.productId === cartItem.productId && 
           item.size === cartItem.size && 
           item.color === cartItem.color
  );
  
  if (existingItemIndex !== -1) {
    cartData[existingItemIndex].quantity += cartItem.quantity;
    return { ...cartData[existingItemIndex] };
  } else {
    const newId = Math.max(...cartData.map(item => item.Id), 0) + 1;
    const newItem = {
      Id: newId,
      ...cartItem,
      addedAt: new Date().toISOString()
    };
    cartData.push(newItem);
    return { ...newItem };
  }
};

export const updateCartItem = async (id, updateData) => {
  await delay(300);
  
  const index = cartData.findIndex(item => item.Id === id);
  if (index === -1) {
    throw new Error("Cart item not found");
  }
  
  cartData[index] = { ...cartData[index], ...updateData };
  return { ...cartData[index] };
};

export const removeFromCart = async (id) => {
  await delay(300);
  
  const index = cartData.findIndex(item => item.Id === id);
  if (index === -1) {
    throw new Error("Cart item not found");
  }
  
  cartData.splice(index, 1);
  return { success: true };
};

export const clearCart = async () => {
  await delay(300);
  
  cartData.splice(0, cartData.length);
  return { success: true };
};

export const getWishlistItems = async () => {
  await delay(300);
  
  return wishlistData.map(item => {
    const product = productsData.find(p => p.Id === item.productId);
    return product ? { ...product } : null;
  }).filter(Boolean);
};

export const addToWishlist = async (productId) => {
  await delay(300);
  
  const existingItem = wishlistData.find(item => item.productId === productId);
  if (existingItem) {
    throw new Error("Product already in wishlist");
  }
  
  const newId = Math.max(...wishlistData.map(item => item.Id), 0) + 1;
  const newItem = {
    Id: newId,
    productId,
    addedAt: new Date().toISOString()
  };
  
  wishlistData.push(newItem);
  return { ...newItem };
};

export const removeFromWishlist = async (productId) => {
  await delay(300);
  
  const index = wishlistData.findIndex(item => item.productId === productId);
  if (index === -1) {
    throw new Error("Product not found in wishlist");
  }
  
  wishlistData.splice(index, 1);
  return { success: true };
};