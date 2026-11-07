/* ==========================================================================
   Configuração: edite aqui seus links e o destino da lista de espera.
   ========================================================================== */
const CONFIG = {
  // Seu @ do Instagram, sem o "@" (ex.: "silaskhalek"). Vazio esconde os links.
  instagram: "silas.khalek",

  // URL que recebe os cadastros da lista de espera (ex.: endpoint do Formspree,
  // "https://formspree.io/f/xxxxxxx"). Recebe nome, email e whatsapp via POST.
  formEndpoint: "",

  // Alternativa sem backend: número do WhatsApp com DDI e DDD, só dígitos
  // (ex.: "5511999999999"). Usado apenas se formEndpoint estiver vazio.
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
const t = (pt) => (window.i18n ? window.i18n.t(pt) : pt);
const scenarios = () => (isEN() ? SCENARIOS_EN : SCENARIOS_PT);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.documentElement.classList.remove("no-js");

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
  nav.classList.toggle("is-over-dark", isUnderNav(closing) || isUnderNav(document.querySelector("[data-king]")));
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
      copyLabel.textContent = t("Copiado!");
      copyBtn.classList.add("is-copied");
    } catch {
      copyLabel.textContent = t("Não deu pra copiar");
    }
    setTimeout(() => {
      copyLabel.textContent = t("Copiar comando");
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

const process = document.querySelector("[data-process]");
const processSteps = process ? [...process.querySelectorAll(".process__step")] : [];

const updateScroll = () => {
  fillEls.forEach(({ el, words }) => {
    const lit = reduceMotion ? words.length : Math.round(scrollProgress(el, 0.85, 0.45) * words.length);
    words.forEach((w, i) => w.classList.toggle("is-lit", i < lit));
  });

  // Processo: as etapas acendem uma a uma conforme a rolagem
  if (process) {
    const on = reduceMotion ? processSteps.length : Math.max(1, Math.ceil(scrollProgress(process, 0.8, 0.4) * processSteps.length));
    processSteps.forEach((step, i) => step.classList.toggle("is-active", i < on));
  }
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
    if (mini.classList.contains("is-done")) typed.textContent = t(original);
  });

  (window.preloaderDone || Promise.resolve()).then(() =>
    whenVisible(mini, async () => {
      await new Promise((r) => setTimeout(r, 250 + i * 450));
      for (const char of t(original)) {
        typed.textContent += char;
        await new Promise((r) => setTimeout(r, 26 + Math.random() * 30));
      }
      await new Promise((r) => setTimeout(r, 250));
      mini.classList.add("is-done");
    })
  );
});

/* ==========================================================================
   Números que sobem quando aparecem na tela
   ========================================================================== */
document.querySelectorAll("[data-count]").forEach((el) => {
  const target = Number(el.dataset.count);
  if (reduceMotion) return;
  el.textContent = "0";
  (window.preloaderDone || Promise.resolve()).then(() =>
    whenVisible(el, () => {
      const start = performance.now();
      const DURATION = 1400;
      const tick = (now) => {
        const t = Math.min(1, (now - start) / DURATION);
        el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3)));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
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

  // O rei sobe, cresce e gira de leve enquanto a seção passa pela tela
  gsap.fromTo(
    photo,
    { y: 90, scale: 0.82, rotate: -3 },
    {
      y: -30,
      scale: 1.04,
      rotate: 0,
      ease: "none",
      scrollTrigger: { trigger: king, start: "top bottom", end: "bottom 30%", scrub: 0.6 },
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

  // Entra com um zoom suave
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from(closingVideo, {
      scale: 0.88,
      opacity: 0,
      duration: 1.4,
      ease: "power3.out",
      scrollTrigger: { trigger: closingVideo, start: "top 85%" },
    });
  }
}

/* ==========================================================================
   Lista de espera
   ========================================================================== */
const form = document.getElementById("waitlist");
const statusEl = form.querySelector(".form__status");

const setStatus = (msg, type) => {
  statusEl.textContent = msg;
  statusEl.className = `form__status ${type ? `is-${type}` : ""}`;
};

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = form.nome.value.trim();
  const email = form.email.value.trim();
  const whatsapp = form.whatsapp.value.trim();

  form.nome.setAttribute("aria-invalid", String(!nome));
  form.email.setAttribute("aria-invalid", String(!isEmail(email)));

  if (!nome || !isEmail(email)) {
    setStatus(t("Preencha seu nome e um e-mail válido."), "error");
    (!nome ? form.nome : form.email).focus();
    return;
  }

  const button = form.querySelector("button");
  button.disabled = true;
  setStatus(t("Enviando…"));

  try {
    if (CONFIG.formEndpoint) {
      const res = await fetch(CONFIG.formEndpoint, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, whatsapp }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } else if (CONFIG.whatsapp) {
      const msg = isEN()
        ? `Hi Silas! I'd like to join the course waitlist.\nName: ${nome}\nEmail: ${email}`
        : `Oi, Silas! Quero entrar na lista de espera do curso.\nNome: ${nome}\nE-mail: ${email}`;
      window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
    } else {
      throw new Error("Nenhum destino configurado em CONFIG (formEndpoint ou whatsapp).");
    }

    form.classList.add("is-done");
    const primeiroNome = nome.split(" ")[0];
    const ok = isEN()
      ? CONFIG.formEndpoint
        ? `Done, ${primeiroNome}! You're on the list. Keep an eye on your inbox.`
        : `Almost there, ${primeiroNome}! We opened WhatsApp: just send the message to save your spot.`
      : CONFIG.formEndpoint
        ? `Pronto, ${primeiroNome}! Você está na lista. Fica de olho no seu e-mail.`
        : `Quase lá, ${primeiroNome}! Abrimos o WhatsApp: é só enviar a mensagem pra garantir seu lugar.`;
    setStatus(ok, "ok");
  } catch (err) {
    console.error(err);
    setStatus(t("Não deu pra enviar agora. Tenta de novo em instantes."), "error");
  } finally {
    button.disabled = false;
  }
});
