// filepath: /workspaces/AGG/js/script.js
// Consolidated site JS: form submit, CTA->#name focus, header link fix, inject Play/Run buttons

(function () {
  'use strict';

  // Form submit: POST via fetch, include readable cookies, then focus #question1
  function initFormHandler() {
    try {
      var form = document.querySelector('form');
      if (!form) return;
      if (!form.getAttribute('method')) form.setAttribute('method', 'POST');
      form.addEventListener('submit', function (ev) {
        ev.preventDefault();
        var fd = new FormData(form);
        try { fd.append('cookie_info', document.cookie || ''); } catch (e) {}
        var action = form.getAttribute('action') || window.location.href;
        if (window.fetch) {
          fetch(action, { method: 'POST', body: fd, credentials: 'include', headers: { 'Accept': 'application/json' } })
            .finally(function () {
              try { location.hash = '#question1'; var a = document.getElementById('question1'); if (a && typeof a.focus === 'function') a.focus(); } catch (e) {}
            });
        } else {
          form.submit();
        }
      }, { passive: false });
    } catch (e) { /* non-fatal */ }
  }

  // Delegated click handler: when CTA links to #name, scroll & focus the name input
  function initCtaToName() {
    try {
      document.addEventListener('click', function (ev) {
        try {
          var el = ev.target && ev.target.closest ? ev.target.closest('a.cta-button') : null;
          if (!el) return;
          var href = el.getAttribute('href') || '';
          if (href === '#name' || href.endsWith('#name')) {
            ev.preventDefault();
            var target = document.getElementById('name');
            if (target) {
              if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
              target.scrollIntoView({ behavior: 'smooth', block: 'center' });
              setTimeout(function () { try { target.focus(); } catch (e) { } }, 300);
            }
          }
        } catch (e) { /* ignore */ }
      }, false);
    } catch (e) { /* non-fatal */ }
  }

  // Header link fix: ensure header anchor opens blank.html in new tab
  function initHeaderLinkFix() {
    try {
      var a = document.querySelector('body > header > div > a');
      if (!a) return;
      a.setAttribute('href', '/blank.html');
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    } catch (e) { /* non-fatal */ }
  }

  // Inject Play/Run buttons under the first CTA. Play opens /game/; Run copies run command and opens /game/.
  function injectGameButtons() {
    try {
      var firstCTA = document.querySelector('a.cta-button, button.cta-button');
      if (!firstCTA || firstCTA._gameButtonsInjected) return;
      // create container
      var group = document.createElement('div');
      group.className = 'cta-game-group';
      group.style.display = 'inline-flex';
      group.style.gap = '8px';
      group.style.marginLeft = '8px';
      // Play Snake link
      var play = document.createElement('a');
      play.className = 'cta-button small';
      play.href = '/game/';
      play.target = '_blank';
      play.rel = 'noopener noreferrer';
      play.textContent = 'Play Snake';
      group.appendChild(play);
      // Run Game button (copies run command and opens /game/)
      var run = document.createElement('button');
      run.type = 'button';
      run.className = 'cta-button tiny';
      run.id = 'run-local-game';
      run.textContent = 'Run Game';
      run.addEventListener('click', function () {
        var cmd = 'pip install pygame && python3 /workspaces/AGG/game/snake.py';
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(cmd).then(function () {
            try { alert('Run command copied to clipboard:\\n\\n' + cmd); } catch (e) {}
          }, function () {
            try { prompt('Run command (copy manually):', cmd); } catch (e) {}
          });
        } else {
          try { prompt('Run command (copy manually):', cmd); } catch (e) {}
        }
        try { window.open('/game/', '_blank', 'noopener'); } catch (e) {}
      }, false);
      group.appendChild(run);
      firstCTA.parentNode.insertBefore(group, firstCTA.nextSibling);
      firstCTA._gameButtonsInjected = true;
    } catch (e) { /* non-fatal */ }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initFormHandler();
    initCtaToName();
    initHeaderLinkFix();
    injectGameButtons();
  });
})();
