(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/lib/firebase.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// lib/firebase.js
__turbopack_context__.s({
    "auth": (()=>auth),
    "db": (()=>db),
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/app/dist/esm/index.esm.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@firebase/app/dist/esm/index.esm2017.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2d$c92d61ad$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__p__as__getAuth$3e$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/esm2017/index-c92d61ad.js [app-client] (ecmascript) <export p as getAuth>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm2017.js [app-client] (ecmascript)");
;
;
;
// Our Firebase configuration
const firebaseConfig = {
    apiKey: ("TURBOPACK compile-time value", "AIzaSyB6HfpAaXBkE2izy-VLEm8brcBzfL02hW8"),
    authDomain: ("TURBOPACK compile-time value", "paperproto.firebaseapp.com"),
    projectId: ("TURBOPACK compile-time value", "paperproto"),
    storageBucket: ("TURBOPACK compile-time value", "paperproto.firebasestorage.app"),
    messagingSenderId: ("TURBOPACK compile-time value", "958983830867"),
    appId: ("TURBOPACK compile-time value", "1:958983830867:web:267bf4c8acc89f454435a6"),
    measurementId: ("TURBOPACK compile-time value", "G-TET9X9P4FT")
};
// Initialize Firebase only if it hasn't been initialized yet
let firebaseApp;
if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getApps"])().length) {
    firebaseApp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["initializeApp"])(firebaseConfig);
} else {
    firebaseApp = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getApps"])()[0];
}
const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm2017$2f$index$2d$c92d61ad$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__p__as__getAuth$3e$__["getAuth"])(firebaseApp);
const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFirestore"])(firebaseApp);
const __TURBOPACK__default__export__ = firebaseApp;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/BottomNavigation.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const BottomNavigation = ()=>{
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "BottomNavigation.useEffect": ()=>{
            setMounted(true);
        }
    }["BottomNavigation.useEffect"], []);
    if (!mounted) {
        return null;
    }
    const tabs = [
        {
            name: 'Community',
            href: '/community',
            iconSrc: '/arcade.png',
            alt: 'Community Icon'
        },
        {
            name: 'Create',
            href: '/create',
            iconSrc: '/console.png',
            alt: 'Create Icon'
        },
        {
            name: 'Profile',
            href: '/profile',
            iconSrc: '/profile.png',
            alt: 'Profile Icon'
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed bottom-0 left-0 right-0 h-16 bg-gray-900 border-t-4 border-indigo-600 flex items-center justify-around z-50 shadow-lg",
        children: tabs.map((tab)=>{
            const isActive = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: tab.href,
                className: `flex flex-col items-center justify-center w-full h-full transition-transform duration-200 hover:scale-110 ${isActive ? 'text-pink-500 relative after:content-[""] after:absolute after:bottom-0 after:left-1/4 after:right-1/4 after:h-1' : 'text-gray-400 hover:text-indigo-400'}`,
                style: {
                    textShadow: isActive ? '0px 0px 6px rgba(236, 72, 153, 0.6)' : 'none'
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `p-1 ${isActive ? 'bg-gray-700 rounded-md border-2 border-indigo-500' : ''}`,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        src: tab.iconSrc,
                        alt: tab.alt,
                        width: 32,
                        height: 32,
                        className: "object-contain",
                        priority: true
                    }, void 0, false, {
                        fileName: "[project]/components/BottomNavigation.js",
                        lineNumber: 60,
                        columnNumber: 15
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/BottomNavigation.js",
                    lineNumber: 59,
                    columnNumber: 13
                }, this)
            }, tab.name, false, {
                fileName: "[project]/components/BottomNavigation.js",
                lineNumber: 47,
                columnNumber: 11
            }, this);
        })
    }, void 0, false, {
        fileName: "[project]/components/BottomNavigation.js",
        lineNumber: 42,
        columnNumber: 5
    }, this);
};
_s(BottomNavigation, "qIOWh+H4KANmZw/Ng5wnr7tzXF0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = BottomNavigation;
const __TURBOPACK__default__export__ = BottomNavigation;
var _c;
__turbopack_context__.k.register(_c, "BottomNavigation");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/DinoGame.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// components/DinoGame.js
__turbopack_context__.s({
    "default": (()=>DinoGame)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
function DinoGame() {
    _s();
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DinoGame.useEffect": ()=>{
            const container = containerRef.current;
            container.innerHTML = "";
            // create sandboxed iframe
            const iframe = document.createElement("iframe");
            Object.assign(iframe.style, {
                width: "100%",
                height: "100%",
                border: "none"
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
        }, Math.random() * 3000 + 1000);
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
        }, Math.random() * 3000 + 2000);
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
            return ({
                "DinoGame.useEffect": ()=>{
                    container.innerHTML = "";
                }
            })["DinoGame.useEffect"];
        }
    }["DinoGame.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: containerRef,
        className: "w-full h-full pixel-border crt-on scanline"
    }, void 0, false, {
        fileName: "[project]/components/DinoGame.js",
        lineNumber: 309,
        columnNumber: 5
    }, this);
}
_s(DinoGame, "8puyVO4ts1RhCfXUmci3vLI3Njw=");
_c = DinoGame;
var _c;
__turbopack_context__.k.register(_c, "DinoGame");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/GameDisplay.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>GameDisplay)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
// components/GameDisplay.js
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DinoGame$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/DinoGame.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function GameDisplay({ gameCode, gameType, loading }) {
    _s();
    const [gameTitle, setGameTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const gameContainerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const iframeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Update display title when gameType changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GameDisplay.useEffect": ()=>{
            if (gameType) {
                const formattedType = gameType.split('-').map({
                    "GameDisplay.useEffect.formattedType": (w)=>w.charAt(0).toUpperCase() + w.slice(1)
                }["GameDisplay.useEffect.formattedType"]).join(' ');
                setGameTitle(formattedType);
            }
        }
    }["GameDisplay.useEffect"], [
        gameType
    ]);
    // Render the generated game into an iframe
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GameDisplay.useEffect": ()=>{
            if (!gameCode || !gameContainerRef.current) return;
            try {
                // Clear previous content
                gameContainerRef.current.innerHTML = '';
                if (iframeRef.current) iframeRef.current.remove();
                // Create sandbox iframe
                const iframe = document.createElement('iframe');
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.style.border = 'none';
                iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
                iframe.title = gameTitle || 'Game';
                iframeRef.current = iframe;
                gameContainerRef.current.appendChild(iframe);
                // Extract HTML, CSS, JS from the generated code
                let htmlContent = '', cssContent = '', jsContent = '';
                const htmlMatch = gameCode.match(/<html[^>]*>([\s\S]*)<\/html>/i);
                const bodyMatch = gameCode.match(/<body[^>]*>([\s\S]*)<\/body>/i);
                const cssMatch = gameCode.match(/<style[^>]*>([\s\S]*)<\/style>/i);
                const jsMatch = gameCode.match(/<script[^>]*>([\s\S]*)<\/script>/i);
                if (htmlMatch) htmlContent = htmlMatch[1];
                else if (bodyMatch) htmlContent = bodyMatch[1];
                else htmlContent = gameCode;
                if (cssMatch) cssContent = cssMatch[1];
                if (jsMatch) jsContent = jsMatch[1];
                // Write into iframe with dark theme
                setTimeout({
                    "GameDisplay.useEffect": ()=>{
                        const doc = iframe.contentDocument;
                        doc.open();
                        doc.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>${gameTitle || 'Game'}</title>
            <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Pixelify+Sans:wght@400..700&display=swap" rel="stylesheet">
            <style>
              body {
                margin:0; padding:0;
                overflow:hidden;
                display:flex; justify-content:center; align-items:center;
                width:100%; height:100%;
                background-color: #161B22;
                color: #FFFFFF;
                font-family: 'Pixelify Sans', sans-serif;
              }
              ${cssContent}
            </style>
          </head>
          <body>
            ${htmlContent}
            <script>
              // Track image loading
              const OriginalImage = window.Image;
              const promises = [];
              window.Image = function() {
                const img = new OriginalImage();
                promises.push(new Promise(r => {
                  img.onload = r;
                  img.onerror = r;
                }));
                return img;
              };

              Promise.all(promises).finally(() => {
                // Run any exposed game loops
                [window.gameLoop, window.update, window.animate, window.draw, window.render, window.loop]
                  .filter(fn => typeof fn === 'function')
                  .forEach(fn => { try { fn(); } catch(e){} });
              });

              ${jsContent}
            </script>
          </body>
          </html>
        `);
                        doc.close();
                    }
                }["GameDisplay.useEffect"], 0);
            } catch (error) {
                console.error('Error rendering game:', error);
                gameContainerRef.current.innerHTML = `
        <div class="p-4 bg-indigo-900 text-red-300 rounded-lg pixel-border">
          <p class="font-bold retro-text text-sm">Error rendering game:</p>
          <p>${error.message}</p>
        </div>
      `;
            }
        }
    }["GameDisplay.useEffect"], [
        gameCode,
        gameTitle
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col h-full",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex-1 flex items-center justify-center bg-gray-900 p-2",
            children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative w-full h-full flex flex-col",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 w-full h-full pixel-border rounded-lg overflow-hidden bg-gray-800 crt-on",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DinoGame$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                            fileName: "[project]/components/GameDisplay.js",
                            lineNumber: 130,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/GameDisplay.js",
                        lineNumber: 129,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute bottom-30 left-0 right-0 text-center"
                    }, void 0, false, {
                        fileName: "[project]/components/GameDisplay.js",
                        lineNumber: 133,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/GameDisplay.js",
                lineNumber: 127,
                columnNumber: 11
            }, this) : gameCode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: gameContainerRef,
                className: "w-full h-full flex items-center justify-center overflow-auto pixel-border rounded-lg bg-gray-800 crt-on"
            }, void 0, false, {
                fileName: "[project]/components/GameDisplay.js",
                lineNumber: 140,
                columnNumber: 11
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center max-w-md bg-gray-800 p-8 rounded-lg pixel-border crt-on",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-lg font-medium retro-text text-indigo-300 mb-2",
                        children: "What would you like to play?"
                    }, void 0, false, {
                        fileName: "[project]/components/GameDisplay.js",
                        lineNumber: 146,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-pink-400 font-normal",
                        children: "Describe your game and I will create it for you!"
                    }, void 0, false, {
                        fileName: "[project]/components/GameDisplay.js",
                        lineNumber: 149,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/GameDisplay.js",
                lineNumber: 145,
                columnNumber: 11
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/GameDisplay.js",
            lineNumber: 125,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/GameDisplay.js",
        lineNumber: 124,
        columnNumber: 5
    }, this);
}
_s(GameDisplay, "EouQ4RFla/uVEYA46LDJxemH5o0=");
_c = GameDisplay;
var _c;
__turbopack_context__.k.register(_c, "GameDisplay");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/RetroLeaderboard.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// components/RetroLeaderboard.js
__turbopack_context__.s({
    "default": (()=>RetroLeaderboard)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
function RetroLeaderboard({ gameId }) {
    _s();
    const [playerName, setPlayerName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [playerScore, setPlayerScore] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [leaderboard, setLeaderboard] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isSubmitting, setIsSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [success, setSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // Load leaderboard data from localStorage on component mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RetroLeaderboard.useEffect": ()=>{
            const storedData = localStorage.getItem(`leaderboard-${gameId}`);
            if (storedData) {
                try {
                    setLeaderboard(JSON.parse(storedData));
                } catch (err) {
                    console.error('Error loading leaderboard data:', err);
                    setLeaderboard([]);
                }
            }
        }
    }["RetroLeaderboard.useEffect"], [
        gameId
    ]);
    // Handle form submission
    const handleSubmit = (e)=>{
        e.preventDefault();
        setError('');
        if (!playerName.trim()) {
            setError('Please enter your name');
            return;
        }
        if (!playerScore || isNaN(parseInt(playerScore))) {
            setError('Please enter a valid score');
            return;
        }
        setIsSubmitting(true);
        // Create new entry
        const newEntry = {
            id: Date.now().toString(),
            name: playerName.trim(),
            score: parseInt(playerScore),
            date: new Date().toISOString()
        };
        // Add to leaderboard, sort, and keep top 10
        const updatedLeaderboard = [
            ...leaderboard,
            newEntry
        ].sort((a, b)=>b.score - a.score).slice(0, 5);
        // Update state and localStorage
        setLeaderboard(updatedLeaderboard);
        localStorage.setItem(`leaderboard-${gameId}`, JSON.stringify(updatedLeaderboard));
        // Reset form
        setPlayerName('');
        setPlayerScore('');
        setIsSubmitting(false);
        setSuccess(true);
        // Clear success message after 2 seconds
        setTimeout(()=>setSuccess(false), 2000);
    };
    // Format date for display (e.g., "Apr 20")
    const formatDate = (dateString)=>{
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric'
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-gray-900 rounded-lg overflow-hidden shadow-lg border-2 border-indigo-500",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-indigo-900 px-4 py-3 border-b-4 border-pink-500",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                    className: "text-xl font-bold text-pink-400",
                    style: {
                        fontFamily: '"Press Start 2P", cursive',
                        textShadow: '2px 2px 0px #2D3748'
                    },
                    children: "HIGH SCORES"
                }, void 0, false, {
                    fileName: "[project]/components/RetroLeaderboard.js",
                    lineNumber: 79,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/RetroLeaderboard.js",
                lineNumber: 78,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-3",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-gray-800 rounded overflow-hidden border-2 border-indigo-700",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                        className: "w-full",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    className: "bg-indigo-800",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "py-2 px-2 text-indigo-300 text-left text-xs",
                                            style: {
                                                fontFamily: '"Press Start 2P", cursive'
                                            },
                                            children: "RANK"
                                        }, void 0, false, {
                                            fileName: "[project]/components/RetroLeaderboard.js",
                                            lineNumber: 91,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "py-2 text-indigo-300 text-left text-xs",
                                            style: {
                                                fontFamily: '"Press Start 2P", cursive'
                                            },
                                            children: "PLAYER"
                                        }, void 0, false, {
                                            fileName: "[project]/components/RetroLeaderboard.js",
                                            lineNumber: 95,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "py-2 text-indigo-300 text-right text-xs",
                                            style: {
                                                fontFamily: '"Press Start 2P", cursive'
                                            },
                                            children: "SCORE"
                                        }, void 0, false, {
                                            fileName: "[project]/components/RetroLeaderboard.js",
                                            lineNumber: 99,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "py-2 pr-2 text-indigo-300 text-right text-xs",
                                            style: {
                                                fontFamily: '"Press Start 2P", cursive'
                                            },
                                            children: "DATE"
                                        }, void 0, false, {
                                            fileName: "[project]/components/RetroLeaderboard.js",
                                            lineNumber: 103,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/RetroLeaderboard.js",
                                    lineNumber: 90,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/RetroLeaderboard.js",
                                lineNumber: 89,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                children: leaderboard.length > 0 ? leaderboard.map((entry, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        className: `
                      ${index % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'} 
                      hover:bg-indigo-800 transition-colors duration-150
                      ${index === 0 ? 'bg-indigo-900 bg-opacity-40' : ''}
                    `,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "py-2 px-2 text-yellow-400 text-xs",
                                                style: {
                                                    fontFamily: '"Press Start 2P", cursive'
                                                },
                                                children: index + 1
                                            }, void 0, false, {
                                                fileName: "[project]/components/RetroLeaderboard.js",
                                                lineNumber: 120,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "py-2 text-gray-100 text-xs",
                                                style: {
                                                    fontFamily: '"Press Start 2P", cursive'
                                                },
                                                children: entry.name
                                            }, void 0, false, {
                                                fileName: "[project]/components/RetroLeaderboard.js",
                                                lineNumber: 124,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "py-2 text-right text-pink-400 text-xs",
                                                style: {
                                                    fontFamily: '"Press Start 2P", cursive'
                                                },
                                                children: entry.score.toLocaleString()
                                            }, void 0, false, {
                                                fileName: "[project]/components/RetroLeaderboard.js",
                                                lineNumber: 128,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "py-2 pr-2 text-right text-gray-400 text-xs",
                                                style: {
                                                    fontFamily: '"Press Start 2P", cursive'
                                                },
                                                children: formatDate(entry.date)
                                            }, void 0, false, {
                                                fileName: "[project]/components/RetroLeaderboard.js",
                                                lineNumber: 132,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, entry.id, true, {
                                        fileName: "[project]/components/RetroLeaderboard.js",
                                        lineNumber: 112,
                                        columnNumber: 19
                                    }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                        colSpan: "4",
                                        className: "py-6 text-center text-gray-400 text-xs",
                                        style: {
                                            fontFamily: '"Press Start 2P", cursive'
                                        },
                                        children: "NO SCORES YET"
                                    }, void 0, false, {
                                        fileName: "[project]/components/RetroLeaderboard.js",
                                        lineNumber: 140,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/RetroLeaderboard.js",
                                    lineNumber: 139,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/RetroLeaderboard.js",
                                lineNumber: 109,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/RetroLeaderboard.js",
                        lineNumber: 88,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/RetroLeaderboard.js",
                    lineNumber: 87,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/RetroLeaderboard.js",
                lineNumber: 86,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-3 pb-3",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleSubmit,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 gap-2 mb-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: playerName,
                                    onChange: (e)=>setPlayerName(e.target.value),
                                    placeholder: "YOUR NAME",
                                    maxLength: 15,
                                    className: "px-3 py-2 bg-gray-800 border-2 border-indigo-600 rounded text-white text-xs",
                                    style: {
                                        fontFamily: '"Press Start 2P", cursive'
                                    },
                                    disabled: isSubmitting
                                }, void 0, false, {
                                    fileName: "[project]/components/RetroLeaderboard.js",
                                    lineNumber: 155,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "number",
                                    value: playerScore,
                                    onChange: (e)=>setPlayerScore(e.target.value),
                                    placeholder: "YOUR SCORE",
                                    className: "px-3 py-2 bg-gray-800 border-2 border-indigo-600 rounded text-white text-xs",
                                    style: {
                                        fontFamily: '"Press Start 2P", cursive'
                                    },
                                    disabled: isSubmitting
                                }, void 0, false, {
                                    fileName: "[project]/components/RetroLeaderboard.js",
                                    lineNumber: 165,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/RetroLeaderboard.js",
                            lineNumber: 154,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "submit",
                            disabled: isSubmitting,
                            className: "w-full px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded border-2 border-pink-500 transition-colors duration-150 text-xs",
                            style: {
                                fontFamily: '"Press Start 2P", cursive',
                                boxShadow: '0 4px 0 #4F46E5'
                            },
                            children: isSubmitting ? 'SUBMITTING...' : 'SUBMIT SCORE'
                        }, void 0, false, {
                            fileName: "[project]/components/RetroLeaderboard.js",
                            lineNumber: 176,
                            columnNumber: 11
                        }, this),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-2 text-red-400 text-center text-xs",
                            style: {
                                fontFamily: '"Press Start 2P", cursive'
                            },
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/components/RetroLeaderboard.js",
                            lineNumber: 189,
                            columnNumber: 13
                        }, this),
                        success && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-2 text-green-400 text-center text-xs animate-pulse",
                            style: {
                                fontFamily: '"Press Start 2P", cursive'
                            },
                            children: "SCORE ADDED!"
                        }, void 0, false, {
                            fileName: "[project]/components/RetroLeaderboard.js",
                            lineNumber: 196,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/RetroLeaderboard.js",
                    lineNumber: 153,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/RetroLeaderboard.js",
                lineNumber: 152,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/RetroLeaderboard.js",
        lineNumber: 76,
        columnNumber: 5
    }, this);
}
_s(RetroLeaderboard, "PowPrgGrZPQy/zfqsth1DEO3e10=");
_c = RetroLeaderboard;
var _c;
__turbopack_context__.k.register(_c, "RetroLeaderboard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/games/[id]/page.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// app/games/[id]/page.js
__turbopack_context__.s({
    "default": (()=>GamePage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm2017.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/firebase.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$BottomNavigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/BottomNavigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GameDisplay$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/GameDisplay.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$AuthContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/AuthContext.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$RetroLeaderboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/RetroLeaderboard.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
function GamePage({ params }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const gameId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["use"])(params).id;
    const [game, setGame] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [userRating, setUserRating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [isFavorite, setIsFavorite] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const { currentUser, userData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$AuthContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    // Initial data fetch
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GamePage.useEffect": ()=>{
            const fetchGame = {
                "GamePage.useEffect.fetchGame": async ()=>{
                    try {
                        setLoading(true);
                        const gameRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'games', gameId);
                        const gameSnap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])(gameRef);
                        if (gameSnap.exists()) {
                            const gameData = {
                                id: gameSnap.id,
                                ...gameSnap.data()
                            };
                            setGame(gameData);
                            // Add a view count
                            const currentPlays = gameData.playCount || 0;
                            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])(gameRef, {
                                playCount: currentPlays + 1
                            });
                        } else {
                            console.error("Game not found");
                            setGame(null);
                        }
                        setLoading(false);
                    } catch (error) {
                        console.error("Failed to fetch game:", error);
                        setLoading(false);
                    }
                }
            }["GamePage.useEffect.fetchGame"];
            fetchGame();
        }
    }["GamePage.useEffect"], [
        gameId
    ]);
    // Real-time listener for favorites changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GamePage.useEffect": ()=>{
            if (!currentUser) return;
            console.log("Setting up real-time listener for user favorites");
            // Set up real-time listener on the user document
            const userRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', currentUser.uid);
            const unsubscribe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onSnapshot"])(userRef, {
                "GamePage.useEffect.unsubscribe": (userDoc)=>{
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        const favorites = userData.favorites || [];
                        console.log("Favorites updated in real-time:", favorites);
                        setIsFavorite(favorites.includes(gameId));
                    }
                }
            }["GamePage.useEffect.unsubscribe"], {
                "GamePage.useEffect.unsubscribe": (error)=>{
                    console.error("Error in favorites listener:", error);
                }
            }["GamePage.useEffect.unsubscribe"]);
            // Clean up listener when component unmounts
            return ({
                "GamePage.useEffect": ()=>{
                    console.log("Cleaning up favorites listener");
                    unsubscribe();
                }
            })["GamePage.useEffect"];
        }
    }["GamePage.useEffect"], [
        currentUser,
        gameId
    ]);
    // Real-time listener for game data changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GamePage.useEffect": ()=>{
            console.log("Setting up real-time listener for game data");
            const gameRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'games', gameId);
            const unsubscribe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onSnapshot"])(gameRef, {
                "GamePage.useEffect.unsubscribe": (gameDoc)=>{
                    if (gameDoc.exists()) {
                        const gameData = {
                            id: gameDoc.id,
                            ...gameDoc.data()
                        };
                        console.log("Game data updated in real-time:", gameData);
                        setGame(gameData);
                    } else {
                        console.error("Game document no longer exists");
                        setGame(null);
                    }
                }
            }["GamePage.useEffect.unsubscribe"], {
                "GamePage.useEffect.unsubscribe": (error)=>{
                    console.error("Error in game data listener:", error);
                }
            }["GamePage.useEffect.unsubscribe"]);
            // Clean up listener when component unmounts
            return ({
                "GamePage.useEffect": ()=>{
                    console.log("Cleaning up game data listener");
                    unsubscribe();
                }
            })["GamePage.useEffect"];
        }
    }["GamePage.useEffect"], [
        gameId
    ]);
    // Handle rating updates
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "GamePage.useEffect": ()=>{
            if (!currentUser || !game) return;
            // Check if user has already rated this game
            const userRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', currentUser.uid);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])(userRef).then({
                "GamePage.useEffect": (userDoc)=>{
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        const ratings = userData.ratings || {};
                        if (ratings[gameId]) {
                            setUserRating(ratings[gameId]);
                        }
                    }
                }
            }["GamePage.useEffect"]).catch({
                "GamePage.useEffect": (error)=>{
                    console.error("Error fetching user ratings:", error);
                }
            }["GamePage.useEffect"]);
        }
    }["GamePage.useEffect"], [
        currentUser,
        gameId,
        game
    ]);
    const handleRatingClick = async (rating)=>{
        // Store the current rating before updating
        const previousRating = userRating;
        // Update local state for immediate UI feedback
        setUserRating(rating);
        try {
            // Make sure we have the game data and user
            if (!game || !currentUser) {
                console.error("Game data or user is not available");
                return;
            }
            // Get refs
            const userRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', currentUser.uid);
            const gameRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'games', gameId);
            const creatorRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', game.creator_id);
            // Get current user document to check for existing rating
            const userDoc = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])(userRef);
            if (!userDoc.exists()) {
                console.error("User document not found");
                return;
            }
            const userData = userDoc.data();
            const userRatings = userData.ratings || {};
            const storedPreviousRating = userRatings[gameId] || 0;
            // Get current game document to update ratings array
            const gameDoc = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])(gameRef);
            if (!gameDoc.exists()) {
                console.error("Game document not found");
                return;
            }
            const gameData = gameDoc.data();
            const currentRatings = gameData.ratings || [];
            let updatedRatings = [
                ...currentRatings
            ];
            // If user already rated, remove their previous rating
            if (storedPreviousRating > 0) {
                // Remove one instance of their previous rating
                const index = updatedRatings.indexOf(storedPreviousRating);
                if (index !== -1) {
                    updatedRatings.splice(index, 1);
                }
            }
            // Add new rating
            updatedRatings.push(rating);
            // Calculate new average
            const avgRating = updatedRatings.length > 0 ? updatedRatings.reduce((sum, r)=>sum + r, 0) / updatedRatings.length : 0;
            // Update game document with new ratings array and average
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])(gameRef, {
                ratings: updatedRatings,
                rating: avgRating // Update the avg_rating field
            });
            // Update user document with their new rating
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])(userRef, {
                [`ratings.${gameId}`]: rating
            });
            console.log(`Updated rating for game ${gameId} to ${rating} stars (avg: ${avgRating.toFixed(1)})`);
        } catch (error) {
            // Revert UI state if operation fails
            setUserRating(previousRating);
            console.error("Error updating rating:", error);
        }
    };
    const toggleFavorite = async ()=>{
        // Toggle state locally first for responsive UI
        const newFavoriteState = !isFavorite;
        setIsFavorite(newFavoriteState);
        try {
            // Make sure we have the game data
            if (!game) {
                console.error("Game data is not available");
                return;
            }
            // Check if user data is available
            if (!currentUser) {
                console.error("User data is not available");
                return;
            }
            // Get the current user reference
            const userRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', currentUser.uid);
            const gameRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'games', game.id);
            const creatorRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$firebase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', game.creator_id);
            if (newFavoriteState) {
                // Adding to favorites - using arrayUnion to add to array
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])(userRef, {
                    favorites: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["arrayUnion"])(gameId) // This creates the array if it doesn't exist
                });
                // Optionally update the game's favorite count
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])(gameRef, {
                    favCount: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["increment"])(1)
                });
                // Update the creator's stats
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])(creatorRef, {
                    favCount: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["increment"])(1)
                });
            } else {
                // Removing from favorites - using arrayRemove
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])(userRef, {
                    favorites: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["arrayRemove"])(gameId)
                });
                // Optionally update the game's favorite count
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])(gameRef, {
                    favCount: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["increment"])(-1)
                });
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updateDoc"])(creatorRef, {
                    favCount: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm2017$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["increment"])(-1)
                });
            }
            console.log(`${newFavoriteState ? 'Added' : 'Removed'} game ${game.id} ${newFavoriteState ? 'to' : 'from'} favorites`);
        } catch (error) {
            // Revert UI state if operation fails
            setIsFavorite(!newFavoriteState);
            console.error("Error updating favorites:", error);
        }
    };
    const formatPlays = (plays)=>{
        if (!plays) return '0'; // Handle undefined plays
        if (plays >= 1000000) {
            return `${(plays / 1000000).toFixed(1)}M`;
        } else if (plays >= 1000) {
            return `${(plays / 1000).toFixed(1)}K`;
        }
        return plays.toString();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col min-h-screen bg-gray-900 text-gray-100",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "bg-indigo-900 border-b-4 border-pink-500 shadow-lg",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container mx-auto py-6 px-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-4xl font-bold text-center tracking-wider text-pink-500",
                        style: {
                            textShadow: '2px 2px 0px #4F46E5, 4px 4px 0px #2D3748',
                            fontFamily: '"Press Start 2P", cursive'
                        },
                        children: "PAPERPROTO GAMES"
                    }, void 0, false, {
                        fileName: "[project]/app/games/[id]/page.js",
                        lineNumber: 288,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/games/[id]/page.js",
                    lineNumber: 287,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/games/[id]/page.js",
                lineNumber: 286,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "flex-1 flex flex-col container mx-auto px-4 py-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/community",
                        className: "inline-flex items-center mb-6 text-indigo-400 hover:text-indigo-300 transition-colors",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                xmlns: "http://www.w3.org/2000/svg",
                                className: "h-5 w-5 mr-2",
                                viewBox: "0 0 20 20",
                                fill: "currentColor",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    fillRule: "evenodd",
                                    d: "M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z",
                                    clipRule: "evenodd"
                                }, void 0, false, {
                                    fileName: "[project]/app/games/[id]/page.js",
                                    lineNumber: 302,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/games/[id]/page.js",
                                lineNumber: 301,
                                columnNumber: 11
                            }, this),
                            "Back to Arcade"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/games/[id]/page.js",
                        lineNumber: 300,
                        columnNumber: 9
                    }, this),
                    loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-center items-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-16 h-16 pixel-spinner"
                        }, void 0, false, {
                            fileName: "[project]/app/games/[id]/page.js",
                            lineNumber: 309,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/games/[id]/page.js",
                        lineNumber: 308,
                        columnNumber: 11
                    }, this) : game ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-700 shadow-xl flex",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 lg:grid-cols-2 flex-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-6 lg:p-8 flex flex-col",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-between items-start mb-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                    className: "text-3xl font-bold text-pink-400",
                                                    children: game.title
                                                }, void 0, false, {
                                                    fileName: "[project]/app/games/[id]/page.js",
                                                    lineNumber: 318,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: toggleFavorite,
                                                    className: `p-2 rounded-full transition-colors ${isFavorite ? 'text-red-500 bg-gray-700' : 'text-gray-400 hover:text-red-500 hover:bg-gray-700'}`,
                                                    "aria-label": isFavorite ? "Remove from favorites" : "Add to favorites",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        xmlns: "http://www.w3.org/2000/svg",
                                                        className: "h-6 w-6",
                                                        fill: isFavorite ? "currentColor" : "none",
                                                        viewBox: "0 0 24 24",
                                                        stroke: "currentColor",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            strokeLinecap: "round",
                                                            strokeLinejoin: "round",
                                                            strokeWidth: 2,
                                                            d: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/games/[id]/page.js",
                                                            lineNumber: 325,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/games/[id]/page.js",
                                                        lineNumber: 324,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/app/games/[id]/page.js",
                                                    lineNumber: 319,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/games/[id]/page.js",
                                            lineNumber: 317,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center mb-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center text-yellow-400 mr-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            xmlns: "http://www.w3.org/2000/svg",
                                                            className: "h-5 w-5",
                                                            viewBox: "0 0 20 20",
                                                            fill: "currentColor",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                d: "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/games/[id]/page.js",
                                                                lineNumber: 333,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/games/[id]/page.js",
                                                            lineNumber: 332,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "ml-1 font-bold",
                                                            children: game.rating ? game.rating.toFixed(1) : '0.0'
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/games/[id]/page.js",
                                                            lineNumber: 335,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/games/[id]/page.js",
                                                    lineNumber: 331,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-400",
                                                    children: [
                                                        formatPlays(game.playCount),
                                                        " plays"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/games/[id]/page.js",
                                                    lineNumber: 337,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/games/[id]/page.js",
                                            lineNumber: 330,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "prose prose-invert max-w-none mb-8",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-gray-300",
                                                children: game.description
                                            }, void 0, false, {
                                                fileName: "[project]/app/games/[id]/page.js",
                                                lineNumber: 341,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/games/[id]/page.js",
                                            lineNumber: 340,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-4 mb-6",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$RetroLeaderboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                gameId: gameId
                                            }, void 0, false, {
                                                fileName: "[project]/app/games/[id]/page.js",
                                                lineNumber: 346,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/app/games/[id]/page.js",
                                            lineNumber: 345,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-auto",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mb-6",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-gray-300 mb-2",
                                                            children: "Rate this game:"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/games/[id]/page.js",
                                                            lineNumber: 351,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex",
                                                                    children: [
                                                                        1,
                                                                        2,
                                                                        3,
                                                                        4,
                                                                        5
                                                                    ].map((star)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            onClick: ()=>handleRatingClick(star),
                                                                            className: `text-2xl mx-1 transition-colors ${userRating >= star ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-300'}`,
                                                                            "aria-label": `Rate ${star} stars`,
                                                                            disabled: !currentUser,
                                                                            children: "★"
                                                                        }, star, false, {
                                                                            fileName: "[project]/app/games/[id]/page.js",
                                                                            lineNumber: 355,
                                                                            columnNumber: 27
                                                                        }, this))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/games/[id]/page.js",
                                                                    lineNumber: 353,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "ml-4",
                                                                    children: userRating > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-gray-300 inline-block min-w-16",
                                                                        children: [
                                                                            "Your rating: ",
                                                                            userRating
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/games/[id]/page.js",
                                                                        lineNumber: 372,
                                                                        columnNumber: 27
                                                                    }, this) : currentUser ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-gray-400 inline-block min-w-16",
                                                                        children: "Not rated yet"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/games/[id]/page.js",
                                                                        lineNumber: 374,
                                                                        columnNumber: 27
                                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-gray-500 inline-block min-w-16",
                                                                        children: "Sign in to rate"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/games/[id]/page.js",
                                                                        lineNumber: 376,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/games/[id]/page.js",
                                                                    lineNumber: 370,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/games/[id]/page.js",
                                                            lineNumber: 352,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/games/[id]/page.js",
                                                    lineNumber: 350,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex space-x-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: "px-4 py-2 bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors",
                                                            children: "Share Game"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/games/[id]/page.js",
                                                            lineNumber: 383,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: "px-4 py-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors",
                                                            children: "Report Issue"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/games/[id]/page.js",
                                                            lineNumber: 386,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/games/[id]/page.js",
                                                    lineNumber: 382,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/games/[id]/page.js",
                                            lineNumber: 349,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/games/[id]/page.js",
                                    lineNumber: 316,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GameDisplay$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        gameCode: game.gameCode,
                                        gameType: game.title,
                                        loading: loading
                                    }, void 0, false, {
                                        fileName: "[project]/app/games/[id]/page.js",
                                        lineNumber: 395,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/games/[id]/page.js",
                                    lineNumber: 394,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/games/[id]/page.js",
                            lineNumber: 313,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/games/[id]/page.js",
                        lineNumber: 312,
                        columnNumber: 10
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-gray-800 rounded-lg p-8 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xl text-gray-400",
                                children: "Game not found."
                            }, void 0, false, {
                                fileName: "[project]/app/games/[id]/page.js",
                                lineNumber: 406,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/community",
                                className: "inline-block mt-4 px-4 py-2 bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors",
                                children: "Return to Arcade"
                            }, void 0, false, {
                                fileName: "[project]/app/games/[id]/page.js",
                                lineNumber: 407,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/games/[id]/page.js",
                        lineNumber: 405,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/games/[id]/page.js",
                lineNumber: 298,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/games/[id]/page.js",
        lineNumber: 284,
        columnNumber: 5
    }, this);
}
_s(GamePage, "KeF6V8r3eK13VjTRr7oNFvl5N04=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$AuthContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = GamePage;
var _c;
__turbopack_context__.k.register(_c, "GamePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=_fadb717d._.js.map