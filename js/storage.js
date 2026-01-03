/**
 * storage.js - Data Persistence Abstraction Layer
 * Handles localStorage operations with abstraction for future backend migration
 * All data is namespaced under 'evidence_' prefix
 */

class Storage {
  constructor() {
    this.prefix = 'evidence_';
    this.version = '1.0';
  }

  /**
   * Save user registration data
   * @param {Object} userData - { name, email, location }
   */
  saveUser(userData) {
    const data = {
      ...userData,
      registeredAt: new Date().toISOString()
    };
    this._set('user', data);
  }

  /**
   * Get user registration data
   * @returns {Object|null} User data or null if not registered
   */
  getUser() {
    return this._get('user');
  }

  /**
   * Check if user is registered
   * @returns {boolean}
   */
  isUserRegistered() {
    return this._get('user') !== null;
  }

  /**
   * Save archetype result to history
   * @param {Object} result - { title, description, traits, dimensions, imagePath }
   */
  saveResult(result) {
    const history = this.getHistory();
    const entry = {
      ...result,
      completedAt: new Date().toISOString()
    };
    history.unshift(entry);
    
    // Keep only last 50 results
    if (history.length > 50) {
      history.pop();
    }
    
    this._set('history', history);
  }

  /**
   * Get all archetype results history
   * @returns {Array} Array of archetype results
   */
  getHistory() {
    return this._get('history') || [];
  }

  /**
   * Clear all user data
   */
  clearAllData() {
    localStorage.removeItem(this.prefix + 'user');
    localStorage.removeItem(this.prefix + 'history');
  }

  /**
   * Export all data as JSON (for backup or migration)
   * @returns {Object} All stored data
   */
  exportData() {
    return {
      version: this.version,
      exportedAt: new Date().toISOString(),
      user: this.getUser(),
      history: this.getHistory()
    };
  }

  /**
   * Import data from JSON (for restore or migration)
   * @param {Object} data - Data object from exportData()
   */
  importData(data) {
    if (data.user) this.saveUser(data.user);
    if (data.history) {
      this._set('history', data.history);
    }
  }

  /**
   * Private: Set value in localStorage
   * @param {string} key - Data key
   * @param {*} value - Data value (will be JSON stringified)
   */
  _set(key, value) {
    try {
      localStorage.setItem(
        this.prefix + key,
        JSON.stringify(value)
      );
    } catch (error) {
      console.error('Storage error:', error);
    }
  }

  /**
   * Private: Get value from localStorage
   * @param {string} key - Data key
   * @returns {*} Parsed value or null
   */
  _get(key) {
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Storage error:', error);
      return null;
    }
  }
}

// Create global instance
const storage = new Storage();
