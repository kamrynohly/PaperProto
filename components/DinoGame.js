// components/DinoGame.js
"use client";
import { useEffect, useRef } from "react";

export default function DinoGame() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    container.innerHTML = "";

    // create sandboxed iframe
    const iframe = document.createElement("iframe");
    Object.assign(iframe.style, {
      width: "100%",
      height: "100%",
      border: "none",
    });
    iframe.allow = "accelerometer; autoplay";
    iframe.title = "Dino Game";
    container.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <base href="/" />
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <link
    href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
    rel="stylesheet"
  />
  <style>
    :root {
      --bg: #171717;
      --fg: #ededed;
      --accent: #EC4899;
      --border: #6366F1;
      --shadow: #2D3748;
    }
    html, body {
      margin: 0; padding: 0;
      width: 100%; height: 100%;
      background: var(--bg);
      font-family: 'Press Start 2P', cursive;
      overflow: hidden;
    }
    .game-container {
      position: relative;
      width: 900px;    /* 600×1.5 */
      height: 300px;   /* taller */
      margin: auto;
      top: 50%; transform: translateY(-50%);
      background: #222;
      border: 4px solid var(--border);
      box-shadow: 4px 4px 0 var(--shadow), -4px -4px 0 var(--shadow);
      border-radius: 4px;
      overflow: hidden;
      image-rendering: pixelated;
    }
    .score {
      position: absolute;
      top: 8px; left: 50%;
      transform: translateX(-50%);
      color: var(--accent);
      text-shadow: 1px 1px 0 var(--border);
      font-size: 16px;
    }
    .ground {
      position: absolute;
      bottom: 0; width: 100%; height: 3px;
      background: var(--fg);
    }
    /* console.png as player, mirrored */
    #dino {
      position: absolute;
      bottom: 0; left: 100px;
      width: 66px;   /* 44×1.5 */
      height: 70px;  /* 47×1.5 */
      background: url('/console.png') no-repeat center/contain;
      transform: scaleX(-1);
    }
    .cactus {
      position: absolute;
      bottom: 0;
      width: 25px;   /* ~17×1.5 */
      background: var(--accent);
    }
    .cloud {
      position: absolute;
      width: 70px;   /* ~46×1.5 */
      height: 20px;  /* ~14×1.5 */
      background: var(--fg);
      opacity: 0.4;
      border-radius: 50%;
    }
    .start-message,
    .game-over {
      position: absolute;
      left: 50%; transform: translateX(-50%);
      color: var(--accent);
      text-shadow: 1px 1px 0 var(--border);
      text-align: center;
      font-size: 14px;
    }
    .start-message {
      top: 50%; transform: translate(-50%, -80px);
    }
    .game-over {
      top: 50%; transform: translate(-50%, -50%);
      display: none;
      font-size: 16px;
    }
    .restart-btn {
      display: block;
      margin: 8px auto 0;
      padding: 6px 12px;
      background: var(--border);
      color: #fff;
      border: none;
      box-shadow: 2px 2px 0 var(--shadow);
      font-family: 'Press Start 2P', cursive;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="game-container">
    <div class="score">Score: 0</div>
    <div class="ground"></div>
    <div id="dino"></div>
    <div class="start-message">PRESS SPACE OR TAP TO JUMP</div>
    <div class="game-over">
      GAME OVER
      <button class="restart-btn">RESTART</button>
    </div>
  </div>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const dino      = document.getElementById('dino');
      const container = document.querySelector('.game-container');
      const scoreEl   = document.querySelector('.score');
      const overEl    = document.querySelector('.game-over');
      const startEl   = document.querySelector('.start-message');
      const btn       = document.querySelector('.restart-btn');

      // physics & state
      let pos = 0,
          vel = 0,
          gravity = 0.5,       // slower falling
          speed = 5,
          score = 0,
          jumpsRemaining = 2,
          started = false,
          over = false;

      const cacti = [];
      const clouds = [];

      function jump() {
        if (over || jumpsRemaining === 0) return;
        if (!started) {
          started = true;
          startEl.style.display = 'none';
          loop();
        }
        vel = 12;
        jumpsRemaining--;
      }

      function spawnCactus() {
        if (over) return;
        setTimeout(() => {
          if (over) return;
          const c = document.createElement('div');
          c.className = 'cactus';
          // random height 60–110px
          const h = Math.random() * 60 + 60;
          c.style.height = h + 'px';
          container.appendChild(c);
          c.style.left = '900px';
          cacti.push(c);
          moveObstacle(c);
          spawnCactus();
        }, Math.random() * 3000 + 3000);
      }

      function spawnCloud() {
        if (over) return;
        setTimeout(() => {
          if (over) return;
          const cl = document.createElement('div');
          cl.className = 'cloud';
          container.appendChild(cl);
          cl.style.left = '900px';
          cl.style.top = (Math.random() * 200 + 20) + 'px';
          clouds.push(cl);
          moveCloud(cl);
          spawnCloud();
        }, Math.random() * 3000 + 5000);
      }

      function moveObstacle(el) {
        let x = 900;
        const ti = setInterval(() => {
          if (over) return clearInterval(ti);
          x -= speed;
          el.style.left = x + 'px';
          // collision zone
          if (x < 166 && x + el.offsetWidth > 100 && pos < 10) {
            return gameOver(ti);
          }
          if (x < -30) {
            el.remove();
            clearInterval(ti);
            score++;
            scoreEl.textContent = 'Score: ' + score;
            if (score % 10 === 0 && speed < 15) speed += 1;
          }
        }, 20);
      }

      function moveCloud(el) {
        let x = 900;
        const sp = speed * 0.3;
        const ti = setInterval(() => {
          if (over) return clearInterval(ti);
          x -= sp;
          el.style.left = x + 'px';
          if (x < -50) {
            el.remove();
            clearInterval(ti);
          }
        }, 20);
      }

      function loop() {
        // apply physics
        pos += vel;
        vel -= gravity;
        if (pos <= 0) {
          pos = 0;
          vel = 0;
          jumpsRemaining = 2;
        }
        dino.style.bottom = pos + 'px';
        if (!over) requestAnimationFrame(loop);
      }

      function gameOver(ti) {
        over = true;
        overEl.style.display = 'block';
        clearInterval(ti);
      }

      function restart() {
        // clear existing obstacles & clouds
        cacti.forEach(c => c.remove());
        clouds.forEach(c => c.remove());
        cacti.length = 0;
        clouds.length = 0;

        // reset state
        pos = 0; vel = 0; gravity = 0.5;
        speed = 5; score = 0;
        jumpsRemaining = 2;
        started = false; over = false;

        scoreEl.textContent = 'Score: 0';
        overEl.style.display = 'none';
        startEl.style.display = 'block';
        dino.style.bottom = '0px';

        // restart spawns
        spawnCactus();
        spawnCloud();
      }

      // initial spawns
      spawnCactus();
      spawnCloud();

      // input
      document.addEventListener('keydown', e => {
        if (e.code === 'Space') {
          e.preventDefault();
          over ? restart() : jump();
        }
      });
      document.addEventListener('touchstart', e => {
        e.preventDefault();
        over ? restart() : jump();
      });
      btn.addEventListener('click', restart);
    });
  </script>
</body>
</html>`);
    doc.close();

    return () => {
      container.innerHTML = "";
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full pixel-border crt-on scanline"
    />
  );
}
