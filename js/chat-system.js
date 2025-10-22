/**
 * AGG Homes Chat Integration
 * Official Intercom SDK implementation and WhatsApp integration
 * Updated to use Intercom's recommended SDK approach
 */

class AGGChatSystem {
    constructor() {
        this.whatsappNumber = '+31617622375'; // Your phone number
        this.appId = 'g28vli0s'; // Intercom App ID
        this.isIntercomLoaded = false;
        this.init();
    }

    init() {
        console.log('Initializing AGG Chat System with Official Intercom SDK...');

        // Load Intercom SDK and initialize
        this.loadIntercomSDK();

        // Initialize WhatsApp button
        this.initWhatsApp();

        // Add chat toggle functionality
        this.addChatToggle();

        // Debug information
        console.log('Chat system initialized with App ID:', this.appId);
    }

    loadIntercomSDK() {
        // Load the official Intercom widget script
        if (document.getElementById('intercom-script')) {
            console.log('Intercom script already loaded');
            this.initializeIntercom();
            return;
        }

        // First load the Intercom settings
        window.intercomSettings = {
            app_id: this.appId,
            hide_default_launcher: false
        };

        // Load the Intercom widget script
        const script = document.createElement('script');
        script.id = 'intercom-script';
        script.async = true;
        script.src = `https://widget.intercom.io/widget/${this.appId}`;

        script.onload = () => {
            console.log('Intercom widget loaded successfully');
            setTimeout(() => {
                this.initializeIntercom();
            }, 500);
        };

        script.onerror = () => {
            console.error('Failed to load Intercom widget');
            // Try alternative loading method
            this.loadIntercomAlternative();
        };

        document.head.appendChild(script);
    }

    loadIntercomAlternative() {
        // Alternative Intercom loading method
        (function () { var w = window; var ic = w.Intercom; if (typeof ic === "function") { ic('reattach_activator'); ic('update', w.intercomSettings); } else { var d = document; var i = function () { i.c(arguments); }; i.q = []; i.c = function (args) { i.q.push(args); }; w.Intercom = i; var l = function () { var s = d.createElement('script'); s.type = 'text/javascript'; s.async = true; s.src = 'https://widget.intercom.io/widget/' + window.intercomSettings.app_id; var x = d.getElementsByTagName('script')[0]; x.parentNode.insertBefore(s, x); }; if (document.readyState === 'complete') { l(); } else if (w.attachEvent) { w.attachEvent('onload', l); } else { w.addEventListener('load', l, false); } } })();

        setTimeout(() => {
            this.initializeIntercom();
        }, 1000);
    }

    initializeIntercom() {
        // Initialize Intercom with the official SDK approach
        if (typeof window.Intercom !== 'undefined') {
            console.log('Initializing Intercom with SDK...');

            // Get user data dynamically
            const userData = this.getUserData();

            // Configure Intercom
            window.Intercom('boot', {
                app_id: this.appId,
                user_id: userData.user_id,
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                created_at: userData.created_at,
                company: {
                    name: "AGG Homes Website Visitor",
                    company_id: "agg-homes-web"
                },
                custom_attributes: {
                    source: "agg-homes-website",
                    page_url: window.location.href,
                    page_path: window.location.pathname,
                    language: this.detectLanguage(),
                    user_agent: navigator.userAgent,
                    referrer: document.referrer || 'direct'
                }
            });

            this.isIntercomLoaded = true;
            console.log('Intercom initialized successfully');

            // Set up event listeners
            this.setupIntercomEventListeners();
        }
    }

    getUserData() {
        // Generate or retrieve user data
        let userData = {
            user_id: this.generateOrGetUserId(),
            name: this.getUserName() || 'Website Visitor',
            email: this.getUserEmail() || '',
            phone: this.getUserPhone() || '',
            created_at: this.getOrSetUserCreatedAt()
        };

        console.log('User data for Intercom:', userData);
        return userData;
    }

    generateOrGetUserId() {
        // Try to get existing user ID from localStorage or generate new one
        let userId = localStorage.getItem('agg_user_id');
        if (!userId) {
            userId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
            localStorage.setItem('agg_user_id', userId);
        }
        return userId;
    }

    getOrSetUserCreatedAt() {
        // Get or set user creation timestamp
        let createdAt = localStorage.getItem('agg_user_created_at');
        if (!createdAt) {
            createdAt = Math.floor(Date.now() / 1000); // Unix timestamp in seconds
            localStorage.setItem('agg_user_created_at', createdAt);
        }
        return parseInt(createdAt);
    }

    setupIntercomEventListeners() {
        // Listen for Intercom events
        window.Intercom('onShow', () => {
            console.log('Intercom messenger opened');
            this.hideOptions();
        });

        window.Intercom('onHide', () => {
            console.log('Intercom messenger closed');
        });

        window.Intercom('onUnreadCountChanged', (unreadCount) => {
            console.log('Intercom unread count:', unreadCount);
            // You could update UI to show unread message indicator
        });
    }

    initWhatsApp() {
        // Create WhatsApp chat button
        const whatsappButton = document.createElement('div');
        whatsappButton.id = 'whatsapp-chat-btn';
        whatsappButton.innerHTML = `
            <div class="whatsapp-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.515z"/>
                </svg>
                <span>WhatsApp</span>
            </div>
        `;

        whatsappButton.onclick = () => this.openWhatsApp();
        document.body.appendChild(whatsappButton);
    }

    addChatToggle() {
        // Create chat selector widget
        const chatSelector = document.createElement('div');
        chatSelector.id = 'chat-selector';
        chatSelector.innerHTML = `
            <div class="chat-selector-btn" id="chat-toggle">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4v3c0 .6.4 1 1 1 .2 0 .5-.1.7-.3L14.4 18H20c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"/>
                </svg>
                <span>Chat</span>
            </div>
            <div class="chat-options" id="chat-options" style="display: none;">
                <button class="chat-option" onclick="AGGChat.openPropertyMatching()">
                    <span class="property-icon">🏠</span>
                    Property Matching
                </button>
                <button class="chat-option" onclick="AGGChat.startIntercom()">
                    <span class="intercom-icon">💬</span>
                    Web Chat
                </button>
                <button class="chat-option" onclick="AGGChat.openWhatsApp()">
                    <span class="whatsapp-icon">📱</span>
                    WhatsApp
                </button>
            </div>
        `;

        document.body.appendChild(chatSelector);

        // Toggle functionality
        document.getElementById('chat-toggle').onclick = () => {
            const options = document.getElementById('chat-options');
            options.style.display = options.style.display === 'none' ? 'block' : 'none';
        };
    }

    startIntercom() {
        console.log('Starting Intercom chat...');

        // Hide options first
        this.hideOptions();

        // Check if Intercom is loaded and available
        if (this.isIntercomLoaded && typeof window.Intercom === 'function') {
            console.log('Showing Intercom messenger');

            // Update user data if form fields have been filled
            this.updateUserData();

            // Show the messenger
            window.Intercom('show');
        } else {
            console.log('Intercom not ready yet, attempting to initialize...');

            // Try to reinitialize if not loaded
            if (typeof window.Intercom === 'function') {
                this.updateUserData();
                window.Intercom('show');
            } else {
                // Fallback: reload Intercom SDK
                setTimeout(() => {
                    if (typeof window.Intercom === 'function') {
                        this.updateUserData();
                        window.Intercom('show');
                    } else {
                        console.error('Intercom failed to load. Check your network connection.');
                        alert('Chat service is temporarily unavailable. Please try WhatsApp or contact us directly at +31617622375');
                    }
                }, 2000);
            }
        }
    }

    updateUserData() {
        // Update Intercom with latest user data from forms
        if (typeof window.Intercom === 'function' && this.isIntercomLoaded) {
            const userData = this.getUserData();

            window.Intercom('update', {
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                custom_attributes: {
                    source: "agg-homes-website",
                    page_url: window.location.href,
                    page_path: window.location.pathname,
                    language: this.detectLanguage(),
                    last_active: Math.floor(Date.now() / 1000)
                }
            });

            console.log('Updated Intercom user data:', userData);
        }
    }

    openWhatsApp() {
        const message = this.getWhatsAppMessage();
        const url = `https://wa.me/${this.whatsappNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
        this.hideOptions();
    }

    openPropertyMatching() {
        console.log('Opening Property Matching system...');
        this.hideOptions();

        // Navigate to property matching page
        const currentPath = window.location.pathname;
        let targetPath = '/property-matching.html';

        // Detect language and adjust path accordingly
        if (currentPath.includes('/es/')) {
            targetPath = '/es/property-matching.html';
        } else if (currentPath.includes('/nl/')) {
            targetPath = '/nl/property-matching.html';
        }

        window.location.href = targetPath;
    }

    getWhatsAppMessage() {
        const language = this.detectLanguage();

        const messages = {
            es: `Hola! Estoy interesado en sus servicios inmobiliarios en Costa del Sol. Estoy navegando en: ${window.location.href}`,
            nl: `Hallo! Ik ben geïnteresseerd in uw vastgoeddiensten in Costa del Sol. Ik bekijk: ${window.location.href}`,
            en: `Hello! I'm interested in your real estate services in Costa del Sol. I'm browsing: ${window.location.href}`
        };

        return messages[language] || messages.en;
    }

    hideOptions() {
        const chatOptions = document.getElementById('chat-options');
        if (chatOptions) {
            chatOptions.style.display = 'none';
        }
    }

    getUserName() {
        // Try to get user name from form data or return empty
        const nameField = document.querySelector('input[name="name"], #name');
        return nameField ? nameField.value.trim() : '';
    }

    getUserEmail() {
        // Try to get user email from form data or return empty
        const emailField = document.querySelector('input[name="email"], #email');
        return emailField ? emailField.value.trim() : '';
    }

    getUserPhone() {
        // Try to get user phone from form data or return empty
        const phoneField = document.querySelector('input[name="phone"], #phone');
        return phoneField ? phoneField.value.trim() : '';
    }

    detectLanguage() {
        const path = window.location.pathname;
        if (path.includes('/es/')) return 'es';
        if (path.includes('/nl/')) return 'nl';
        return 'en';
    }

    // Debug method to test Intercom status
    debugIntercom() {
        console.log('=== Intercom Debug Info (Updated SDK) ===');
        console.log('App ID:', this.appId);
        console.log('Intercom function available:', typeof window.Intercom);
        console.log('Is loaded:', this.isIntercomLoaded);
        console.log('User ID:', this.generateOrGetUserId());
        console.log('User data:', this.getUserData());
        console.log('Current language:', this.detectLanguage());
        console.log('Page URL:', window.location.href);

        if (typeof window.Intercom === 'function') {
            console.log('Attempting to show Intercom...');
            this.updateUserData();
            window.Intercom('show');
        } else {
            console.log('Intercom not available - checking SDK load status');
        }
        console.log('=========================================');
    }

    // Utility method to restart Intercom if needed
    restartIntercom() {
        console.log('Restarting Intercom...');
        this.isIntercomLoaded = false;

        if (typeof window.Intercom === 'function') {
            window.Intercom('shutdown');
        }

        setTimeout(() => {
            this.loadIntercomSDK();
        }, 1000);
    }
}

// Initialize chat system when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded, initializing AGG Chat System with Official Intercom SDK...');
    window.AGGChat = new AGGChatSystem();

    // Add global debug functions
    window.debugIntercom = () => window.AGGChat.debugIntercom();
    window.restartIntercom = () => window.AGGChat.restartIntercom();

    console.log('Chat system ready with Official Intercom SDK!');
    console.log('Available debug commands:');
    console.log('- debugIntercom() - Check Intercom status and show messenger');
    console.log('- restartIntercom() - Restart Intercom if having issues');
});

// Export for manual initialization if needed
window.AGGChatSystem = AGGChatSystem;