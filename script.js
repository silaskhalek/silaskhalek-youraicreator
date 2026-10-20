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
const SCENARIOS = [
  {
    path: "~/videos/live-sabado",
    cmd: "Pega a live de sábado, encontra os 3 momentos mais fortes e transforma cada um num vídeo vertical com legenda no meu estilo.",
    steps: [
      "Lê a transcrição e marca os trechos com mais energia",
      "Reenquadra pro vertical acompanhando o rosto",
      "Aplica a sua legenda e exporta os três",
    ],
    done: "✓ 3 vídeos prontos em ~/videos/live-sabado/cortes",
  },
  {
    path: "~/sites/meu-curso",
    cmd: "Cria uma landing page pro meu curso com a minha identidade visual e um formulário de lista de espera.",
    steps: [
      "Lê a paleta e as fontes da sua marca",
      "Escreve a copy e monta as seções",
      "Publica e gera o link",
    ],
    done: "✓ site no ar · meucurso.vercel.app",
  },
  {
    path: "~/posts/amanha",
    cmd: "Gera 3 capas pro post de amanhã no meu estilo, formato 4:5, com o título em destaque.",
    steps: [
      "Analisa as suas capas com mais alcance",
      "Gera variações no seu estilo",
      "Exporta em 1080×1350",
    ],
    done: "✓ 3 imagens salvas em ~/posts/amanha",
  },
  {
    path: "~/roteiros",
    cmd: "Escreve 5 roteiros de reels sobre IA pra quem está começando, com gancho forte nos 3 primeiros segundos.",
    steps: [
      "Levanta as dúvidas mais comuns do público",
      "Estrutura gancho, conteúdo e chamada",
      "Salva tudo em roteiros.md",
    ],
    done: "✓ roteiros.md · 5 roteiros prontos pra gravar",
  },
];

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

// Borda da navegação ao rolar
const nav = document.querySelector(".nav");
const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 8);
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
    this.path.textContent = `claude · ${s.path}`;
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

// Terminal do topo: passa pelos comandos em loop
const heroEl = document.querySelector('[data-term="hero"]');
if (heroEl) {
  const hero = new Terminal(heroEl);
  let i = 0;
  const loop = async () => {
    try {
      await hero.play(SCENARIOS[i]);
      if (reduceMotion) return;
      await hero.wait(3200, hero.run);
      i = (i + 1) % SCENARIOS.length;
      loop();
    } catch { /* cancelado */ }
  };
  hero.show(SCENARIOS[0]);
  whenVisible(heroEl, loop);
}

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
    method.play(SCENARIOS[index]).catch(() => {});
  };

  tabs.forEach((tab, i) => tab.addEventListener("click", () => select(i)));
  method.show(SCENARIOS[0]);
  whenVisible(methodEl, () => select(0));

  const copyBtn = document.querySelector("[data-copy]");
  const copyLabel = copyBtn.querySelector(".copy__label");
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(SCENARIOS[current].cmd);
      copyLabel.textContent = "Copiado!";
      copyBtn.classList.add("is-copied");
    } catch {
      copyLabel.textContent = "Não deu pra copiar";
    }
    setTimeout(() => {
      copyLabel.textContent = "Copiar comando";
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

const roadmap = document.querySelector("[data-roadmap]");
const roadmapItems = roadmap ? [...roadmap.querySelectorAll(".roadmap__item")] : [];

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

  if (roadmap) {
    const p = reduceMotion ? 1 : scrollProgress(roadmap, 0.6, 0.6);
    roadmap.style.setProperty("--fill", p.toFixed(3));
    const line = roadmap.getBoundingClientRect();
    roadmapItems.forEach((item) => {
      const dot = item.querySelector(".roadmap__num").getBoundingClientRect();
      const reached = (dot.top + dot.height / 2 - line.top) / line.height <= p + 0.02;
      item.classList.toggle("is-reached", reached);
    });
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
    setStatus("Preencha seu nome e um e-mail válido.", "error");
    (!nome ? form.nome : form.email).focus();
    return;
  }

  const button = form.querySelector("button");
  button.disabled = true;
  setStatus("Enviando…");

  try {
    if (CONFIG.formEndpoint) {
      const res = await fetch(CONFIG.formEndpoint, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, whatsapp }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } else if (CONFIG.whatsapp) {
      const msg = `Oi, Silas! Quero entrar na lista de espera do curso.\nNome: ${nome}\nE-mail: ${email}`;
      window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
    } else {
      throw new Error("Nenhum destino configurado em CONFIG (formEndpoint ou whatsapp).");
    }

    form.classList.add("is-done");
    const primeiroNome = nome.split(" ")[0];
    setStatus(
      CONFIG.formEndpoint
        ? `Pronto, ${primeiroNome}! Você está na lista. Fica de olho no seu e-mail.`
        : `Quase lá, ${primeiroNome}! Abrimos o WhatsApp: é só enviar a mensagem pra garantir seu lugar.`,
      "ok"
    );
  } catch (err) {
    console.error(err);
    setStatus("Não deu pra enviar agora. Tenta de novo em instantes.", "error");
  } finally {
    button.disabled = false;
  }
});
