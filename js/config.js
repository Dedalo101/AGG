/**
 * AGG Homes - Secure Configuration Loader
 * Loads sensitive configuration from secure sources
 * This file should be customized for your deployment environment
 */

// Secure configuration - DO NOT commit actual secrets to version control
window.AGG_CONFIG = {
    // Intercom Configuration
    // Priority: Environment variable > hardcoded fallback (for development only)
    intercomToken: '[REDACTED - Set INTERCOM_API_TOKEN environment variable]', // TEMPORARY: Replace with env var in production
    intercomAppId: 'g28vli0s',
    intercomApiBase: 'https://api.intercom.io',

    // Admin Configuration
    adminUsername: 'dedalo101',
    adminPassword: 'qwerty',

    // Environment
    environment: 'development', // 'development', 'staging', 'production'
    debug: true,

    // Config loading status
    loaded: true
};

// Security warning for development
if (window.AGG_CONFIG.intercomToken === '[REDACTED - Set INTERCOM_API_TOKEN environment variable]') {
    console.warn('⚠️ SECURITY WARNING: Intercom API token not configured. Please set INTERCOM_API_TOKEN environment variable.');
}

// Ensure config is marked as loaded
window.AGG_CONFIG.loaded = true;

// Security warning for development
if (window.AGG_CONFIG.intercomToken === 'your_secure_token_here') {
    console.warn('⚠️ SECURITY WARNING: Intercom API token not configured. Please set INTERCOM_API_TOKEN environment variable.');
}

// Export for module use (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.AGG_CONFIG;
}