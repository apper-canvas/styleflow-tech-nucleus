// Initialize ApperClient with Project ID and Public Key
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const promotionalBannerService = {
  async getAll() {
    try {
      const tableName = 'promotional_banner';
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "cta_text" } },
          { field: { Name: "cta_link" } },
          { field: { Name: "background_color" } },
          { field: { Name: "is_active" } },
          { field: { Name: "priority" } },
          { field: { Name: "start_date" } },
          { field: { Name: "end_date" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } }
        ],
        where: [
          {
            FieldName: "is_active",
            Operator: "EqualTo",
            Values: [true],
            Include: true
          }
        ],
        orderBy: [
          { fieldName: "priority", sorttype: "ASC" }
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
      
      return response.data.map(banner => ({
        ...banner,
        isActive: banner.is_active,
        ctaText: banner.cta_text,
        ctaLink: banner.cta_link,
        backgroundColor: banner.background_color,
        startDate: banner.start_date,
        endDate: banner.end_date,
        createdAt: banner.created_at,
        updatedAt: banner.updated_at
      }));
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching promotional banners:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const tableName = 'promotional_banner';
      const parsedId = parseInt(id);
      
      if (isNaN(parsedId)) {
        throw new Error('Invalid ID format');
      }
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "description" } },
          { field: { Name: "cta_text" } },
          { field: { Name: "cta_link" } },
          { field: { Name: "background_color" } },
          { field: { Name: "is_active" } },
          { field: { Name: "priority" } },
          { field: { Name: "start_date" } },
          { field: { Name: "end_date" } },
          { field: { Name: "created_at" } },
          { field: { Name: "updated_at" } }
        ]
      };
      
      const response = await apperClient.getRecordById(tableName, parsedId, params);
      
      if (!response || !response.data) {
        throw new Error('Promotional banner not found');
      }
      
      const banner = response.data;
      return {
        ...banner,
        isActive: banner.is_active,
        ctaText: banner.cta_text,
        ctaLink: banner.cta_link,
        backgroundColor: banner.background_color,
        startDate: banner.start_date,
        endDate: banner.end_date,
        createdAt: banner.created_at,
        updatedAt: banner.updated_at
      };
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching promotional banner with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async create(bannerData) {
    try {
      const tableName = 'promotional_banner';
      
      const params = {
        records: [
          {
            Name: bannerData.title || `Banner ${Date.now()}`,
            title: bannerData.title,
            description: bannerData.description,
            cta_text: bannerData.ctaText,
            cta_link: bannerData.ctaLink,
            background_color: bannerData.backgroundColor,
            is_active: bannerData.isActive !== undefined ? bannerData.isActive : true,
            priority: bannerData.priority || 1,
            start_date: bannerData.startDate || new Date().toISOString(),
            end_date: bannerData.endDate,
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
            isActive: record.is_active,
            ctaText: record.cta_text,
            ctaLink: record.cta_link,
            backgroundColor: record.background_color,
            startDate: record.start_date,
            endDate: record.end_date,
            createdAt: record.created_at,
            updatedAt: record.updated_at
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating promotional banner:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async update(id, bannerData) {
    try {
      const tableName = 'promotional_banner';
      const parsedId = parseInt(id);
      
      if (isNaN(parsedId)) {
        throw new Error('Invalid ID format');
      }
      
      const updateRecord = {
        Id: parsedId,
        title: bannerData.title,
        description: bannerData.description,
        cta_text: bannerData.ctaText,
        cta_link: bannerData.ctaLink,
        background_color: bannerData.backgroundColor,
        is_active: bannerData.isActive,
        priority: bannerData.priority,
        start_date: bannerData.startDate,
        end_date: bannerData.endDate,
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
            isActive: record.is_active,
            ctaText: record.cta_text,
            ctaLink: record.cta_link,
            backgroundColor: record.background_color,
            startDate: record.start_date,
            endDate: record.end_date,
            createdAt: record.created_at,
            updatedAt: record.updated_at
          };
        }
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating promotional banner:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async delete(id) {
    try {
      const tableName = 'promotional_banner';
      const parsedId = parseInt(id);
      
      if (isNaN(parsedId)) {
        throw new Error('Invalid ID format');
      }
      
      const params = {
        RecordIds: [parsedId]
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
        console.error("Error deleting promotional banner:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
};

export default promotionalBannerService;