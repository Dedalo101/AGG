# 🔒 AGG Homes - Security Configuration

This document explains how to securely configure sensitive information for the AGG Homes application.

## 🚨 Security Warning

**NEVER commit actual secrets, API keys, or passwords to version control.** All sensitive configuration has been removed from the codebase and replaced with secure placeholders.

### ⚠️ Current Development Setup

**For local development**, the Intercom token is configured in `js/config.js` for immediate functionality.

**Environment Variable Set Locally:**

```powershell
$env:INTERCOM_API_TOKEN = "[REDACTED - Set your actual Intercom API token]"
```

### 🚨 Production Deployment Required

**BEFORE deploying to production:**

1. Remove the hardcoded token from `js/config.js`
2. Set `INTERCOM_API_TOKEN` on your hosting platform
3. Use build-time replacement or secure config endpoints

### 1. Environment Variables (Production - Required)

Set the following environment variables on your server/hosting platform:

```bash
# Intercom Configuration
INTERCOM_API_TOKEN=your_actual_intercom_api_token_here
INTERCOM_APP_ID=g28vli0s

# Admin Credentials
ADMIN_USERNAME=dedalo101
ADMIN_PASSWORD=your_secure_password_here
```

### 2. Local Development Configuration

For local development, create a `config.env` file in the project root:

```bash
# Copy from config.env.example and fill in actual values
cp config.env.example config.env

# Edit config.env with your actual secrets
INTERCOM_API_TOKEN=your_actual_token
ADMIN_PASSWORD=your_secure_password
```

**Important:** The `config.env` file is in `.gitignore` and will not be committed to version control.

### 3. JavaScript Configuration

The `js/config.js` file loads configuration securely. For production deployment:

1. **Server-side rendering**: Set environment variables on your hosting platform
2. **Static hosting**: Use build-time replacement or secure config endpoints
3. **CDN deployment**: Configure secrets through your CDN's environment variable system

## 🔧 Configuration Methods

### Method 1: Environment Variables (Most Secure)

```javascript
// config.js will automatically use process.env variables
window.AGG_CONFIG = {
    intercomToken: process.env.INTERCOM_API_TOKEN,
    adminPassword: process.env.ADMIN_PASSWORD
};
```

### Method 2: Secure Config Endpoint

Create a server endpoint that returns configuration:

```javascript
// Load config from secure endpoint
fetch('/api/config')
    .then(response => response.json())
    .then(config => {
        window.AGG_CONFIG = config;
    });
```

### Method 3: Build-time Replacement

Use your build process to replace placeholders:

```javascript
// Before build
window.AGG_CONFIG = {
    intercomToken: '%%INTERCOM_TOKEN%%',
    adminPassword: '%%ADMIN_PASSWORD%%'
};

// After build (replaced by build script)
window.AGG_CONFIG = {
    intercomToken: 'your_actual_token',
    adminPassword: 'your_actual_password'
};
```

## � Configuration Methods

### Method 1: Environment Variables (Most Secure)

```javascript
// config.js will automatically use process.env variables
window.AGG_CONFIG = {
    intercomToken: process.env.INTERCOM_API_TOKEN,
    adminPassword: process.env.ADMIN_PASSWORD
};
```

### Method 2: Secure Config Endpoint

Create a server endpoint that returns configuration:

```javascript
// Load config from secure endpoint
fetch('/api/config')
    .then(response => response.json())
    .then(config => {
        window.AGG_CONFIG = config;
    });
```

### Method 3: Build-time Replacement

Use your build process to replace placeholders:

```javascript
// Before build
window.AGG_CONFIG = {
    intercomToken: '%%INTERCOM_TOKEN%%',
    adminPassword: '%%ADMIN_PASSWORD%%'
};

// After build (replaced by build script)
window.AGG_CONFIG = {
    intercomToken: 'your_actual_token',
    adminPassword: 'your_actual_password'
};
```

## �🛡️ Security Best Practices

### 1. Never Commit Secrets
- All secret files are in `.gitignore`
- Use environment variables in production
- Rotate API keys regularly

### 2. Access Control
- Admin access restricted to authorized users only
- Session-based authentication with expiration
- Failed login attempt logging

### 3. API Security
- Intercom API calls routed through secure backend when possible
- CORS restrictions prevent direct browser API access
- Token validation on all admin requests

### 4. Monitoring
- Log unauthorized access attempts
- Monitor for unusual activity
- Regular security audits

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Set `INTERCOM_API_TOKEN` environment variable
- [ ] Set secure `ADMIN_PASSWORD`
- [ ] Verify `.gitignore` excludes sensitive files
- [ ] Test admin login functionality
- [ ] Confirm Intercom integration works
- [ ] Check that no secrets are exposed in client-side code

## 🔍 Verification

To verify your configuration is secure:

1. **Check for exposed secrets:**

   ```bash
   grep -r "your_actual_intercom_token_here" .
   ```

2. **Verify environment variables:**

   ```bash
   echo $INTERCOM_API_TOKEN
   ```

3. **Test admin access:**
   - Try logging in with correct credentials
   - Verify dashboard loads without errors
   - Check Intercom integration

## 📞 Support

If you encounter configuration issues:

1. Ensure all environment variables are set
2. Check browser console for configuration errors
3. Verify `config.js` is loading before other scripts
4. Test with the provided `config.env.example` template

## 📝 Recent Security Updates

- ✅ Removed hardcoded Intercom API tokens
- ✅ Implemented secure configuration loading
- ✅ Added environment variable support
- ✅ Updated `.gitignore` to exclude sensitive files
- ✅ Created secure config templates

---

**Last Updated:** October 2025
**Security Status:** ✅ Secrets Removed from Codebase

