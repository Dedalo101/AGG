# AGG Homes VS Code Configuration

This folder contains VS Code configuration files optimized for AGG Homes website development.

## 🚀 Quick Start

### Method 1: Using Launch Configurations (Recommended)
1. Press `F5` or go to **Run and Debug** (Ctrl+Shift+D)
2. Select one of these configurations:
   - **🏠 Launch AGG Homes Website** - Main homepage
   - **🎯 Launch Property Matching Page** - Property search system
   - **🌍 Launch Spanish Version** - Spanish language site
   - **🇳🇱 Launch Dutch Version** - Dutch language site
   - **💬 Debug Chat System** - For Intercom/WhatsApp debugging

### Method 2: Using Tasks
1. Press `Ctrl+Shift+P` and type "Tasks: Run Task"
2. Select **🏠 Quick Start AGG Development** to set up everything automatically

## 📁 Configuration Files

### `launch.json` - Debug Configurations
- **🏠 Launch AGG Homes Website**: Opens main site with dev tools
- **🎯 Launch Property Matching Page**: Direct access to property search
- **🌍/🇳🇱 Language Versions**: Quick access to localized sites
- **💬 Debug Chat System**: Specialized for chat debugging
- **🧪 Run Playwright Tests**: Execute test suite
- **🔗 Attach to Chrome**: Connect to running Chrome instance

### `tasks.json` - Build and Development Tasks
- **Start Python HTTP Server**: Launches development server on port 8000
- **Stop Python HTTP Server**: Cleanly stops the server
- **Install Dependencies**: Runs npm install
- **Run Playwright Tests**: Execute test suite with server
- **Validate Setup**: Runs project validation
- **Deploy to GitHub Pages**: Push changes to production

### `settings.json` - Project Settings
- Optimized for HTML/CSS/JavaScript development
- Auto-save and formatting configurations
- File associations and exclusions
- Git integration settings
- Debugging preferences

### `extensions.json` - Recommended Extensions
Essential extensions for AGG development:
- **Live Server**: Real-time preview
- **Playwright**: Testing framework
- **GitLens**: Enhanced git capabilities
- **Auto Rename Tag**: HTML productivity
- **CSS Peek**: Quick CSS navigation

## 🔧 Development Workflow

### 1. Start Development
```bash
# Option A: Use VS Code task
Ctrl+Shift+P → "Tasks: Run Task" → "🏠 Quick Start AGG Development"

# Option B: Manual start
python -m http.server 8000
```

### 2. Launch Debugging
```bash
# Press F5 and select desired configuration
```

### 3. Test Your Changes
```bash
# Use launch configuration "🧪 Run Playwright Tests"
# Or run manually: npm test
```

### 4. Debug Chat System
```bash
# Use "💬 Debug Chat System" configuration
# Then in browser console:
debugIntercom()      # Test Intercom chat
restartIntercom()    # Restart if issues
```

## 🎯 Debugging Features

### Chat System Debugging
- **Automatic DevTools**: Opens with console ready
- **Intercom Testing**: Built-in debug functions
- **Network Monitoring**: Check for failed requests
- **Multi-language Testing**: Quick language switching

### Property Matching Debugging
- **Direct Page Access**: Skip navigation
- **Form Testing**: Test property filters
- **API Simulation**: Mock data validation

### Cross-Language Testing
- **Spanish Site**: Full localization testing
- **Dutch Site**: Multi-language validation
- **URL Structure**: Language path verification

## 📱 Mobile Testing

### Responsive Debugging
```bash
# Launch with mobile emulation
F12 → Toggle Device Toolbar (Ctrl+Shift+M)
```

### Chat Mobile Testing
- Test chat bubble positioning
- Verify WhatsApp integration
- Check responsive chat options

## 🧪 Testing Integration

### Playwright Configuration
- **Headed Mode**: Visual test execution
- **UI Mode**: Interactive test runner
- **Debug Mode**: Step-through debugging
- **Report Generation**: Comprehensive test reports

### Test Scenarios Covered
- ✅ Chat system functionality
- ✅ Property matching system
- ✅ Multi-language navigation
- ✅ Form submissions
- ✅ Responsive design
- ✅ SEO metadata validation

## 🔍 Troubleshooting

### Common Issues

#### Server Won't Start
```bash
# Check if port 8000 is in use
netstat -ano | findstr :8000
# Kill conflicting process if needed
taskkill /F /PID <process_id>
```

#### Chat System Issues
```bash
# Use debug configuration and check:
1. Network tab for failed Intercom requests
2. Console for JavaScript errors
3. debugIntercom() function output
```

#### Tests Failing
```bash
# Validate setup first
npm run validate-setup
# Then run tests with verbose output
npm run test:debug
```

## 📈 Performance Optimization

### Development Settings
- **Auto-save**: Reduces manual saving
- **File watching**: Excludes unnecessary directories
- **Search optimization**: Focuses on relevant files
- **Git integration**: Streamlined workflow

### Debugging Performance
- **Background tasks**: Server runs automatically
- **Smart reloading**: Only reloads when needed
- **Efficient DevTools**: Pre-configured for debugging

## 🚀 Production Deployment

### Pre-deployment Checklist
1. Run all tests: `npm test`
2. Validate setup: `npm run validate-setup`
3. Check chat functionality: Use "💬 Debug Chat System"
4. Test property matching: Use "🎯 Launch Property Matching Page"
5. Verify multi-language: Test all language versions

### Deploy
```bash
# Use task or manual push
git push origin main  # Deploys to GitHub Pages
```

## 🎨 Customization

### Adding New Launch Configurations
```json
{
    "type": "chrome",
    "request": "launch",
    "name": "Your Custom Config",
    "url": "http://localhost:8000/your-page",
    "webRoot": "${workspaceFolder}",
    "preLaunchTask": "Start Python HTTP Server"
}
```

### Adding New Tasks
```json
{
    "label": "Your Custom Task",
    "type": "shell",
    "command": "your-command",
    "group": "build"
}
```

---

**🎯 Ready for Development!**

Your VS Code is now optimized for AGG Homes development with comprehensive debugging, testing, and deployment capabilities.