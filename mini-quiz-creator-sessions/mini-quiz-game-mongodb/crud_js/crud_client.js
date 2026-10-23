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
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || `HTTP error: ${response.status}`);
      }
      return data;
    } catch (error) {
      console.error("API Error:", error);
      if (error instanceof TypeError) {
        const apiUrl = new URL(this.apiBase, window.location.href);
        const loopbackHosts = ["localhost", "127.0.0.1", "::1", "[::1]"];
        const pageHost = window.location.hostname;

        if (
          loopbackHosts.includes(pageHost) &&
          loopbackHosts.includes(apiUrl.hostname) &&
          pageHost !== apiUrl.hostname
        ) {
          throw new Error(
            `The page is using "${pageHost}" but the API uses "${apiUrl.hostname}". Use the same hostname for both (localhost or 127.0.0.1).`,
            { cause: error },
          );
        }

        throw new Error(
          `Could not reach the API at ${apiUrl.origin}. Check that the server is running and that the page and API have matching origins or CORS permissions.`,
          { cause: error },
        );
      }
      throw error;
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
