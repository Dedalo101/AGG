document.addEventListener("DOMContentLoaded",()=>{const e=document.querySelector("form");e.addEventListener("submit",t=>{const n=e.name.value.trim(),r=e.email.value.trim();n&&r||(alert("Please fill required fields."),t.preventDefault())})});// /* fix-form-redirect marker */
// Adds POST submit via fetch and redirects/focuses the first question anchor (#question1)
document.addEventListener(DOMContentLoaded, function () {
  try {
    var form = document.querySelector(form);
    if (!form) return;
    // ensure method attribute present
    try { if (!form.getAttribute(method)) form.setAttribute(method,POST); } catch(e){}
    form.addEventListener(submit, function (ev) {
      ev.preventDefault();
      var action = form.getAttribute(action) || window.location.href;
      var formData = new FormData(form);
      // POST using fetch and expect JSON (Formspree accepts Accept: application/json)
      fetch(action, {
        method: POST,
        body: formData,
        headers: { Accept: application/json }
      }).then(function (res) {
        // Always redirect/focus the first question anchor after response
        try {
          location.hash = #question1;
          var anchor = document.getElementById(question1);
          if (anchor && typeof anchor.focus === function) anchor.focus();
        } catch (e) { /* ignore */ }
      }).catch(function () {
        // on error still jump to the first question so user can retry
        try { location.hash = #question1; } catch (e) {}
      });
    }, { passive: false });
  } catch (err) { /* non-fatal */ }
});
