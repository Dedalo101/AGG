# Quick Start Guide - Playwright Testing

## 5-Minute Setup

### 1. Install Everything

```bash
npm install && npm run test:install
```

### 2. Validate Setup

```bash
npm run validate-setup
```

You should see all checks pass with at most some warnings.

### 3. Run Your First Test

**Option A: Interactive Mode (Recommended)**
```bash
npm run test:ui
```

This opens a beautiful UI where you can:
- 👀 See all your tests
- ▶️ Run individual tests
- 🐛 Debug failures
- 📸 See screenshots and videos

**Option B: Headless Mode**
```bash
npm test
```

Runs all tests in the background.

### 4. View Results

```bash
npm run test:report
```

Opens an HTML report with:
- Test results
- Screenshots
- Videos
- Traces for debugging

## Common Commands

| What you want to do | Command |
|---------------------|---------|
| Run all tests | `npm test` |
| See tests run in browser | `npm run test:headed` |
| Interactive mode | `npm run test:ui` |
| Debug a failing test | `npm run test:debug` |
| Run specific browser | `npm run test:chromium` |
| Run mobile tests | `npm run test:mobile` |
| View last test report | `npm run test:report` |
| Check setup | `npm run validate-setup` |

## What's Being Tested?

✅ **Multi-language** - English, Spanish, Dutch versions work correctly
✅ **SEO** - Meta tags, structured data, hreflang tags
✅ **Language Switcher** - Can navigate between languages
✅ **Responsive** - Works on mobile, tablet, desktop
✅ **Accessibility** - Alt text, ARIA labels, semantic HTML
✅ **Performance** - Pages load quickly

## Test Files

- `tests/multi-language.spec.ts` - Language version tests
- `tests/seo-metadata.spec.ts` - SEO and metadata
- `tests/language-switcher.spec.ts` - Navigation between languages
- `tests/accessibility-responsive.spec.ts` - Accessibility and responsive

## Need Help?

1. **Setup issues?** Run `npm run validate-setup`
2. **Tests failing?** Run `npm run test:ui` to see what's happening
3. **Need more info?** Check [TESTING.md](TESTING.md)

## Pro Tips

💡 Use `npm run test:ui` for development - it's the best way to work with tests

💡 Tests run automatically on GitHub when you push (check the Actions tab)

💡 You can run specific tests: `npx playwright test tests/multi-language.spec.ts`

💡 Add `--grep "English"` to run only tests matching a pattern

## That's It!

You're ready to test. Happy testing! 🎉

For more details, see [TESTING.md](TESTING.md)
