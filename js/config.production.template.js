/**
 * Production Configuration Template
 * Copy this to config.js and fill in actual values
 * NEVER commit actual secrets to version control
 */

window.AGG_CONFIG = {
    // Intercom Configuration
    // IMPORTANT: Replace these with environment variables in production
    intercomToken: process?.env?.INTERCOM_API_TOKEN || '[SET_INTERCOM_TOKEN_HERE]',
    intercomAppId: 'g28vli0s',
    intercomApiBase: 'https://api.intercom.io',

    // Admin Configuration
    // IMPORTANT: Use secure authentication in production
    adminUsername: process?.env?.ADMIN_USERNAME || '[SET_ADMIN_USERNAME_HERE]',
    adminPassword: process?.env?.ADMIN_PASSWORD || '[SET_SECURE_PASSWORD_HERE]',

    // Environment Detection
    environment: process?.env?.NODE_ENV || 'production',
    debug: false, // Set to false in production

    // Config loading status
    loaded: true
};

// Production security check
if (window.AGG_CONFIG.environment === 'production') {
    if (window.AGG_CONFIG.intercomToken.includes('[SET_') || 
        window.AGG_CONFIG.adminPassword.includes('[SET_')) {
        console.error('❌ CRITICAL: Production secrets not configured!');
        console.error('Please set environment variables:');
        console.error('  - INTERCOM_API_TOKEN');
        console.error('  - ADMIN_USERNAME');
        console.error('  - ADMIN_PASSWORD');
    }
}

// Ensure config is marked as loaded
window.AGG_CONFIG.loaded = true;

// Export for module use (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.AGG_CONFIG;
}
