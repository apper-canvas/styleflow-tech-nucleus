import promotionalBanners from '@/services/mockData/promotionalBanners.json';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Track last used ID for sequential generation
let lastId = Math.max(...promotionalBanners.map(banner => banner.Id), 0);

const promotionalBannerService = {
  async getAll() {
    await delay(500);
    return [...promotionalBanners];
  },

  async getById(id) {
    await delay(500);
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      throw new Error('Invalid ID format');
    }
    
    const banner = promotionalBanners.find(b => b.Id === parsedId);
    if (!banner) {
      throw new Error('Promotional banner not found');
    }
    
    return { ...banner };
  },

  async create(bannerData) {
    await delay(500);
    const newBanner = {
      Id: ++lastId,
      ...bannerData,
      isActive: bannerData.isActive !== undefined ? bannerData.isActive : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    promotionalBanners.push(newBanner);
    return { ...newBanner };
  },

  async update(id, bannerData) {
    await delay(500);
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      throw new Error('Invalid ID format');
    }
    
    const index = promotionalBanners.findIndex(b => b.Id === parsedId);
    if (index === -1) {
      throw new Error('Promotional banner not found');
    }
    
    const updatedBanner = {
      ...promotionalBanners[index],
      ...bannerData,
      Id: parsedId, // Ensure ID cannot be changed
      updatedAt: new Date().toISOString()
    };
    
    promotionalBanners[index] = updatedBanner;
    return { ...updatedBanner };
  },

  async delete(id) {
    await delay(500);
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      throw new Error('Invalid ID format');
    }
    
    const index = promotionalBanners.findIndex(b => b.Id === parsedId);
    if (index === -1) {
      throw new Error('Promotional banner not found');
    }
    
    const deletedBanner = promotionalBanners.splice(index, 1)[0];
    return { ...deletedBanner };
  }
};

export default promotionalBannerService;