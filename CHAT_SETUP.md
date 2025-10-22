# AGG Homes Chat System Configuration

## Intercom Setup Instructions

### Steps to Complete Setup:

1. **Get Your Intercom App ID**:
   - Go to your Intercom dashboard
   - Navigate to Settings → Installation 
   - Find your App ID (it looks like: `app_id: "abcd1234"`)

2. **Update the JavaScript**:
   - The App ID is already configured as `g28vli0s` in `/js/chat-system.js`

3. **Configure Intercom Settings** (Optional):
   - Customize the chat widget appearance in your Intercom dashboard
   - Set up automated welcome messages
   - Configure team member assignments

### WhatsApp Configuration:

- Phone number: `+31617622375` (already configured)
- Messages are automatically localized based on page language
- Works on all devices with WhatsApp installed

### Features Included:

✅ **Intercom Web Chat**
- Real-time messaging
- File sharing
- Automated responses
- Team management
- Mobile responsive

✅ **WhatsApp Integration** 
- Direct messaging to your business number
- Auto-populated messages with page context
- Language-specific greeting messages

✅ **Smart Chat Selector**
- Floating chat button
- Choice between web chat or WhatsApp
- Responsive design
- Pulse animation for attention

✅ **Multi-language Support**
- English, Spanish, Dutch messages
- Automatic language detection
- Localized chat options

### Files Added:

- `/js/chat-system.js` - Main chat functionality
- `/css/chat-system.css` - Chat system styling
- Updated all main HTML files with chat integration

### Testing:

1. **Intercom**: Test with your team members
2. **WhatsApp**: Click the button to verify message formatting
3. **Responsive**: Test on mobile devices

### Customization Options:

You can modify colors, positioning, and behavior by editing:
- Chat colors in `chat-system.css`
- Message templates in `chat-system.js`
- Button positioning and animations

### Support:

The chat system is ready to go with your Intercom App ID already configured!