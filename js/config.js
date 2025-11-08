/**
 * AGG Homes - Secure Configuration Loader
 * Loads sensitive configuration from secure sources
 * This file should be customized for your deployment environment
 */

// Secure configuration - DO NOT commit actual secrets to version control
window.AGG_CONFIG = {
    // Intercom Configuration
    // Priority: Environment variable > secure placeholder
    intercomToken: process?.env?.INTERCOM_API_TOKEN || '[REDACTED - Set INTERCOM_API_TOKEN environment variable]',
    intercomAppId: 'g28vli0s',
    intercomApiBase: 'https://api.intercom.io',

    // Admin Configuration
    // IMPORTANT: Use secure authentication in production
    adminUsername: process?.env?.ADMIN_USERNAME || '[REDACTED - Set ADMIN_USERNAME environment variable]',
    adminPassword: process?.env?.ADMIN_PASSWORD || '[REDACTED - Set ADMIN_PASSWORD environment variable]',

    // Environment
    environment: process?.env?.NODE_ENV || 'development',
    debug: process?.env?.NODE_ENV !== 'production',

    // Config loading status
    loaded: true
};

// Security warning for development
if (window.AGG_CONFIG.intercomToken.includes('[REDACTED]') ||
    window.AGG_CONFIG.adminPassword.includes('[REDACTED]')) {
    console.warn('⚠️ SECURITY WARNING: Configuration not fully set up. Please set environment variables:');
    console.warn('  - INTERCOM_API_TOKEN');
    console.warn('  - ADMIN_USERNAME');
    console.warn('  - ADMIN_PASSWORD');
}

// Export for module use (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.AGG_CONFIG;
}