/**
 * AGG Homes Chat Integration
 * Complete Intercom Implementation following Official Documentation
 * Source: https://developers.intercom.com/docs
 */

class AGGChatSystem {
    constructor() {
        this.whatsappNumber = '+31617622375';
        this.appId = 'g28vli0s';
        this.apiBase = 'https://api-iam.intercom.io'; // US region
        this.isIntercomLoaded = false;
        this.visitCount = this.getVisitCount();
        this.sessionId = this.generateSessionId();

        console.log('🚀 Initializing AGG Chat System - Official Intercom Implementation');
        this.init();
    }

    init() {
        // Load official Intercom implementation
        this.loadOfficialIntercom();

        // Initialize WhatsApp integration
        this.initWhatsApp();

        // Setup event tracking
        this.setupEventTracking();

        // Initialize user session
        this.initUserSession();

        console.log('✅ AGG Chat System ready - App ID:', this.appId);
    }

    loadOfficialIntercom() {
        // Official Intercom snippet from documentation
        // https://developers.intercom.com/installing-intercom/web/installation

        // Set Intercom settings (required before loading)
        window.intercomSettings = {
            api_base: this.apiBase,
            app_id: this.appId,
            hide_default_launcher: false, // Show default launcher
            alignment: 'right', // Position of launcher
            horizontal_padding: 20,
            vertical_padding: 20
        };

        // Official Intercom loading script
        (function () {
            var w = window;
            var ic = w.Intercom;
            if (typeof ic === "function") {
                ic('reattach_activator');
                ic('update', w.intercomSettings);
            } else {
                var d = document;
                var i = function () {
                    i.c(arguments);
                };
                i.q = [];
                i.c = function (args) {
                    i.q.push(args);
                };
                w.Intercom = i;

                var l = function () {
                    var s = d.createElement('script');
                    s.type = 'text/javascript';
                    s.async = true;
                    s.src = 'https://widget.intercom.io/widget/' + window.intercomSettings.app_id;
                    var x = d.getElementsByTagName('script')[0];
                    x.parentNode.insertBefore(s, x);
                };

                if (document.readyState === 'complete') {
                    l();
                } else if (w.attachEvent) {
                    w.attachEvent('onload', l);
                } else {
                    w.addEventListener('load', l, false);
                }
            }
        })();

        // Boot Intercom after DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => this.bootIntercom(), 1000);
            });
        } else {
            setTimeout(() => this.bootIntercom(), 1000);
        }
    }

    bootIntercom() {
        if (typeof window.Intercom !== 'function') {
            console.warn('⚠️ Intercom not ready, retrying...');
            setTimeout(() => this.bootIntercom(), 1000);
            return;
        }

        console.log('🔧 Booting Intercom with comprehensive user data...');

        const userData = this.getComprehensiveUserData();

        // Boot Intercom with all user data
        window.Intercom('boot', userData);

        this.isIntercomLoaded = true;

        // Setup event listeners
        this.setupIntercomEvents();

        // Track initial page view
        this.trackPageView();

        console.log('✅ Intercom booted successfully');
    }

    getComprehensiveUserData() {
        const language = this.detectLanguage();
        const userId = this.getOrCreateUserId();

        return {
            // Core Intercom settings
            api_base: this.apiBase,
            app_id: this.appId,

            // User identification
            user_id: userId,
            name: this.getUserName() || this.generateFriendlyName(),
            email: this.getUserEmail() || '',
            phone: this.getUserPhone() || '',
            created_at: this.getUserCreatedAt(),

            // Company information
            company: {
                name: "AGG Homes Visitor",
                company_id: "agg-homes-web",
                industry: "Real Estate",
                website: "https://agg.homes",
                size: "1-10"
            },

            // Custom attributes for real estate context
            custom_attributes: {
                // Page context
                current_page: window.location.pathname,
                current_url: window.location.href,
                page_title: document.title,
                language: language,

                // Session information
                session_id: this.sessionId,
                visit_count: this.visitCount,
                session_start: new Date().toISOString(),
                referrer: document.referrer || 'direct',

                // Technical context
                user_agent: navigator.userAgent,
                screen_resolution: `${screen.width}x${screen.height}`,
                timezone: this.getTimezone(),

                // Marketing context
                utm_source: this.getURLParameter('utm_source'),
                utm_medium: this.getURLParameter('utm_medium'),
                utm_campaign: this.getURLParameter('utm_campaign'),
                utm_content: this.getURLParameter('utm_content'),
                utm_term: this.getURLParameter('utm_term'),

                // Real estate specific
                property_seeker: true,
                interested_in: this.getPropertyInterests(),
                budget_range: this.getBudgetRange(),
                preferred_locations: this.getPreferredLocations(),
                consultation_requested: this.hasRequestedConsultation(),
                property_views: this.getPropertyViews(),

                // Behavioral data
                pages_viewed: this.getPagesViewed(),
                time_on_site: this.getTimeOnSite(),
                form_submissions: this.getFormSubmissions(),

                // Lead scoring
                lead_score: this.calculateLeadScore(),
                engagement_level: this.getEngagementLevel()
            }
        };
    }

    setupIntercomEvents() {
        // Official Intercom event handlers
        // https://developers.intercom.com/installing-intercom/web/methods

        // When messenger opens
        window.Intercom('onShow', () => {
            console.log('💬 Messenger opened');
            this.trackEvent('messenger_opened');
            this.updateEngagement('messenger_open');
        });

        // When messenger closes
        window.Intercom('onHide', () => {
            console.log('💬 Messenger closed');
            this.trackEvent('messenger_closed');
        });

        // When unread count changes
        window.Intercom('onUnreadCountChange', (unreadCount) => {
            console.log(`📧 Unread messages: ${unreadCount}`);
            this.updateUnreadIndicator(unreadCount);

            // Notify admin dashboard if available
            if (window.adminDashboard && typeof window.adminDashboard.updateUnreadCount === 'function') {
                window.adminDashboard.updateUnreadCount(unreadCount);
            }
        });

        // When user provides email
        window.Intercom('onUserEmailSupplied', (email) => {
            console.log('📧 Email provided:', email);
            this.trackEvent('email_provided', { email: email });
            this.updateUserData({ email: email });
            localStorage.setItem('agg_user_email', email);
        });
    }

    // Enhanced tracking methods
    trackEvent(eventName, metadata = {}) {
        if (this.isIntercomLoaded && typeof window.Intercom === 'function') {
            const eventData = {
                ...metadata,
                timestamp: new Date().toISOString(),
                page_url: window.location.href,
                session_id: this.sessionId
            };

            window.Intercom('trackEvent', eventName, eventData);
            console.log(`📊 Event tracked: ${eventName}`, eventData);
        }
    }

    trackPageView() {
        this.trackEvent('page_viewed', {
            page_title: document.title,
            page_path: window.location.pathname,
            language: this.detectLanguage()
        });

        // Update pages viewed count
        this.incrementPagesViewed();
    }

    updateUserData(newData) {
        if (this.isIntercomLoaded && typeof window.Intercom === 'function') {
            window.Intercom('update', newData);
            console.log('👤 User data updated:', newData);
        }
    }

    // Utility methods for user data collection
    getOrCreateUserId() {
        let userId = localStorage.getItem('agg_user_id');
        if (!userId) {
            userId = 'agg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('agg_user_id', userId);
        }
        return userId;
    }

    getUserCreatedAt() {
        let createdAt = localStorage.getItem('agg_user_created_at');
        if (!createdAt) {
            createdAt = Math.floor(Date.now() / 1000);
            localStorage.setItem('agg_user_created_at', createdAt.toString());
        }
        return parseInt(createdAt);
    }

    generateFriendlyName() {
        const adjectives = ['Interested', 'Potential', 'Valued', 'Future'];
        const nouns = ['Buyer', 'Client', 'Customer', 'Investor'];
        const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];
        return `${adj} ${noun}`;
    }

    getVisitCount() {
        let count = parseInt(localStorage.getItem('agg_visit_count')) || 0;
        count++;
        localStorage.setItem('agg_visit_count', count.toString());
        return count;
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    }

    detectLanguage() {
        const path = window.location.pathname;
        if (path.includes('/es/')) return 'es';
        if (path.includes('/nl/')) return 'nl';
        return 'en';
    }

    getTimezone() {
        try {
            return Intl.DateTimeFormat().resolvedOptions().timeZone;
        } catch (e) {
            return 'Unknown';
        }
    }

    getURLParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name) || '';
    }

    // Real estate specific methods
    getPropertyInterests() {
        return localStorage.getItem('agg_property_interests') || 'General';
    }

    getBudgetRange() {
        return localStorage.getItem('agg_budget_range') || 'Not specified';
    }

    getPreferredLocations() {
        return localStorage.getItem('agg_preferred_locations') || 'Costa del Sol';
    }

    hasRequestedConsultation() {
        return localStorage.getItem('agg_consultation_requested') === 'true';
    }

    getPropertyViews() {
        return parseInt(localStorage.getItem('agg_property_views')) || 0;
    }

    getPagesViewed() {
        return parseInt(localStorage.getItem('agg_pages_viewed')) || 1;
    }

    incrementPagesViewed() {
        const current = this.getPagesViewed();
        localStorage.setItem('agg_pages_viewed', (current + 1).toString());
    }

    getTimeOnSite() {
        const sessionStart = localStorage.getItem('agg_session_start');
        if (sessionStart) {
            return Math.floor((Date.now() - parseInt(sessionStart)) / 1000);
        }
        localStorage.setItem('agg_session_start', Date.now().toString());
        return 0;
    }

    getFormSubmissions() {
        return parseInt(localStorage.getItem('agg_form_submissions')) || 0;
    }

    calculateLeadScore() {
        let score = 0;
        score += this.getVisitCount() * 10;
        score += this.getPagesViewed() * 5;
        score += this.getFormSubmissions() * 25;
        score += this.hasRequestedConsultation() ? 50 : 0;
        score += this.getUserEmail() ? 30 : 0;
        score += this.getUserPhone() ? 20 : 0;
        return Math.min(score, 100);
    }

    getEngagementLevel() {
        const score = this.calculateLeadScore();
        if (score >= 75) return 'High';
        if (score >= 40) return 'Medium';
        return 'Low';
    }

    updateEngagement(action) {
        const engagements = JSON.parse(localStorage.getItem('agg_engagements') || '[]');
        engagements.push({
            action: action,
            timestamp: new Date().toISOString(),
            page: window.location.pathname
        });
        localStorage.setItem('agg_engagements', JSON.stringify(engagements.slice(-50))); // Keep last 50
    }

    // Helper methods for user information
    getUserName() {
        return localStorage.getItem('agg_user_name') || '';
    }

    getUserEmail() {
        return localStorage.getItem('agg_user_email') || '';
    }

    getUserPhone() {
        return localStorage.getItem('agg_user_phone') || '';
    }

    // WhatsApp integration
    initWhatsApp() {
        // Create WhatsApp alternative button
        this.createWhatsAppWidget();
    }

    createWhatsAppWidget() {
        // Only create if not already exists
        if (document.getElementById('whatsapp-widget')) return;

        const widget = document.createElement('div');
        widget.id = 'whatsapp-widget';
        widget.innerHTML = `
            <div style="
                position: fixed;
                bottom: 80px;
                right: 20px;
                z-index: 1000;
                background: #25d366;
                color: white;
                padding: 12px;
                border-radius: 50px;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
                display: flex;
                align-items: center;
                gap: 8px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 14px;
                opacity: 0.9;
                transition: all 0.3s ease;
            " onclick="window.AGGChat.openWhatsApp()">
                <span style="font-size: 18px;">📱</span>
                <span>WhatsApp</span>
            </div>
        `;

        document.body.appendChild(widget);

        // Add hover effects
        const whatsappBtn = widget.firstElementChild;
        whatsappBtn.addEventListener('mouseenter', () => {
            whatsappBtn.style.opacity = '1';
            whatsappBtn.style.transform = 'scale(1.05)';
        });

        whatsappBtn.addEventListener('mouseleave', () => {
            whatsappBtn.style.opacity = '0.9';
            whatsappBtn.style.transform = 'scale(1)';
        });
    }

    openWhatsApp() {
        const language = this.detectLanguage();
        const messages = {
            en: `Hello! I'm interested in AGG Homes real estate services. I'd like to discuss property opportunities.`,
            es: `¡Hola! Estoy interesado en los servicios inmobiliarios de AGG Homes. Me gustaría hablar sobre oportunidades de propiedades.`,
            nl: `Hallo! Ik ben geïnteresseerd in de vastgoeddiensten van AGG Homes. Ik zou graag praten over vastgoedmogelijkheden.`
        };

        const message = messages[language] || messages.en;
        const whatsappUrl = `https://wa.me/${this.whatsappNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;

        this.trackEvent('whatsapp_clicked', { language: language });
        window.open(whatsappUrl, '_blank');
    }

    // Session management
    initUserSession() {
        // Track session start
        if (!sessionStorage.getItem('agg_session_tracked')) {
            this.trackEvent('session_started');
            sessionStorage.setItem('agg_session_tracked', 'true');
        }

        // Track page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.trackEvent('page_hidden');
            } else {
                this.trackEvent('page_visible');
            }
        });

        // Track before page unload
        window.addEventListener('beforeunload', () => {
            this.trackEvent('session_ending');
        });
    }

    updateUnreadIndicator(count) {
        // Update any custom unread indicators
        const indicators = document.querySelectorAll('.intercom-unread-indicator');
        indicators.forEach(indicator => {
            if (count > 0) {
                indicator.textContent = count;
                indicator.style.display = 'block';
            } else {
                indicator.style.display = 'none';
            }
        });
    }

    // Event handling setup
    setupEventTracking() {
        // Track form submissions
        document.addEventListener('submit', (e) => {
            if (e.target.tagName === 'FORM') {
                const formId = e.target.id || 'unknown';
                this.trackEvent('form_submitted', { form_id: formId });

                // Increment form submissions
                const current = this.getFormSubmissions();
                localStorage.setItem('agg_form_submissions', (current + 1).toString());
            }
        });

        // Track link clicks
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                const href = e.target.href;
                if (href && (href.includes('mailto:') || href.includes('tel:'))) {
                    this.trackEvent('contact_clicked', {
                        type: href.includes('mailto:') ? 'email' : 'phone',
                        value: href
                    });
                }
            }
        });
    }

    // Public API methods
    showMessenger() {
        if (this.isIntercomLoaded) {
            window.Intercom('show');
        }
    }

    hideMessenger() {
        if (this.isIntercomLoaded) {
            window.Intercom('hide');
        }
    }

    shutdown() {
        if (this.isIntercomLoaded) {
            window.Intercom('shutdown');
            this.isIntercomLoaded = false;
        }
    }

    // Debug methods
    debugInfo() {
        return {
            isLoaded: this.isIntercomLoaded,
            appId: this.appId,
            userId: this.getOrCreateUserId(),
            visitCount: this.visitCount,
            leadScore: this.calculateLeadScore(),
            engagementLevel: this.getEngagementLevel()
        };
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    console.log('🏠 Initializing AGG Homes Chat System...');
    window.AGGChat = new AGGChatSystem();

    // Global debug functions
    window.debugIntercom = () => {
        console.log('Intercom Debug Info:', window.AGGChat.debugInfo());
        if (window.AGGChat.isIntercomLoaded) {
            window.Intercom('show');
        }
    };

    window.showMessenger = () => window.AGGChat.showMessenger();
    window.hideMessenger = () => window.AGGChat.hideMessenger();

    console.log('✅ AGG Chat System ready!');
    console.log('Available commands: debugIntercom(), showMessenger(), hideMessenger()');
});

// Export for manual initialization if needed
window.AGGChatSystem = AGGChatSystem;