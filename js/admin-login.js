// Simple admin login system with debugging

// Initialize admin login system
document.addEventListener('DOMContentLoaded', function () {
    console.log('Initializing Admin Login System...');

    // Simple direct event listener instead of class-based approach
    const loginForm = document.getElementById('admin-login-form');
    const loginButton = document.getElementById('login-button');

    if (loginForm) {
        console.log('Login form found, attaching event listener');
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted');

            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;

            console.log('Username:', username, 'Password length:', password.length);

            if (!username || !password) {
                showError('Please enter both username and password');
                return;
            }

            // Disable button during login
            if (loginButton) {
                loginButton.disabled = true;
                loginButton.textContent = 'Signing in...';
            }

            // Check credentials
            if (username === 'dedalo101' && password === 'qwerty') {
                console.log('Login successful');
                handleSuccessfulLogin(username);
            } else {
                console.log('Login failed');
                showError('Invalid username or password');
                if (loginButton) {
                    loginButton.disabled = false;
                    loginButton.textContent = 'Sign In to Dashboard';
                }
            }
        });
    } else {
        console.error('Login form not found!');
    }
});

function handleSuccessfulLogin(username) {
    console.log('Handling successful login for:', username);

    // Set session data
    const sessionExpiry = new Date().getTime() + (8 * 60 * 60 * 1000); // 8 hours
    localStorage.setItem('agg_admin_logged_in', 'true');
    localStorage.setItem('agg_admin_username', username);
    localStorage.setItem('agg_admin_session_expiry', sessionExpiry.toString());
    localStorage.setItem('agg_admin_login_time', new Date().toISOString());

    showSuccess('Login successful! Redirecting to dashboard...');

    // Redirect after short delay
    setTimeout(() => {
        console.log('Redirecting to dashboard');
        window.location.href = '/admin-dashboard.html';
    }, 1500);
}

function showError(message) {
    console.log('Showing error:', message);
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

function showSuccess(message) {
    console.log('Showing success:', message);
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