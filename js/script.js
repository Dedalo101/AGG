// Form validation
document.getElementById('contact-form').addEventListener('submit', function(e) {
  const name = this.querySelector('input[name="name"]') .value.trim();
  const email = this.querySelector('input[name="email"]').value.trim();
  const phone = this.querySelector('input[name="phone"]').value.trim();
  const propertyType = this.querySelector('select[name="property-type"]').value;
  const budget = this.querySelector('select[name="budget"]').value;

  if (!name || !email || !phone || !propertyType || !budget) {
    e.preventDefault();
    alert('Please fill all required fields.');
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    e.preventDefault();
    alert('Invalid email.');
  } else if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
    e.preventDefault();
    alert('Invalid phone number.');
  }
});