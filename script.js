/* ==========================================================================
   Configuração: edite aqui seus links e o destino da lista de espera.
   ========================================================================== */
const CONFIG = {
  // Seu @ do Instagram, sem o "@" (ex.: "silaskhalek"). Vazio esconde os links.
  instagram: "",

  // URL que recebe os cadastros da lista de espera (ex.: endpoint do Formspree,
  // "https://formspree.io/f/xxxxxxx"). Recebe nome, email e whatsapp via POST.
  formEndpoint: "",

  // Alternativa sem backend: número do WhatsApp com DDI e DDD, só dígitos
  // (ex.: "5511999999999"). Usado apenas se formEndpoint estiver vazio.
  whatsapp: "",
};

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
  revealEls.forEach((el, i) => {
    // Escalona elementos irmãos para um efeito em cascata
    const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
    el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 6) * 70}ms`;
    io.observe(el);
  });
} else {
  revealEls.forEach((el) => el.classList.add("is-visible"));
}

// Lista de espera
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
    setStatus(`Pronto, ${nome.split(" ")[0]}! Você está na lista. Fica de olho no seu e-mail.`, "ok");
  } catch (err) {
    console.error(err);
    setStatus("Não deu pra enviar agora. Tenta de novo em instantes.", "error");
  } finally {
    button.disabled = false;
  }
});
