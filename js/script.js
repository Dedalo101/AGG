// Form validation
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    form.addEventListener('submit', (e) => {
        const name = form.name.value.trim();
        const email = form.email.value.trim();
        if (!name || !email) {
            alert('Please fill required fields.');
            e.preventDefault();
        }
    });
});
// Integration Notes:
// 1. Formspree: Replace action URL with your form endpoint (sign up at formspree.io, get ID).
// 2. Airtable: In Formspree dashboard, add Airtable plugin; enter API key, base ID, table name, map fields (e.g., name to "Name").
// 3. Zapier/HubSpot: Create Zap with Formspree trigger > Airtable action (optional) > HubSpot "Create Contact" action (use API key in Zapier).