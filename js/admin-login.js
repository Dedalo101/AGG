class AdminLogin {
    constructor() {
        // Wait for config to load before initializing
        this.waitForConfig().then(() => {
            this.initializeAfterConfig();
        });
    }

    async waitForConfig() {
        // Wait for config.js to load
        return new Promise((resolve) => {
            const checkConfig = () => {
                if (window.AGG_CONFIG && window.AGG_CONFIG.loaded) {
                    console.log('Config loaded for login system');
                    resolve();
                } else {
                    console.log('Waiting for config to load in login...');
                    setTimeout(checkConfig, 100);
                }
            };
            checkConfig();
        });
    }

    initializeAfterConfig() {
        this.initializeLogin();
        this.setupEventListeners();
    }

    initializeLogin() {
        console.log('Admin Login System Initialized');

        // Check if user is already logged in
        const isLoggedIn = localStorage.getItem('agg_admin_logged_in');
        const sessionExpiry = localStorage.getItem('agg_admin_session_expiry');

        if (isLoggedIn && sessionExpiry && new Date().getTime() < parseInt(sessionExpiry)) {
            this.redirectToDashboard();
        }
    }

    setupEventListeners() {
        const loginForm = document.getElementById('admin-login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Enter key support
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && (e.target.id === 'username' || e.target.id === 'password')) {
                e.preventDefault();
                this.handleLogin(e);
            }
        });
    }

    async handleLogin(event) {
        event.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const loginButton = document.getElementById('login-button');

        if (!username || !password) {
            this.showError('Please enter both username and password');
            return;
        }

        // Disable button during login
        loginButton.disabled = true;
        loginButton.textContent = 'Signing in...';

        try {
            const loginSuccess = await this.validateCredentials(username, password);

            if (loginSuccess) {
                this.handleSuccessfulLogin(username);
            } else {
                this.showError('Invalid username or password');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showError('Login failed. Please try again.');
        } finally {
            loginButton.disabled = false;
            loginButton.textContent = 'Sign In to Dashboard';
        }
    }

    async validateCredentials(username, password) {
        // Secure authentication - only allow authorized admin access
        // Single admin user access for AGG Homes administration
        // Only dedalo101 is authorized as per user requirements

        // Get credentials from secure config
        const authorizedAdmin = {
            username: (window.AGG_CONFIG && window.AGG_CONFIG.adminUsername) || 'dedalo101',
            password: (window.AGG_CONFIG && window.AGG_CONFIG.adminPassword) || 'qwerty'
        };

        // Simulate API call delay for security
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Strict credential validation - only authorized user allowed
        const isAuthorized = username === authorizedAdmin.username &&
            password === authorizedAdmin.password;

        // Log failed attempts for security
        if (!isAuthorized && username !== '' && password !== '') {
            console.warn(`Unauthorized login attempt: ${username} at ${new Date().toISOString()}`);
        }

        return isAuthorized;
    } handleSuccessfulLogin(username) {
        // Set session data
        const sessionExpiry = new Date().getTime() + (8 * 60 * 60 * 1000); // 8 hours
        localStorage.setItem('agg_admin_logged_in', 'true');
        localStorage.setItem('agg_admin_username', username);
        localStorage.setItem('agg_admin_session_expiry', sessionExpiry.toString());
        localStorage.setItem('agg_admin_login_time', new Date().toISOString());

        this.showSuccess('Login successful! Redirecting to dashboard...');

        // Redirect after short delay
        setTimeout(() => {
            this.redirectToDashboard();
        }, 1500);
    }

    redirectToDashboard() {
        // Check if dashboard page exists, otherwise create it
        window.location.href = 'admin-dashboard.html';
    }

    showError(message) {
        const errorDiv = document.getElementById('error-message');
        const successDiv = document.getElementById('success-message');

        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }

        if (successDiv) {
            successDiv.style.display = 'none';
        }

        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (errorDiv) errorDiv.style.display = 'none';
        }, 5000);
    }

    showSuccess(message) {
        const successDiv = document.getElementById('success-message');
        const errorDiv = document.getElementById('error-message');

        if (successDiv) {
            successDiv.textContent = message;
            successDiv.style.display = 'block';
        }

        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    }

    // Utility method to check login status from other pages
    static isLoggedIn() {
        const isLoggedIn = localStorage.getItem('agg_admin_logged_in');
        const sessionExpiry = localStorage.getItem('agg_admin_session_expiry');

        return isLoggedIn && sessionExpiry && new Date().getTime() < parseInt(sessionExpiry);
    }

    // Utility method to logout
    static logout() {
        localStorage.removeItem('agg_admin_logged_in');
        localStorage.removeItem('agg_admin_username');
        localStorage.removeItem('agg_admin_session_expiry');
        localStorage.removeItem('agg_admin_login_time');

        // Only redirect if we're not already on the login page
        if (!window.location.pathname.includes('admin-login.html')) {
            window.location.href = 'admin-login.html';
        }
    }

    // Get current admin user info
    static getCurrentUser() {
        if (this.isLoggedIn()) {
            return {
                username: localStorage.getItem('agg_admin_username'),
                loginTime: localStorage.getItem('agg_admin_login_time'),
                sessionExpiry: localStorage.getItem('agg_admin_session_expiry')
            };
        }
        return null;
    }
}

// Initialize admin login system
document.addEventListener('DOMContentLoaded', function () {
    console.log('Initializing Admin Login System...');
    window.adminLogin = new AdminLogin();
});

// Export for global access
window.AdminLogin = AdminLogin;