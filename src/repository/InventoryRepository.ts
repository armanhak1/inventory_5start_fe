import type { Item } from '../types';
import { config } from '../config';

const STORAGE_KEY = 'rehabInv:v1';
const API_URL = config.API_URL;
const USE_API = config.USE_API;

export interface InventoryRepository {
  getAll(): Promise<Item[]>;
  save(items: Item[]): Promise<void>;
  clear(): Promise<void>;
  addItem(item: Omit<Item, 'id'>): Promise<Item>;
  updateItem(id: string, updates: Partial<Item>): Promise<Item>;
  deleteItem(id: string): Promise<void>;
}

// API Implementation
class ApiInventoryRepository implements InventoryRepository {
  private async fetchApi(endpoint: string, options?: RequestInit) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getAll(): Promise<Item[]> {
    const response = await this.fetchApi('/inventory');
    return response.success ? response.data : [];
  }

  async save(items: Item[]): Promise<void> {
    await this.fetchApi('/inventory/bulk/update', {
      method: 'PUT',
      body: JSON.stringify({ items }),
    });
  }

  async clear(): Promise<void> {
    // Delete all items one by one (or implement a bulk delete endpoint)
    const items = await this.getAll();
    await Promise.all(items.map(item => this.deleteItem(item.id)));
  }

  async addItem(item: Omit<Item, 'id'>): Promise<Item> {
    const response = await this.fetchApi('/inventory', {
      method: 'POST',
      body: JSON.stringify(item),
    });
    return response.data;
  }

  async updateItem(id: string, updates: Partial<Item>): Promise<Item> {
    const response = await this.fetchApi(`/inventory/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return response.data;
  }

  async deleteItem(id: string): Promise<void> {
    await this.fetchApi(`/inventory/${id}`, {
      method: 'DELETE',
    });
  }
}

// LocalStorage Implementation
class LocalStorageInventoryRepository implements InventoryRepository {
  async getAll(): Promise<Item[]> {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  }

  async save(items: Item[]): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      throw new Error('Failed to save inventory');
    }
  }

  async clear(): Promise<void> {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  async addItem(item: Omit<Item, 'id'>): Promise<Item> {
    const items = await this.getAll();
    const newItem: Item = {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    items.push(newItem);
    await this.save(items);
    return newItem;
  }

  async updateItem(id: string, updates: Partial<Item>): Promise<Item> {
    const items = await this.getAll();
    const index = items.findIndex(i => i.id === id);
    if (index === -1) {
      throw new Error('Item not found');
    }
    items[index] = { ...items[index], ...updates };
    await this.save(items);
    return items[index];
  }

  async deleteItem(id: string): Promise<void> {
    const items = await this.getAll();
    const filtered = items.filter(i => i.id !== id);
    await this.save(filtered);
  }
}

// Export singleton instance based on configuration
export const inventoryRepository: InventoryRepository = USE_API
  ? new ApiInventoryRepository()
  : new LocalStorageInventoryRepository();

// Export flag for UI to show connection status
export const isUsingApi = USE_API;
export const apiUrl = API_URL;
