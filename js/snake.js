/* simple canvas snake game and hookup to first .cta-button */
(function(){
  'use strict';
  // Create modal DOM (idempotent)
  if (!document.getElementById('snake-modal')) {
    var modal = document.createElement('div');
    modal.id = 'snake-modal';
    modal.style.display = 'none';
    modal.innerHTML = '\
      <div id="snake-wrap">\
        <canvas id="snake-canvas" width="400" height="300"></canvas>\
        <div style="display:flex;flex-direction:column;gap:6px">\
          <button id="snake-close">Close</button>\
          <div style="color:#fff">Score: <span id="snake-score">0</span></div>\
        </div>\
      </div>';
    document.body.appendChild(modal);
  }
  // inject CSS link if not present
  try {
    if (!document.querySelector("link[data-snake-css]")) {
      var l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = '/js/snake.css';
      l.setAttribute('data-snake-css','1');
      document.head.appendChild(l);
    }
  } catch(e){}

  // Snake game implementation
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
      while (snake.some(s => s.x===p.x && s.y===p.y));
      return p;
    }
    function draw(){
      ctx.fillStyle = '#000'; ctx.fillRect(0,0,W,H);
      ctx.fillStyle = '#0f0';
      snake.forEach(s=> ctx.fillRect(s.x*cell, s.y*cell, cell-1, cell-1));
      ctx.fillStyle = '#f00';
      ctx.fillRect(food.x*cell, food.y*cell, cell-1, cell-1);
      if (scoreEl) scoreEl.textContent = score;
    }
    function step(){
      var head = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};
      if (head.x<0 || head.x>=cols || head.y<0 || head.y>=rows) return stop();
      if (snake.some(s=>s.x===head.x && s.y===head.y)) return stop();
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
      if (tick) clearInterval(tick);
    }
    function setDir(d){
      if ((d.x !== -dir.x || d.y !== -dir.y)) dir = d;
    }
    // keyboard
    function onKey(e){
      if (e.key==='ArrowUp') setDir({x:0,y:-1});
      if (e.key==='ArrowDown') setDir({x:0,y:1});
      if (e.key==='ArrowLeft') setDir({x:-1,y:0});
      if (e.key==='ArrowRight') setDir({x:1,y:0});
    }
    canvas.tabIndex = 0;
    canvas.addEventListener('keydown', onKey);
    return { start: start, stop: stop, reset: function(){ stop(); snake=[{x:Math.floor(cols/2),y:Math.floor(rows/2)}]; dir={x:1,y:0}; food=randomFood(); score=0; draw(); }, focus:function(){ canvas.focus(); } };
  }

  // Hook modal open/close and CTA
  function attach() {
    var modal = document.getElementById('snake-modal');
    if (!modal) return;
    var canvas = document.getElementById('snake-canvas');
    var scoreEl = document.getElementById('snake-score');
    var closeBtn = document.getElementById('snake-close');
    var game = SnakeGame(canvas, scoreEl);

    function openModal(){
      modal.style.display = 'flex';
      game.reset();
      setTimeout(function(){ game.start(); game.focus(); }, 100);
    }
    function closeModal(){
      modal.style.display = 'none';
      try { game.stop(); } catch(e){}
    }
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(ev){
      if (ev.target===modal) closeModal();
    });

    // Attach to first CTA button
    var cta = document.querySelector('a.cta-button, button.cta-button');
    if (cta) {
      cta.addEventListener('click', function(ev){
        ev.preventDefault();
        openModal();
      }, {passive:false});
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', attach);
  else attach();
})();
