// Security utilities for MAIS platform - Enterprise-grade protection
import { logError } from './logger';

/**
 * Security Configuration Manager
 * Implements BYOK (Bring Your Own Key) pattern for enterprise security
 */
class SecurityManager {
  private static instance: SecurityManager;
  private encryptionKey: string | null = null;
  
  static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager();
    }
    return SecurityManager.instance;
  }

  /**
   * Initialize security with BYOK pattern
   * @param customKey Optional custom encryption key
   */
  init(customKey?: string): void {
    this.encryptionKey = customKey || this.generateSecureKey();
  }

  /**
   * Generate a secure encryption key
   */
  private generateSecureKey(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Encrypt sensitive data using AES-256-GCM equivalent
   * @param data Data to encrypt
   * @returns Encrypted data with IV
   */
  async encrypt(data: string): Promise<string> {
    if (!this.encryptionKey) {
      throw new Error('Security manager not initialized');
    }

    try {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      
      // Generate key from string
      const keyBuffer = await crypto.subtle.importKey(
        'raw',
        encoder.encode(this.encryptionKey.slice(0, 32)),
        { name: 'AES-GCM' },
        false,
        ['encrypt']
      );

      // Generate IV
      const iv = crypto.getRandomValues(new Uint8Array(12));
      
      // Encrypt
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        keyBuffer,
        dataBuffer
      );

      // Combine IV + encrypted data
      const combined = new Uint8Array(iv.length + encrypted.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encrypted), iv.length);

      return btoa(String.fromCharCode(...combined));
    } catch (error) {
      logError('Encryption failed:', error);
      throw new Error('Encryption failed');
    }
  }

  /**
   * Decrypt data
   * @param encryptedData Encrypted data with IV
   * @returns Decrypted string
   */
  async decrypt(encryptedData: string): Promise<string> {
    if (!this.encryptionKey) {
      throw new Error('Security manager not initialized');
    }

    try {
      const combined = new Uint8Array(
        atob(encryptedData).split('').map(char => char.charCodeAt(0))
      );
      
      const iv = combined.slice(0, 12);
      const encrypted = combined.slice(12);

      const encoder = new TextEncoder();
      const keyBuffer = await crypto.subtle.importKey(
        'raw',
        encoder.encode(this.encryptionKey.slice(0, 32)),
        { name: 'AES-GCM' },
        false,
        ['decrypt']
      );

      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        keyBuffer,
        encrypted
      );

      return new TextDecoder().decode(decrypted);
    } catch (error) {
      logError('Decryption failed:', error);
      throw new Error('Decryption failed');
    }
  }

  /**
   * Sanitize input to prevent XSS attacks
   * @param input User input
   * @returns Sanitized string
   */
  sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }

  /**
   * Validate email format with strict rules
   * @param email Email to validate
   * @returns Boolean indicating validity
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  /**
   * Generate secure random token for session management
   * @param length Token length (default: 32)
   * @returns Secure random token
   */
  generateSecureToken(length: number = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Validate API key format and strength
   * @param apiKey API key to validate
   * @returns Boolean indicating validity
   */
  validateApiKey(apiKey: string): boolean {
    // Check minimum length and complexity
    return apiKey.length >= 32 && /^[A-Za-z0-9_-]+$/.test(apiKey);
  }

  /**
   * Rate limiting check (client-side implementation)
   * @param key Unique identifier for rate limiting
   * @param maxRequests Maximum requests allowed
   * @param windowMs Time window in milliseconds
   * @returns Boolean indicating if request should be allowed
   */
  checkRateLimit(key: string, maxRequests: number = 100, windowMs: number = 60000): boolean {
    const now = Date.now();
    const storageKey = `rateLimit_${key}`;
    
    try {
      const stored = localStorage.getItem(storageKey);
      const requests = stored ? JSON.parse(stored) : [];
      
      // Filter out old requests
      const validRequests = requests.filter((timestamp: number) => now - timestamp < windowMs);
      
      if (validRequests.length >= maxRequests) {
        return false;
      }
      
      // Add current request
      validRequests.push(now);
      localStorage.setItem(storageKey, JSON.stringify(validRequests));
      
      return true;
    } catch (error) {
      logError('Rate limiting check failed:', error);
      return true; // Allow on error to avoid breaking functionality
    }
  }
}

/**
 * Content Security Policy helpers
 */
export const CSPHelpers = {
  /**
   * Generate nonce for inline scripts
   */
  generateNonce(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array));
  },

  /**
   * Validate external URL for safe navigation
   */
  validateExternalUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      const allowedProtocols = ['https:', 'http:'];
      const blockedDomains = ['javascript:', 'data:', 'vbscript:', 'file:'];
      
      return allowedProtocols.includes(urlObj.protocol) && 
             !blockedDomains.some(blocked => url.toLowerCase().startsWith(blocked));
    } catch {
      return false;
    }
  }
};

// Export singleton instance
export const security = SecurityManager.getInstance();

/**
 * Secure storage wrapper with encryption
 */
export class SecureStorage {
  private static initialized = false;

  static async init(customKey?: string): Promise<void> {
    if (!this.initialized) {
      security.init(customKey);
      this.initialized = true;
    }
  }

  static async setItem(key: string, value: any): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      const encrypted = await security.encrypt(serialized);
      localStorage.setItem(`secure_${key}`, encrypted);
    } catch (error) {
      logError('Secure storage setItem failed:', error);
      throw new Error('Failed to store data securely');
    }
  }

  static async getItem<T>(key: string): Promise<T | null> {
    try {
      const encrypted = localStorage.getItem(`secure_${key}`);
      if (!encrypted) return null;
      
      const decrypted = await security.decrypt(encrypted);
      return JSON.parse(decrypted) as T;
    } catch (error) {
      logError('Secure storage getItem failed:', error);
      return null;
    }
  }

  static removeItem(key: string): void {
    localStorage.removeItem(`secure_${key}`);
  }
}

export default security;