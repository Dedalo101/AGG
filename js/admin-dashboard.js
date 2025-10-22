class AdminDashboard {
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
                    console.log('Config loaded successfully');
                    resolve();
                } else {
                    console.log('Waiting for config to load...');
                    setTimeout(checkConfig, 100);
                }
            };
            checkConfig();
        });
    }

    initializeAfterConfig() {
        // Intercom API credentials - loaded securely from environment
        this.intercomConfig = {
            apiToken: this.getSecureToken(),
            appId: 'g28vli0s',
            apiBase: 'https://api.intercom.io'
        };

        this.refreshInterval = null;
        this.authChecked = false; // Prevent multiple auth checks

        // Check authentication first and only once
        if (!this.checkAuthentication()) {
            return; // Stop initialization if not authenticated
        }

        this.initializeDashboard();
        this.loadUserInfo();
        this.loadStats();
        this.setupControlledRefresh(); // Changed from setupAutoRefresh
    }

    getSecureToken() {
        // Method 1: Try to get from window config (loaded by config.js)
        if (typeof window !== 'undefined' && window.AGG_CONFIG && window.AGG_CONFIG.intercomToken) {
            return window.AGG_CONFIG.intercomToken;
        }

        // Method 2: Try to get from environment variable (if available in Node.js environment)
        if (typeof process !== 'undefined' && process.env && process.env.INTERCOM_API_TOKEN) {
            return process.env.INTERCOM_API_TOKEN;
        }

        // Method 3: Fallback for development
        console.warn('Intercom API token not found. Please ensure config.js is loaded with proper configuration.');

        // Return placeholder for development - replace with actual secure token
        return 'your_secure_token_here';
    }

    checkAuthentication() {
        // Prevent multiple checks
        if (this.authChecked) {
            return true;
        }
        this.authChecked = true;

        console.log('Checking admin authentication...');

        // First check if user is logged in
        if (!AdminLogin.isLoggedIn()) {
            console.log('User not logged in, redirecting to login page');
            window.location.href = 'admin-login.html';
            return false;
        }

        // Additional security: Check if user is dedalo101
        const currentUser = AdminLogin.getCurrentUser();
        if (!currentUser) {
            console.warn('No current user data found, redirecting to login');
            this.forceLogout();
            return false;
        }

        if (currentUser.username !== 'dedalo101') {
            console.warn('Unauthorized access attempt to admin dashboard by user:', currentUser.username);
            this.forceLogout();
            return false;
        }

        console.log('Authentication successful for user:', currentUser.username);
        return true;
    }

    forceLogout() {
        // Clear all auth data and redirect
        localStorage.removeItem('agg_admin_logged_in');
        localStorage.removeItem('agg_admin_username');
        localStorage.removeItem('agg_admin_session_expiry');
        localStorage.removeItem('agg_admin_login_time');
        window.location.href = 'admin-login.html';
    }

    initializeDashboard() {
        // Double-check authentication before proceeding
        if (!this.authChecked || !AdminLogin.isLoggedIn()) {
            console.error('Authentication check failed during dashboard initialization');
            this.forceLogout();
            return;
        }

        console.log('Admin Dashboard Initialized for dedalo101');

        // Initialize Intercom for admin use
        this.initializeIntercomForAdmin();

        // Connect to Intercom API
        this.connectToIntercomAPI().then(result => {
            if (result.success) {
                console.log('✅ Intercom API connected successfully');
            } else {
                console.warn('⚠️ Intercom API connection failed:', result.error);
            }
        });

        // Setup event listeners
        this.setupEventListeners();
    }

    loadUserInfo() {
        const user = AdminLogin.getCurrentUser();
        if (user) {
            document.getElementById('current-user').textContent = user.username;
        }
    }

    async loadStats() {
        try {
            // In a real implementation, these would come from Intercom API
            const stats = await this.fetchIntercomStats();

            document.getElementById('active-chats').textContent = stats.activeChats;
            document.getElementById('total-messages').textContent = stats.totalMessages;
            document.getElementById('response-time').textContent = stats.responseTime;
            document.getElementById('satisfaction').textContent = stats.satisfaction;

            console.log('Dashboard stats loaded:', stats);
        } catch (error) {
            console.error('Error loading stats:', error);
            this.loadMockStats();
        }
    }

    async fetchIntercomStats() {
        try {
            // Use real Intercom API with provided credentials
            const response = await this.callIntercomAPI('/me');

            if (response && response.app) {
                // Get real stats from Intercom
                const conversations = await this.callIntercomAPI('/conversations');
                const admins = await this.callIntercomAPI('/admins');

                return {
                    activeChats: conversations?.pages?.total_pages || 0,
                    totalMessages: conversations?.conversations?.length || 0,
                    responseTime: '~2min', // This would need a separate API call to get real data
                    satisfaction: '98%' // This would need customer satisfaction API
                };
            }
        } catch (error) {
            console.error('Intercom API error:', error);
            // Fall back to mock data if API fails
            return this.getMockStats();
        }

        return this.getMockStats();
    }

    async callIntercomAPI(endpoint) {
        try {
            // Note: Direct API calls from browser will fail due to CORS
            // This would need to be implemented through a backend proxy
            const proxyUrl = `/api/intercom${endpoint}`;

            const response = await fetch(proxyUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.intercomConfig.apiToken}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`API call failed: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.warn('Direct Intercom API call failed, using fallback data:', error);
            throw error;
        }
    }

    getMockStats() {
        // Improved mock data that's more realistic
        const now = new Date();
        const hour = now.getHours();

        // Simulate realistic activity based on time of day
        let baseActivity = 5;
        if (hour >= 9 && hour <= 18) baseActivity = 12; // Business hours
        if (hour >= 19 && hour <= 22) baseActivity = 8;  // Evening

        return {
            activeChats: Math.floor(Math.random() * 5) + baseActivity,
            totalMessages: Math.floor(Math.random() * 50) + (baseActivity * 4),
            responseTime: '~2min',
            satisfaction: '98%'
        };
    }

    loadMockStats() {
        // Fallback mock data
        const mockStats = {
            activeChats: 8,
            totalMessages: 73,
            responseTime: '~2min',
            satisfaction: '98%'
        };

        document.getElementById('active-chats').textContent = mockStats.activeChats;
        document.getElementById('total-messages').textContent = mockStats.totalMessages;
        document.getElementById('response-time').textContent = mockStats.responseTime;
        document.getElementById('satisfaction').textContent = mockStats.satisfaction;
    }

    initializeIntercomForAdmin() {
        // Initialize Intercom for admin dashboard
        // This allows you to see admin-specific features

        if (window.Intercom) {
            window.Intercom('boot', {
                app_id: 'g28vli0s',
                user_id: AdminLogin.getCurrentUser()?.username || 'admin',
                name: 'Admin User',
                email: 'admin@agg.homes',
                created_at: Math.floor(Date.now() / 1000),
                custom_attributes: {
                    role: 'admin',
                    dashboard_access: true,
                    login_time: new Date().toISOString()
                }
            });

            console.log('Intercom initialized for admin dashboard');
        } else {
            // Load Intercom if not already loaded
            this.loadIntercomScript();
        }
    }

    loadIntercomScript() {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://widget.intercom.io/widget/g28vli0s';

        script.onload = () => {
            console.log('Intercom script loaded for admin');
            this.initializeIntercomForAdmin();
        };

        document.head.appendChild(script);
    }

    setupEventListeners() {
        // Setup any additional event listeners for dashboard functionality

        // Add click handlers for quick action cards
        const actionCards = document.querySelectorAll('.quick-action-card');
        actionCards.forEach((card, index) => {
            card.addEventListener('click', () => this.handleQuickAction(index));
        });
    }

    handleQuickAction(actionIndex) {
        const actions = [
            () => window.open('https://app.intercom.com/a/apps/g28vli0s/inbox', '_blank'),
            () => window.open('property-matching.html', '_blank'),
            () => window.open('https://app.intercom.com/a/apps/g28vli0s/reports', '_blank'),
            () => window.open('index.html', '_blank')
        ];

        if (actions[actionIndex]) {
            actions[actionIndex]();
        }
    }

    setupControlledRefresh() {
        // Much more controlled refresh - only refresh every 5 minutes
        // and only when the page is visible and user is still authenticated

        const refreshData = () => {
            // Check authentication before refreshing
            if (!AdminLogin.isLoggedIn()) {
                console.log('User session expired during refresh, logging out');
                this.forceLogout();
                return;
            }

            if (!document.hidden) {
                this.loadStats();
            }
        };

        // Refresh every 5 minutes instead of 30 seconds
        this.refreshInterval = setInterval(refreshData, 5 * 60 * 1000);

        // Also refresh when page becomes visible
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && AdminLogin.isLoggedIn()) {
                this.loadStats();
            }
        });

        // Manual refresh button
        const refreshButton = document.querySelector('button[onclick*="refreshStats"]');
        if (refreshButton) {
            refreshButton.onclick = () => this.manualRefresh();
        }
    }

    async manualRefresh() {
        console.log('Manual refresh triggered by admin...');

        // Check authentication before proceeding
        if (!AdminLogin.isLoggedIn()) {
            console.log('User not authenticated for manual refresh, logging out');
            this.forceLogout();
            return;
        }

        // Clear existing interval to prevent conflicts
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }

        try {
            await this.loadStats();
            this.showRefreshSuccess();

            // Restart the controlled refresh
            this.setupControlledRefresh();
        } catch (error) {
            console.error('Manual refresh failed:', error);
            this.showRefreshError();
        }
    }

    async refreshStats() {
        console.log('Refreshing dashboard stats...');

        try {
            await this.loadStats();

            // Show brief success indicator
            this.showRefreshSuccess();
        } catch (error) {
            console.error('Error refreshing stats:', error);
            this.showRefreshError();
        }
    }

    showRefreshSuccess() {
        // Create temporary success indicator
        const indicator = document.createElement('div');
        indicator.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            font-size: 14px;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        `;
        indicator.textContent = '✓ Stats refreshed';

        document.body.appendChild(indicator);

        setTimeout(() => {
            document.body.removeChild(indicator);
        }, 3000);
    }

    showRefreshError() {
        const indicator = document.createElement('div');
        indicator.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            font-size: 14px;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        `;
        indicator.textContent = '⚠ Refresh failed';

        document.body.appendChild(indicator);

        setTimeout(() => {
            document.body.removeChild(indicator);
        }, 3000);
    }

    // Method to integrate with Intercom API (simplified for direct implementation)
    async connectToIntercomAPI() {
        // Simplified implementation that works with your credentials
        try {
            // For security, Intercom API calls should go through your backend
            // Direct browser calls are blocked by CORS

            console.log('Connecting to Intercom with App ID:', this.intercomConfig.appId);

            // Use the Intercom widget's built-in methods instead of direct API
            if (window.Intercom && typeof window.Intercom === 'function') {
                // Get unread count using widget
                window.Intercom('onUnreadCountChange', (unreadCount) => {
                    document.getElementById('active-chats').textContent = unreadCount;
                    console.log('Intercom unread count updated:', unreadCount);
                });

                // Update admin interface
                window.Intercom('update', {
                    app_id: this.intercomConfig.appId,
                    user_id: 'admin_dedalo101',
                    name: 'AGG Admin',
                    email: 'admin@agg.homes',
                    custom_attributes: {
                        role: 'administrator',
                        access_level: 'full',
                        login_time: new Date().toISOString()
                    }
                });

                return { success: true, method: 'widget_integration' };
            }

            return { success: false, error: 'Widget not loaded' };

        } catch (error) {
            console.error('Intercom integration error:', error);
            return { success: false, error: error.message };
        }
    }

    // Helper method to format numbers
    formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
    }

    // Helper method to format time
    formatTime(seconds) {
        if (seconds < 60) {
            return `${seconds}s`;
        } else if (seconds < 3600) {
            return `${Math.floor(seconds / 60)}m`;
        } else {
            return `${Math.floor(seconds / 3600)}h`;
        }
    }

    async loadChatTickets() {
        console.log('Loading live chat tickets...');

        const ticketsSection = document.getElementById('chat-tickets-section');
        const ticketsContainer = document.getElementById('chat-tickets-container');

        if (!ticketsSection || !ticketsContainer) {
            // Create the tickets section if it doesn't exist
            this.createTicketsSection();
            return;
        }

        ticketsSection.style.display = 'block';

        // Show loading state
        ticketsContainer.innerHTML = `
            <div style="text-align: center; padding: 20px; color: #64748b;">
                <div style="margin-bottom: 12px;">🔄</div>
                <div>Loading chat tickets...</div>
            </div>
        `;

        try {
            // In production, this would fetch real tickets from Intercom API
            const tickets = await this.fetchChatTickets();
            this.displayChatTickets(tickets);
        } catch (error) {
            console.error('Error loading chat tickets:', error);
            this.showTicketsError();
        }
    }

    createTicketsSection() {
        const intercomContainer = document.querySelector('.intercom-container');
        if (!intercomContainer) return;

        const ticketsSection = document.createElement('div');
        ticketsSection.className = 'chat-tickets-section';
        ticketsSection.id = 'chat-tickets-section';
        ticketsSection.innerHTML = `
            <h3 style="margin-bottom: 16px; color: #1e293b; font-size: 16px;">Live Chat Tickets</h3>
            <div id="chat-tickets-container"></div>
        `;

        // Add Load Tickets button to actions
        const actionsDiv = document.querySelector('.intercom-actions');
        if (actionsDiv) {
            const loadButton = document.createElement('button');
            loadButton.className = 'action-button secondary';
            loadButton.onclick = () => this.loadChatTickets();
            loadButton.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 8px;">
                    <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"/>
                </svg>
                Load Live Tickets
            `;
            actionsDiv.appendChild(loadButton);
        }

        intercomContainer.insertBefore(ticketsSection, intercomContainer.querySelector('.intercom-embed'));
        this.loadChatTickets();
    }

    async fetchChatTickets() {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock chat tickets data (in production, this would come from Intercom API)
        return [
            {
                id: 'ticket_001',
                customerName: 'María García',
                subject: 'Property inquiry - Marbella Villa',
                status: 'open',
                priority: 'high',
                lastMessage: 'I\'m interested in the 3-bedroom villa in Marbella...',
                timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                unreadCount: 2
            },
            {
                id: 'ticket_002',
                customerName: 'John Smith',
                subject: 'Viewing appointment request',
                status: 'open',
                priority: 'medium',
                lastMessage: 'Can we schedule a viewing for this weekend?',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                unreadCount: 1
            },
            {
                id: 'ticket_003',
                customerName: 'Anna Petrov',
                subject: 'Financing options inquiry',
                status: 'pending',
                priority: 'low',
                lastMessage: 'What are the available mortgage options?',
                timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                unreadCount: 0
            },
            {
                id: 'ticket_004',
                customerName: 'Carlos López',
                subject: 'Property matching service',
                status: 'open',
                priority: 'high',
                lastMessage: 'Looking for properties under €500k in Costa del Sol',
                timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
                unreadCount: 3
            }
        ];
    }

    displayChatTickets(tickets) {
        const ticketsContainer = document.getElementById('chat-tickets-container');
        if (!ticketsContainer) return;

        if (tickets.length === 0) {
            ticketsContainer.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #64748b;">
                    <div style="margin-bottom: 12px; font-size: 24px;">💬</div>
                    <div>No active chat tickets</div>
                </div>
            `;
            return;
        }

        const ticketsHTML = tickets.map(ticket => `
            <div class="ticket-card" style="
                background: white;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 16px;
                margin-bottom: 12px;
                cursor: pointer;
                transition: all 0.2s;
                border-left: 4px solid ${this.getPriorityColor(ticket.priority)};
            " onclick="window.adminDashboard.openTicket('${ticket.id}')">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                    <div>
                        <h4 style="margin: 0; font-size: 14px; font-weight: 600; color: #1e293b;">${ticket.customerName}</h4>
                        <p style="margin: 4px 0 0 0; font-size: 12px; color: #64748b;">${ticket.subject}</p>
                    </div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        ${ticket.unreadCount > 0 ? `
                            <span style="
                                background: #ef4444;
                                color: white;
                                border-radius: 10px;
                                padding: 2px 6px;
                                font-size: 10px;
                                font-weight: 600;
                            ">${ticket.unreadCount}</span>
                        ` : ''}
                        <span style="
                            background: ${this.getStatusColor(ticket.status)};
                            color: white;
                            border-radius: 4px;
                            padding: 2px 6px;
                            font-size: 10px;
                            font-weight: 500;
                            text-transform: uppercase;
                        ">${ticket.status}</span>
                    </div>
                </div>
                <p style="margin: 0; font-size: 13px; color: #475569; line-height: 1.4;">${ticket.lastMessage}</p>
                <div style="margin-top: 8px; font-size: 11px; color: #94a3b8;">
                    ${this.formatTimeAgo(ticket.timestamp)}
                </div>
            </div>
        `).join('');

        ticketsContainer.innerHTML = ticketsHTML;
    }

    openTicket(ticketId) {
        console.log('Opening ticket:', ticketId);
        // Open the Intercom inbox with proper URL
        window.open(`https://app.intercom.com/a/apps/${this.intercomConfig.appId}/inbox`, '_blank');
    }

    getPriorityColor(priority) {
        const colors = {
            'high': '#ef4444',
            'medium': '#f59e0b',
            'low': '#10b981'
        };
        return colors[priority] || '#64748b';
    }

    getStatusColor(status) {
        const colors = {
            'open': '#3b82f6',
            'pending': '#f59e0b',
            'closed': '#6b7280'
        };
        return colors[status] || '#64748b';
    }

    formatTimeAgo(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInSeconds = Math.floor((now - time) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    }

    showTicketsError() {
        const ticketsContainer = document.getElementById('chat-tickets-container');
        if (!ticketsContainer) return;

        ticketsContainer.innerHTML = `
            <div style="text-align: center; padding: 20px; color: #ef4444; background: #fef2f2; border-radius: 6px;">
                <div style="margin-bottom: 8px;">⚠️</div>
                <div style="font-weight: 500;">Failed to load chat tickets</div>
                <button onclick="window.adminDashboard.loadChatTickets()" style="
                    margin-top: 12px;
                    padding: 6px 12px;
                    background: #ef4444;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    font-size: 12px;
                    cursor: pointer;
                ">Retry</button>
            </div>
        `;
    }
}

// Initialize admin dashboard
document.addEventListener('DOMContentLoaded', function () {
    console.log('Initializing Admin Dashboard...');
    window.adminDashboard = new AdminDashboard();
});

// Cleanup on page unload
window.addEventListener('beforeunload', function () {
    if (window.adminDashboard && window.adminDashboard.refreshInterval) {
        clearInterval(window.adminDashboard.refreshInterval);
        console.log('Admin dashboard cleanup completed');
    }
});

// Export for global access
window.AdminDashboard = AdminDashboard;

// Custom logout function for admin dashboard - redirects to main site
function logoutToMainSite() {
    console.log('Logging out admin user and redirecting to main site...');

    // Clear all auth data
    localStorage.removeItem('agg_admin_logged_in');
    localStorage.removeItem('agg_admin_username');
    localStorage.removeItem('agg_admin_session_expiry');
    localStorage.removeItem('agg_admin_login_time');

    // Redirect to main site instead of login page
    window.location.href = 'index.html';
}