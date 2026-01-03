/**
 * i18n.js - Internationalization Module
 * Handles language switching and text retrieval
 * Supports: Portuguese (pt) and English (en)
 * Persists language preference to localStorage
 */

class I18n {
  constructor() {
    this.currentLanguage = localStorage.getItem('language') || 'pt';
    this.translations = {};
    this.isLoading = false;
  }

  /**
   * Load translations from JSON file
   * @param {string} language - Language code (pt or en)
   */
  async loadLanguage(language) {
    if (this.isLoading) return;
    
    this.isLoading = true;
    try {
      const response = await fetch(`./locales/${language}.json`);
      if (!response.ok) throw new Error(`Failed to load ${language}.json`);
      
      this.translations = await response.json();
      this.currentLanguage = language;
      localStorage.setItem('language', language);
      
      // Dispatch custom event for UI updates
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language } }));
    } catch (error) {
      console.error('Error loading language:', error);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Get translated text using dot notation path
   * @param {string} path - Path to text (e.g., 'buttons.startJourney')
   * @param {*} fallback - Fallback text if path not found
   * @returns {string} Translated text
   */
  t(path, fallback = path) {
    const keys = path.split('.');
    let value = this.translations;

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return fallback;
      }
    }

    return typeof value === 'string' ? value : fallback;
  }

  /**
   * Get array of scenarios
   * @returns {Array} Scenarios array
   */
  getScenarios() {
    return this.translations.scenarios || [];
  }

  /**
   * Get array of archetypes
   * @returns {Array} Archetypes array
   */
  getArchetypes() {
    return this.translations.archetypes || [];
  }

  /**
   * Get current language
   * @returns {string} Current language code
   */
  getLanguage() {
    return this.currentLanguage;
  }

  /**
   * Toggle between Portuguese and English
   */
  toggleLanguage() {
    const newLanguage = this.currentLanguage === 'pt' ? 'en' : 'pt';
    this.loadLanguage(newLanguage);
  }
}

// Create global instance
const i18n = new I18n();
