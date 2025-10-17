// ...existing code...
document.addEventListener("DOMContentLoaded", function () {
  try {
    var form = document.querySelector("form");
    if (!form) return;
    if (!form.getAttribute("method")) form.setAttribute("method", "POST");

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var formData = new FormData(form);

      // Append readable cookies (HttpOnly cookies are not accessible)
      var cookieInfo = "";
      try { cookieInfo = document.cookie || ""; } catch (e) { cookieInfo = ""; }
      formData.append("cookie_info", cookieInfo);

      var action = form.getAttribute("action") || window.location.href;

      // Send with credentials so same-origin cookies are included
      if (window.fetch) {
        fetch(action, {
          method: "POST",
          body: formData,
          credentials: "include",
          headers: { "Accept": "application/json" }
        }).then(function () {
          try { location.hash = "#question1"; var a = document.getElementById("question1"); if (a && typeof a.focus === "function") a.focus(); } catch (e) {}
        }).catch(function () {
          try { location.hash = "#question1"; } catch (e) {}
        });
      } else {
        // Fallback: native submit
        form.submit();
      }
    }, { passive: false });
  } catch (err) { /* non-fatal */ }
});

// /* cta-to-name marker */
// When a CTA with class "cta-button" pointing to #name is clicked, scroll/focus the name input.
// If original Formspree URL was stored in data-original-href, we keep it available but do not navigate.
document.addEventListener('click', function (ev) {
  try {
    var a = ev.target.closest && ev.target.closest('a.cta-button');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href === '#name' || href.endsWith('#name')) {
      ev.preventDefault();
      var target = document.getElementById('name');
      if (target) {
        // make sure element is focusable
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex','-1');
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // focus after short delay to allow scroll animation
        setTimeout(function(){ try { target.focus(); } catch(e){} }, 300);
      }
      // optional: if you want to also submit or navigate to original Formspree after focusing,
      // uncomment the following lines to POST the form programmatically:
      //
      // var orig = a.getAttribute('data-original-href');
      // if (orig) {
      //   var form = document.querySelector('form');
      //   if (form) {
      //     var fd = new FormData(form);
      //     fd.append('cta_clicked', 'get-started');
      //     fetch(orig, { method: 'POST', body: fd, credentials: 'include', headers: { 'Accept': 'application/json' } });
      //   } else {
      //     // fallback: open original in new tab without navigating current page
      //     window.open(orig, '_blank', 'noopener');
      //   }
      // }
    }
  } catch (err) {}
}, false);

// /* cta-to-name marker */
// When a CTA with class "cta-button" pointing to #name is clicked, scroll/focus the name input.
// If original Formspree URL was stored in data-original-href, we keep it available but do not navigate.
document.addEventListener('click', function (ev) {
  try {
    var a = ev.target.closest && ev.target.closest('a.cta-button');
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (href === '#name' || href.endsWith('#name')) {
      ev.preventDefault();
      var target = document.getElementById('name');
      if (target) {
        // make sure element is focusable
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex','-1');
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // focus after short delay to allow scroll animation
        setTimeout(function(){ try { target.focus(); } catch(e){} }, 300);
      }
      // optional: if you want to also submit or navigate to original Formspree after focusing,
      // uncomment the following lines to POST the form programmatically:
      //
      // var orig = a.getAttribute('data-original-href');
      // if (orig) {
      //   var form = document.querySelector('form');
      //   if (form) {
      //     var fd = new FormData(form);
      //     fd.append('cta_clicked', 'get-started');
      //     fetch(orig, { method: 'POST', body: fd, credentials: 'include', headers: { 'Accept': 'application/json' } });
      //   } else {
      //     // fallback: open original in new tab without navigating current page
      //     window.open(orig, '_blank', 'noopener');
      //   }
      // }
    }
  } catch (err) {}
}, false);
// /* header-link-fix */
// Ensure /html/body/header/div/a links to /blank.html and opens in a new tab
document.addEventListener('DOMContentLoaded', function () {
  try {
    var a = document.querySelector('body > header > div > a');
    if (!a) return;
    a.setAttribute('href', '/blank.html');
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
  } catch (e) { /* non-fatal */ }
});
