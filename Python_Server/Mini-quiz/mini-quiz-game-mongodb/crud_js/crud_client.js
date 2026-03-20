// Generic CRUD operations for any entity
// Assumes entity has 'id' and other fields

class CrudClient {
  constructor(apiBase, entityName) {
    this.apiBase = apiBase;
    this.entityName = entityName;
  }

  // Generic API request helper
  async apiRequest(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.apiBase}${endpoint}`, options);
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error; // Re-throw to let caller handle
    }
  }

  // Create a new item
  async create(itemData) {
    const response = await this.apiRequest(`/${this.entityName}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(itemData),
    });
    return response;
  }

  // Read all items
  async readAll() {
    const response = await this.apiRequest(`/all_${this.entityName}s`);
    return response[`${this.entityName}s`];
  }

  // Read a single item by id
  async readById(itemId) {
    const response = await this.apiRequest(`/${this.entityName}/${itemId}`);
    return response[this.entityName];
  }

  // Update an item
  async update(itemId, itemData) {
    const response = await this.apiRequest(`/${this.entityName}/${itemId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(itemData),
    });
    return response;
  }

  // Delete an item
  async delete(itemId) {
    const response = await this.apiRequest(`/${this.entityName}/${itemId}`, {
      method: "DELETE",
    });
    return response;
  }
}
