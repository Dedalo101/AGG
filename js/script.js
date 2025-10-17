/* filepath: /workspaces/AGG/js/script.js */
/* Single-file behavior:
   - Remove/ignore other buttons (index.html contains only Get Started Today)
   - When Get Started is clicked, open an in-browser modal and run a simple canvas Snake game
   - Modal includes a Close button that stops the game
*/
(function(){
  'use strict';

  /* Create modal DOM (idempotent) */
  function ensureModal() {
    if (document.getElementById('snake-modal') && document.getElementById('snake-canvas')) return;
    var modal = document.getElementById('snake-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'snake-modal';
      modal.style.display = 'none';
      document.body.appendChild(modal);
    }
    modal.style.display = 'none';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.innerHTML = '\
      <div id="snake-wrap">\
        <canvas id="snake-canvas" width="400" height="300" tabindex="0"></canvas>\
        <div style="display:flex;flex-direction:column;gap:10px;align-items:flex-start">\
          <button id="snake-close">Close</button>\
          <div>Score: <span id="snake-score">0</span></div>\
        </div>\
      </div>';
  }

  /* Simple canvas Snake game */
  function SnakeGame(canvas, scoreEl) {
    var ctx = canvas.getContext('2d');
    var W = canvas.width, H = canvas.height;
    var cell = 20, cols = Math.floor(W/cell), rows = Math.floor(H/cell);
    var snake = [{x: Math.floor(cols/2), y: Math.floor(rows/2)}];
    var dir = {x:1,y:0};
    var food = randomFood();
    var running = false;
    var tick = null;
    var score = 0;

    function randomFood(){
      var p;
      do { p = {x: Math.floor(Math.random()*cols), y: Math.floor(Math.random()*rows)}; }
      while (snake.some(function(s){ return s.x===p.x && s.y===p.y; }));
      return p;
    }
    function draw(){
      ctx.fillStyle = '#000'; ctx.fillRect(0,0,W,H);
      ctx.fillStyle = '#0f0';
      snake.forEach(function(s){ ctx.fillRect(s.x*cell, s.y*cell, cell-1, cell-1); });
      ctx.fillStyle = '#f00';
      ctx.fillRect(food.x*cell, food.y*cell, cell-1, cell-1);
      if (scoreEl) scoreEl.textContent = score;
    }
    function step(){
      var head = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};
      if (head.x<0 || head.x>=cols || head.y<0 || head.y>=rows) return stop();
      if (snake.some(function(s){ return s.x===head.x && s.y===head.y; })) return stop();
      snake.unshift(head);
      if (head.x===food.x && head.y===food.y){ score++; food=randomFood(); }
      else snake.pop();
      draw();
    }
    function start(){
      if (running) return;
      running = true;
      tick = setInterval(step, 100);
      draw();
    }
    function stop(){
      running = false;
      if (tick) { clearInterval(tick); tick = null; }
    }
    function setDir(d){
      // ignore reverse direction
      if (d.x === -dir.x && d.y === -dir.y) return;
      dir = d;
    }
    function onKey(e){
      if (e.key === 'ArrowUp') setDir({x:0,y:-1});
      if (e.key === 'ArrowDown') setDir({x:0,y:1});
      if (e.key === 'ArrowLeft') setDir({x:-1,y:0});
      if (e.key === 'ArrowRight') setDir({x:1,y:0});
    }
    canvas.addEventListener('keydown', onKey);
    return {
      start: start,
      stop: stop,
      reset: function(){ stop(); snake=[{x:Math.floor(cols/2),y:Math.floor(rows/2)}]; dir={x:1,y:0}; food=randomFood(); score=0; draw(); },
      focus: function(){ canvas.focus(); }
    };
  }

  /* Open modal and run game */
  function openGameModal() {
    ensureModal();
    var modal = document.getElementById('snake-modal');
    var canvas = document.getElementById('snake-canvas');
    var scoreEl = document.getElementById('snake-score');
    var closeBtn = document.getElementById('snake-close');
    // create game instance
    var game = SnakeGame(canvas, scoreEl);
    function close() {
      try { game.stop(); } catch(e) {}
      modal.style.display = 'none';
    }
    // attach handlers (idempotent)
    closeBtn.onclick = function(){ close(); };
    modal.onclick = function(ev){ if (ev.target === modal) close(); };
    // show modal and start
    modal.style.display = 'flex';
    game.reset();
    // allow slight delay before focus/start
    setTimeout(function(){ try { game.start(); game.focus(); } catch(e){} }, 100);
  }

  /* Remove other buttons (defensive) and attach to the single CTA */
  function attachToCTA() {
    // remove any other elements that look like CTA buttons except the main one
    try {
      var all = Array.prototype.slice.call(document.querySelectorAll('a.cta-button, button.cta-button, .cta-button'));
      var main = document.getElementById('get-started') || (all.length? all[0] : null);
      // remove all except main
      all.forEach(function(el){
        if (el !== main) {
          try { el.parentNode && el.parentNode.removeChild(el); } catch(e){}
        }
      });
      if (!main) return;
      main.addEventListener('click', function(ev){
        ev.preventDefault();
        openGameModal();
      }, { passive: false });
    } catch(e) { /* non-fatal */ }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachToCTA);
  } else {
    attachToCTA();
  }
})();
