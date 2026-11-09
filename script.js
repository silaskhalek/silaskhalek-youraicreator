/* ==========================================================================
   Configuração: edite aqui seus links.
   ========================================================================== */
const CONFIG = {
  // Seu @ do Instagram, sem o "@" (ex.: "silaskhalek"). Vazio esconde os links.
  instagram: "silas.khalek",

  // Número do WhatsApp com DDI e DDD, só dígitos (ex.: "5511999999999").
  // Os botões de contato abrem uma conversa com mensagem pronta.
  whatsapp: "5511960965638",
};

/* ==========================================================================
   Comandos mostrados nos terminais. A ordem bate com as abas do método.
   ========================================================================== */
const SCENARIOS_PT = [
  {
    app: "claude",
    path: "~/conteudo",
    cmd: "Usa a minha skill de roteiro e escreve 5 roteiros de reels sobre IA pra quem está começando, com gancho forte nos 3 primeiros segundos.",
    steps: [
      "Carrega a skill roteiro-no-meu-tom",
      "Estrutura gancho, conteúdo e chamada",
      "Salva tudo em roteiros.md",
    ],
    done: "✓ roteiros.md · 5 roteiros no seu tom",
  },
  {
    app: "chatgpt",
    path: "ensaio-produto",
    cmd: "Coloca esse tênis numa calçada molhada à noite, com neon roxo refletindo no chão e fundo desfocado, formato 4:5.",
    steps: [
      "Isola o produto mantendo os detalhes",
      "Monta o cenário e a iluminação",
      "Gera a imagem final em 4:5",
    ],
    done: "✓ tenis_neon.png · 1080×1350 · pronta pro feed",
  },
  {
    app: "gemini",
    path: "pesquisa",
    cmd: "Assiste esse vídeo do YouTube de 40 minutos e me diz os 5 momentos que dariam os melhores cortes, com a minutagem.",
    steps: [
      "Assiste e transcreve o vídeo",
      "Encontra os trechos com mais impacto",
      "Lista os 5 com início e fim",
    ],
    done: "✓ 5 cortes sugeridos com minutagem",
  },
  {
    app: "higgsfield",
    path: "cena-01",
    cmd: "Plano cinematográfico de uma mulher andando na chuva em Tóquio à noite, câmera acompanhando de lado, luz de neon, 8 segundos.",
    steps: [
      "Monta personagem, cenário e luz",
      "Aplica o movimento de câmera",
      "Gera o vídeo em alta qualidade",
    ],
    done: "✓ cena_01.mp4 · 8s · ultrarrealista",
  },
];

const SCENARIOS_EN = [
  {
    app: "claude",
    path: "~/content",
    cmd: "Use my script skill and write 5 reel scripts about AI for beginners, with a strong hook in the first 3 seconds.",
    steps: [
      "Loads the script-in-my-tone skill",
      "Structures hook, content and call to action",
      "Saves everything to scripts.md",
    ],
    done: "✓ scripts.md · 5 scripts in your tone",
  },
  {
    app: "chatgpt",
    path: "product-shoot",
    cmd: "Put this sneaker on a wet sidewalk at night, with purple neon reflecting on the ground and a blurred background, 4:5 format.",
    steps: [
      "Isolates the product, keeping the details",
      "Builds the scene and the lighting",
      "Generates the final image in 4:5",
    ],
    done: "✓ sneaker_neon.png · 1080×1350 · ready for the feed",
  },
  {
    app: "gemini",
    path: "research",
    cmd: "Watch this 40-minute YouTube video and tell me the 5 moments that would make the best clips, with timestamps.",
    steps: [
      "Watches and transcribes the video",
      "Finds the most impactful moments",
      "Lists the 5 with start and end",
    ],
    done: "✓ 5 suggested clips with timestamps",
  },
  {
    app: "higgsfield",
    path: "scene-01",
    cmd: "Cinematic shot of a woman walking in the rain in Tokyo at night, camera tracking from the side, neon light, 8 seconds.",
    steps: [
      "Sets up character, scene and lighting",
      "Applies the camera movement",
      "Generates the video in high quality",
    ],
    done: "✓ scene_01.mp4 · 8s · ultra-realistic",
  },
];

// Idioma atual (o i18n.js troca entre português e inglês)
const isEN = () => window.i18n?.lang === "en";
// "tr" e não "t": o Lenis já ocupa o nome global "t"
const tr = (pt) => (window.i18n ? window.i18n.t(pt) : pt);
const scenarios = () => (isEN() ? SCENARIOS_EN : SCENARIOS_PT);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.documentElement.classList.remove("no-js");

/* ==========================================================================
   Rolagem suave com inércia (Lenis), integrada ao GSAP
   ========================================================================== */
let lenis = null;
if (!reduceMotion && window.Lenis) {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }

  // Links internos (#ofertas, #faq...) deslizam suave até a seção, descontando o menu
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    const id = a?.getAttribute("href");
    if (!id || id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: -70 });
  });

  // Durante a abertura a página fica parada
  if (document.documentElement.classList.contains("is-loading")) {
    lenis.stop();
    (window.preloaderDone || Promise.resolve()).then(() => lenis.start());
  }
}

// Ano no rodapé
document.getElementById("ano").textContent = new Date().getFullYear();

// Links do Instagram
document.querySelectorAll('[data-link="instagram"]').forEach((el) => {
  if (CONFIG.instagram) {
    el.href = `https://www.instagram.com/${CONFIG.instagram}/`;
  } else {
    el.hidden = true;
  }
});

// Botões que abrem o WhatsApp com uma mensagem pronta (no idioma da página)
const linkWhatsApp = () => {
  document.querySelectorAll("[data-wa]").forEach((el) => {
    if (!CONFIG.whatsapp) return;
    el.href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(el.dataset.wa)}`;
    el.target = "_blank";
    el.rel = "noopener";
  });
};
linkWhatsApp();
window.addEventListener("langchange", linkWhatsApp);

// Borda da navegação ao rolar
const nav = document.querySelector(".nav");
const hero = document.querySelector("[data-hero]");
const closing = document.querySelector(".closing");
const isUnderNav = (block) => {
  if (!block) return false;
  const r = block.getBoundingClientRect();
  const h = nav.offsetHeight / 2;
  return r.top <= h && r.bottom > h;
};
const onScroll = () => {
  nav.classList.toggle("is-scrolled", window.scrollY > 8);
  // Navegação clara por cima dos blocos escuros: transparente no topo, escura no fechamento
  nav.classList.toggle("is-over-hero", isUnderNav(hero));
  nav.classList.toggle("is-over-dark", ["[data-king]", ".chess", ".closing"].some((sel) => isUnderNav(document.querySelector(sel))));
};
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// Animações de entrada
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => {
    // Escalona elementos irmãos para um efeito em cascata
    const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
    el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 6) * 70}ms`;
    io.observe(el);
  });
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

/* ==========================================================================
   Terminal animado
   ========================================================================== */
class Terminal {
  constructor(el) {
    this.el = el;
    this.path = el.querySelector(".term__path");
    this.typed = el.querySelector(".term__typed");
    this.steps = el.querySelector(".term__steps");
    this.pct = el.querySelector(".term__pct");
    this.bar = el.querySelector(".term__bar span");
    this.done = el.querySelector(".term__done");
    this.run = 0; // incrementa a cada execução; cancela a anterior
  }

  wait(ms, run) {
    return new Promise((resolve, reject) =>
      setTimeout(() => (run === this.run ? resolve() : reject("cancelado")), ms)
    );
  }

  setProgress(value) {
    this.pct.textContent = `${Math.round(value)}%`;
    this.bar.style.width = `${value}%`;
  }

  reset(s) {
    this.path.textContent = `${s.app} · ${s.path}`;
    this.typed.textContent = "";
    this.done.textContent = s.done;
    this.done.classList.remove("is-shown");
    this.steps.innerHTML = s.steps
      .map((text, i) => `<li><b>${i + 1}</b><span>${text}</span></li>`)
      .join("");
    this.setProgress(0);
  }

  // Mostra o estado final direto, sem animação
  show(s) {
    this.run++;
    this.reset(s);
    this.typed.textContent = s.cmd;
    this.steps.querySelectorAll("li").forEach((li) => {
      li.classList.add("is-shown", "is-done");
      li.querySelector("b").textContent = "✓";
    });
    this.setProgress(100);
    this.done.classList.add("is-shown");
  }

  async play(s) {
    if (reduceMotion) return this.show(s);
    const run = ++this.run;
    this.reset(s);
    this.el.classList.remove("is-running");

    await this.wait(500, run);
    for (const char of s.cmd) {
      this.typed.textContent += char;
      await this.wait(char === " " ? 18 : 22 + Math.random() * 28, run);
    }
    await this.wait(400, run);
    this.el.classList.add("is-running");

    const items = [...this.steps.querySelectorAll("li")];
    for (const [i, li] of items.entries()) {
      li.classList.add("is-shown");
      const from = (i / items.length) * 100;
      const to = ((i + 1) / items.length) * 100;
      for (let p = from; p <= to; p += 4) {
        this.setProgress(p);
        await this.wait(45, run);
      }
      li.classList.add("is-done");
      li.querySelector("b").textContent = "✓";
    }
    this.setProgress(100);
    this.done.classList.add("is-shown");
    this.el.classList.remove("is-running");
  }
}

const whenVisible = (el, fn) => {
  if (!("IntersectionObserver" in window)) return fn();
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) {
      io.disconnect();
      fn();
    }
  }, { threshold: 0.3 });
  io.observe(el);
};

// Terminal do método: abas escolhem o comando
const methodEl = document.querySelector('[data-term="method"]');
if (methodEl) {
  const method = new Terminal(methodEl);
  const tabs = [...document.querySelectorAll(".tab")];
  let current = 0;

  const select = (index) => {
    current = index;
    tabs.forEach((t, i) => {
      t.classList.toggle("is-active", i === index);
      t.setAttribute("aria-selected", String(i === index));
    });
    method.play(scenarios()[index]).catch(() => {});
  };

  tabs.forEach((tab, i) => tab.addEventListener("click", () => select(i)));
  method.show(scenarios()[0]);
  whenVisible(methodEl, () => select(0));
  window.addEventListener("langchange", () => method.show(scenarios()[current]));

  const copyBtn = document.querySelector("[data-copy]");
  const copyLabel = copyBtn.querySelector(".copy__label");
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(scenarios()[current].cmd);
      copyLabel.textContent = tr("Copiado!");
      copyBtn.classList.add("is-copied");
    } catch {
      copyLabel.textContent = tr("Não deu pra copiar");
    }
    setTimeout(() => {
      copyLabel.textContent = tr("Copiar comando");
      copyBtn.classList.remove("is-copied");
    }, 1800);
  });
}

/* ==========================================================================
   Texto que preenche palavra por palavra conforme a rolagem
   ========================================================================== */
const wrapWords = (node) => {
  [...node.childNodes].forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      const frag = document.createDocumentFragment();
      child.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          frag.append(" ");
        } else {
          const span = document.createElement("span");
          span.className = "w";
          span.textContent = part;
          frag.append(span);
        }
      });
      child.replaceWith(frag);
    } else {
      wrapWords(child);
    }
  });
};

const fillEls = [...document.querySelectorAll("[data-fill]")].map((el) => {
  wrapWords(el);
  return { el, words: [...el.querySelectorAll(".w")] };
});

// Ao trocar o idioma o texto é reescrito, então quebra em palavras de novo
window.addEventListener("langchange", () => {
  fillEls.forEach((f) => {
    wrapWords(f.el);
    f.words = [...f.el.querySelectorAll(".w")];
  });
  updateScroll();
});

// 0 quando o topo do elemento chega em `start` da tela, 1 quando o fim chega em `end`
const scrollProgress = (el, start, end) => {
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight;
  const total = r.height + vh * (start - end);
  return Math.min(1, Math.max(0, (vh * start - r.top) / total));
};

const updateScroll = () => {
  fillEls.forEach(({ el, words }) => {
    const lit = reduceMotion ? words.length : Math.round(scrollProgress(el, 0.85, 0.45) * words.length);
    words.forEach((w, i) => w.classList.toggle("is-lit", i < lit));
  });
};

let ticking = false;
const onScrollFrame = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    updateScroll();
    ticking = false;
  });
};
updateScroll();
window.addEventListener("scroll", onScrollFrame, { passive: true });
window.addEventListener("resize", onScrollFrame);

/* ==========================================================================
   Pra quem é: abas de perfil
   ========================================================================== */
const personaTabs = [...document.querySelectorAll(".persona__tab")];
personaTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    personaTabs.forEach((t) => {
      const active = t === tab;
      t.classList.toggle("is-active", active);
      t.setAttribute("aria-selected", String(active));
      document.getElementById(t.getAttribute("aria-controls")).hidden = !active;
    });
  });
});

/* ==========================================================================
   Regras: mini terminais que digitam ao aparecer na tela
   ========================================================================== */
document.querySelectorAll("[data-mini]").forEach((mini, i) => {
  if (reduceMotion) return;
  const typed = mini.querySelector(".mini__typed");
  const original = typed.textContent;
  typed.textContent = "";
  mini.classList.add("is-armed");
  window.addEventListener("langchange", () => {
    if (mini.classList.contains("is-done")) typed.textContent = tr(original);
  });

  (window.preloaderDone || Promise.resolve()).then(() =>
    whenVisible(mini, async () => {
      await new Promise((r) => setTimeout(r, 250 + i * 450));
      for (const char of tr(original)) {
        typed.textContent += char;
        await new Promise((r) => setTimeout(r, 26 + Math.random() * 30));
      }
      await new Promise((r) => setTimeout(r, 250));
      mini.classList.add("is-done");
    })
  );
});

/* ==========================================================================
   Estratégia: o rei sobe e cresce com a rolagem (GSAP + ScrollTrigger)
   ========================================================================== */
const king = document.querySelector("[data-king]");
if (king && window.gsap && window.ScrollTrigger && !reduceMotion) {
  gsap.registerPlugin(ScrollTrigger);
  const photo = king.querySelector("[data-king-photo] img");
  const sides = king.querySelectorAll("[data-king-side]");

  // O bloco preto cresce até ocupar o espaço enquanto entra na tela
  gsap.fromTo(
    king,
    { scale: 0.9 },
    { scale: 1, ease: "none", scrollTrigger: { trigger: king, start: "top bottom", end: "top 25%", scrub: 1 } }
  );

  // Zoom no rei: começa pequeno lá embaixo e cresce até ficar maior que a tela
  gsap.fromTo(
    photo,
    { y: 160, scale: 0.55, rotate: -4 },
    {
      y: -20,
      scale: 1.3,
      rotate: 0,
      ease: "none",
      scrollTrigger: { trigger: king, start: "top bottom", end: "bottom 20%", scrub: 1 },
    }
  );

  // O brilho acompanha
  gsap.fromTo(
    king.querySelector(".king__glow"),
    { scale: 0.6 },
    { scale: 1.15, ease: "none", scrollTrigger: { trigger: king, start: "top bottom", end: "bottom top", scrub: true } }
  );

  // Os textos dos lados entram vindo de fora
  sides.forEach((el) => {
    const fromLeft = el.dataset.kingSide === "left";
    gsap.from(el, {
      x: window.innerWidth > 860 ? (fromLeft ? -60 : 60) : 0,
      y: window.innerWidth > 860 ? 0 : 30,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 85%" },
    });
  });

  // Recalcula depois que a abertura some (a página muda de altura)
  (window.preloaderDone || Promise.resolve()).then(() => ScrollTrigger.refresh());
}

/* ==========================================================================
   Processo: o vídeo do tabuleiro avança com a rolagem e as etapas acendem
   ========================================================================== */
const chess = document.querySelector("[data-chess]");
if (chess) {
  const video = chess.querySelector("[data-chess-video]");
  const steps = [...chess.querySelectorAll(".chess__step")];
  const bar = chess.querySelector("[data-chess-bar]");

  const setStep = (p) => {
    const active = Math.min(steps.length - 1, Math.floor(p * steps.length));
    steps.forEach((s, i) => {
      s.classList.toggle("is-active", i === active);
      s.classList.toggle("is-done", i < active);
    });
    if (bar) bar.style.transform = `scaleX(${p})`;
  };

  if (reduceMotion || !window.gsap || !window.ScrollTrigger) {
    // Sem animação: mostra a última cena (o rei) e todas as etapas
    chess.classList.add("is-static");
    video.addEventListener("loadedmetadata", () => { video.currentTime = video.duration; }, { once: true });
    video.preload = "metadata";
    video.load();
  } else {
    gsap.registerPlugin(ScrollTrigger);
    setStep(0);

    // Baixa o vídeo inteiro quando a seção se aproxima: assim dá pra avançar e
    // voltar quadro a quadro sem travar (e funciona em qualquer servidor)
    let loaded = false;
    const preload = async () => {
      if (loaded) return;
      loaded = true;
      try {
        if (!video.currentSrc) await new Promise((r) => video.addEventListener("loadedmetadata", r, { once: true }));
        const blob = await (await fetch(video.currentSrc)).blob();
        video.src = URL.createObjectURL(blob);
        video.load();
        await new Promise((r) => video.addEventListener("loadeddata", r, { once: true }));
        // iOS só deixa avançar o vídeo depois de um play; toca e pausa na hora
        await video.play().catch(() => {});
        video.pause();
        render();
      } catch (e) {
        console.error(e);
      }
    };
    new IntersectionObserver(([e]) => e.isIntersecting && preload(), { rootMargin: "1500px 0px" }).observe(chess);

    const state = { p: 0 };
    const render = () => {
      if (video.duration) {
        const t = state.p * (video.duration - 0.05);
        if (Math.abs(video.currentTime - t) > 0.01) video.currentTime = t;
      }
      setStep(state.p);
    };

    ScrollTrigger.create({
      trigger: chess,
      start: "top top",
      end: () => `+=${window.innerHeight * 2.4}`,
      pin: true,
      scrub: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        gsap.to(state, { p: self.progress, duration: 0.35, ease: "power2.out", overwrite: true, onUpdate: render });
      },
    });

    (window.preloaderDone || Promise.resolve()).then(() => ScrollTrigger.refresh());
  }
}

/* ==========================================================================
   Fechamento: vídeo do logo na mão toca só quando está na tela
   ========================================================================== */
const closingVideo = document.querySelector("[data-closing-video]");
if (closingVideo && !reduceMotion && "IntersectionObserver" in window) {
  new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) closingVideo.play().catch(() => {});
      else closingVideo.pause();
    },
    { rootMargin: "200px 0px" }
  ).observe(closingVideo);

  // Zoom na mão com o logo, acompanhando a rolagem, e o bloco preto crescendo junto
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    const closingBlock = document.querySelector(".closing");
    gsap.fromTo(
      closingBlock,
      { scale: 0.9 },
      { scale: 1, ease: "none", scrollTrigger: { trigger: closingBlock, start: "top bottom", end: "top 25%", scrub: 1 } }
    );
    gsap.fromTo(
      closingVideo,
      { scale: 0.6, y: 120 },
      {
        scale: 1.06,
        y: 10,
        ease: "none",
        scrollTrigger: { trigger: closingBlock, start: "top bottom", end: "bottom 35%", scrub: 1 },
      }
    );
  }
}
