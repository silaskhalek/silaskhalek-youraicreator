/* ==========================================================================
   Preloader: uma galáxia de partículas que se junta no ✳ da marca e,
   no 100%, salta pro hiperespaço abrindo um buraco até o site.
   ========================================================================== */
(() => {
  const root = document.documentElement;
  const el = document.querySelector(".preloader");
  let resolveDone;
  window.preloaderDone = new Promise((resolve) => (resolveDone = resolve));

  const finish = () => {
    root.classList.remove("is-loading");
    if (el) el.remove();
    try { sessionStorage.setItem("sk-intro", "1"); } catch (e) { /* sem storage */ }
    resolveDone();
  };

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!el || reduceMotion) return finish();

  const canvas = el.querySelector(".preloader__canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return finish();

  const numEl = el.querySelector(".preloader__num");
  const msgEl = el.querySelector(".preloader__msg");
  const nameEl = el.querySelector(".preloader__name");

  // Letras do nome entram uma a uma
  nameEl.innerHTML = [...nameEl.textContent]
    .map((c, i) => `<span class="ch" style="transition-delay:${i * 35}ms">${c === " " ? "&nbsp;" : c}</span>`)
    .join("");

  // Primeira visita da sessão: versão completa. Depois: versão curta.
  const DURATION = root.classList.contains("intro-seen") ? 1300 : 3000;
  const EXIT = 1100;
  const MESSAGES = [
    [0, "acordando a IA"],
    [0.3, "juntando as ideias"],
    [0.6, "dando forma"],
    [0.92, "pronto. bem-vindo"],
  ];
  const COLORS = ["#b794f6", "#8b5cf6", "#7c3aed", "#e9ddff", "#ffffff", "#c4b5fd"];

  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const clamp01 = (v) => Math.min(1, Math.max(0, v));

  let W, H, cx, cy, R, L, dpr, particles;

  const build = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx = W / 2;
    cy = H / 2 - Math.min(H * 0.06, 40);
    R = Math.min(W, H) * 0.46;
    L = Math.min(W, H) * (W < 600 ? 0.17 : 0.13);
    el.style.setProperty("--L", `${L}px`);

    const count = Math.round(Math.min(1500, Math.max(600, (W * H) / 900)));
    const ARMS = 3;
    particles = Array.from({ length: count }, (_, i) => {
      // Galáxia: braços em espiral, mais densa no centro
      const arm = i % ARMS;
      const r = Math.pow(Math.random(), 0.7) * R + 4;
      const spread = (Math.random() - 0.5) * (0.9 - (r / R) * 0.5);
      const theta = (arm / ARMS) * Math.PI * 2 + (r / R) * 4.2 + spread;
      const spin = 0.00055 + 0.0016 * (1 - r / R);

      // Alvo: uma das 4 hastes do ✳, ou poeira em volta (15%)
      const dust = Math.random() < 0.15;
      let tx, ty;
      if (dust) {
        const a = Math.random() * Math.PI * 2;
        const d = L * (1.2 + Math.random() * 1.4);
        tx = Math.cos(a) * d;
        ty = Math.sin(a) * d;
      } else {
        const line = i % 4;
        const ang = (line * Math.PI) / 4;
        const s = (Math.random() * 2 - 1) * L;
        const j = (Math.random() - 0.5) * L * 0.09;
        tx = Math.cos(ang) * s - Math.sin(ang) * j;
        ty = Math.sin(ang) * s + Math.cos(ang) * j;
      }

      return {
        r, theta, spin, tx, ty, dust,
        size: Math.random() < 0.08 ? 1.6 + Math.random() * 1.4 : 0.5 + Math.random() * 1.1,
        color: COLORS[(Math.random() * COLORS.length) | 0],
        alpha: dust ? 0.35 + Math.random() * 0.35 : 0.6 + Math.random() * 0.4,
        warp: 0.7 + Math.random() * 0.8,
      };
    });
  };

  build();
  window.addEventListener("resize", build);

  let loaded = document.readyState === "complete";
  window.addEventListener("load", () => (loaded = true));

  const start = performance.now();
  let shown = 0; // progresso mostrado (0..1)
  let exitAt = 0;
  let brandShown = false;
  let skipped = false;

  el.addEventListener("click", () => { skipped = true; });

  const frame = (now) => {
    const t = now - start;

    // Progresso: anda no tempo, mas segura em 92% até a página carregar
    const target = skipped ? 1 : ease(clamp01(t / DURATION));
    const cap = loaded || skipped ? 1 : 0.92;
    shown = Math.max(shown, Math.min(target, cap));
    numEl.textContent = Math.round(shown * 100);
    for (const [at, msg] of MESSAGES) if (shown >= at) msgEl.textContent = msg;

    // Fases: galáxia (0–0.5), vira ✳ (0.5–0.9), segura, salta
    const m = ease(clamp01((shown - 0.5) / 0.4));
    if (m > 0.55 && !brandShown) {
      brandShown = true;
      el.classList.add("show-brand");
    }
    if (shown >= 1 && !exitAt) {
      exitAt = now + (skipped ? 0 : 450);
    }
    const e = exitAt && now >= exitAt ? clamp01((now - exitAt) / EXIT) : 0;
    if (e > 0 && !el.classList.contains("is-leaving")) {
      el.classList.add("is-leaving");
      root.classList.remove("is-loading"); // o topo do site começa a entrar enquanto o buraco abre
    }

    // Rastro: fundo semitransparente deixa um borrão de movimento
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = e > 0 ? "rgba(0,0,0,0.28)" : "rgba(0,0,0,0.34)";
    ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = "source-over";

    // Brilho do núcleo
    const glowR = R * (0.55 - m * 0.2) * (1 + e * 2);
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
    g.addColorStop(0, `rgba(139,92,246,${0.2 + m * 0.14})`);
    g.addColorStop(1, "rgba(139,92,246,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    ctx.globalCompositeOperation = "lighter";
    const tilt = 0.55 + m * 0.45;
    const rot = t * 0.00012;
    const cosR = Math.cos(rot);
    const sinR = Math.sin(rot);
    const diag = Math.hypot(W, H);

    for (const p of particles) {
      const a = p.theta + t * p.spin;
      const gx = Math.cos(a) * p.r;
      const gy = Math.sin(a) * p.r * tilt;

      // ✳ girando devagar
      const sx = p.tx * cosR - p.ty * sinR;
      const sy = p.tx * sinR + p.ty * cosR;

      let x = cx + gx + (sx - gx) * m;
      let y = cy + gy + (sy - gy) * m;

      ctx.globalAlpha = p.alpha * (p.dust ? 1 - m * 0.4 : 1);
      ctx.fillStyle = p.color;
      ctx.strokeStyle = p.color;

      if (e > 0) {
        // Hiperespaço: cada partícula dispara pra fora deixando um risco
        let dx = x - cx;
        let dy = y - cy;
        const len = Math.hypot(dx, dy) || 1;
        dx /= len;
        dy /= len;
        const push = Math.pow(e, 2.2) * diag * p.warp;
        const streak = 8 + Math.pow(e, 1.5) * 160 * p.warp;
        x += dx * push;
        y += dy * push;
        ctx.lineWidth = p.size;
        ctx.beginPath();
        ctx.moveTo(x - dx * streak, y - dy * streak);
        ctx.lineTo(x, y);
        ctx.stroke();
      } else {
        ctx.fillRect(x - p.size / 2, y - p.size / 2, p.size, p.size);
      }
    }
    ctx.globalAlpha = 1;

    // Buraco que abre do centro e revela o site
    if (e > 0) {
      const hole = Math.pow(clamp01((e - 0.15) / 0.85), 2) * diag * 0.6;
      el.style.setProperty("--hole", `${hole}px`);
    }

    if (e >= 1) return finish();
    requestAnimationFrame(frame);
  };

  requestAnimationFrame(frame);
})();
