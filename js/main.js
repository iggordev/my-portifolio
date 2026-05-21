(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

  if (hasFinePointer) document.body.classList.add("has-pointer");

  /* ---------- Typing effect ---------- */
  const roles = ["Cloud & DevOps", "Engenharia de Prompt", "Infraestrutura AWS"];
  const typedEl = document.getElementById("typedRole");
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function typeLoop() {
    if (!typedEl || prefersReducedMotion) {
      if (typedEl) typedEl.textContent = roles[0];
      return;
    }

    const current = roles[roleIndex];
    const display = deleting
      ? current.slice(0, charIndex - 1)
      : current.slice(0, charIndex + 1);

    typedEl.textContent = display;
    charIndex = deleting ? charIndex - 1 : charIndex + 1;

    let delay = deleting ? 45 : 90;
    if (!deleting && charIndex === current.length) {
      delay = 2200;
      deleting = true;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 500;
    }

    setTimeout(typeLoop, delay);
  }

  typeLoop();

  /* ---------- Particle canvas ---------- */
  const canvas = document.getElementById("heroCanvas");
  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext("2d");
    let particles = [];
    let w, h;
    let mouse = { x: -9999, y: -9999 };

    function resize() {
      w = canvas.width = canvas.offsetWidth * devicePixelRatio;
      h = canvas.height = canvas.offsetHeight * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      const count = Math.min(80, Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 12000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.5,
      }));
    }

    function draw() {
      const cw = canvas.offsetWidth;
      const ch = canvas.offsetHeight;
      ctx.clearRect(0, 0, cw, ch);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > cw) p.vx *= -1;
        if (p.y < 0 || p.y > ch) p.vy *= -1;

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120 && hasFinePointer) {
          p.x -= dx * 0.02;
          p.y -= dy * 0.02;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(56, 189, 248, 0.5)";
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 100) {
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.15 * (1 - d / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener("resize", resize);
    canvas.closest(".hero")?.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
  }

  /* ---------- Cursor glow ---------- */
  const glow = document.querySelector(".cursor-glow");
  if (glow && hasFinePointer && !prefersReducedMotion) {
    let gx = 0;
    let gy = 0;
    let tx = 0;
    let ty = 0;

    document.addEventListener("mousemove", (e) => {
      tx = e.clientX;
      ty = e.clientY;
    });

    function animateGlow() {
      gx += (tx - gx) * 0.12;
      gy += (ty - gy) * 0.12;
      glow.style.left = `${gx}px`;
      glow.style.top = `${gy}px`;
      requestAnimationFrame(animateGlow);
    }
    animateGlow();
  }

  /* ---------- Scroll progress & header ---------- */
  const header = document.getElementById("header");
  const progress = document.querySelector(".scroll-progress");
  let lastScroll = 0;

  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = `${(y / max) * 100}%`;

    header?.classList.toggle("header--scrolled", y > 40);
    if (y > lastScroll && y > 200) {
      header?.classList.add("header--hidden");
    } else {
      header?.classList.remove("header--hidden");
    }
    lastScroll = y;
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Active nav links ---------- */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach((link) => {
          const href = link.getAttribute("href");
          link.classList.toggle("active", href === `#${id}`);
        });
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  sections.forEach((s) => sectionObserver.observe(s));

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealEls.forEach((el) => {
    if (prefersReducedMotion) el.classList.add("visible");
    else revealObserver.observe(el);
  });

  /* ---------- Skill bars ---------- */
  const skillBars = document.querySelectorAll(".skill-bar span");
  const barObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const bar = entry.target;
        const pct = bar.dataset.progress || "0";
        bar.style.setProperty("--progress", `${pct}%`);
        bar.classList.add("filled");
        barObserver.unobserve(bar);
      });
    },
    { threshold: 0.5 }
  );

  skillBars.forEach((bar) => {
    if (prefersReducedMotion) {
      bar.style.setProperty("--progress", `${bar.dataset.progress}%`);
      bar.classList.add("filled");
    } else barObserver.observe(bar);
  });

  /* ---------- Timeline line ---------- */
  const timeline = document.querySelector(".timeline");
  if (timeline) {
    const tlObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            timeline.classList.add("visible");
            tlObserver.unobserve(timeline);
          }
        });
      },
      { threshold: 0.2 }
    );
    if (!prefersReducedMotion) tlObserver.observe(timeline);
    else timeline.classList.add("visible");
  }

  /* ---------- Counter animation ---------- */
  const counters = document.querySelectorAll("[data-count]");
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        if (prefersReducedMotion) {
          el.textContent = target;
          return;
        }
        let current = 0;
        const step = Math.ceil(target / 30);
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
          } else el.textContent = current;
        }, 40);
        counterObserver.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((c) => counterObserver.observe(c));

  /* ---------- Mobile menu ---------- */
  const navToggle = document.getElementById("navToggle");
  const menu = document.getElementById("menu");

  navToggle?.addEventListener("click", () => {
    const open = menu?.classList.toggle("open");
    navToggle.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(!!open));
    document.body.classList.toggle("menu-open", !!open);
  });

  menu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      navToggle?.classList.remove("open");
      navToggle?.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    });
  });

  /* ---------- Magnetic buttons ---------- */
  if (hasFinePointer && !prefersReducedMotion) {
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });
  }

  /* ---------- 3D tilt on cards ---------- */
  if (hasFinePointer && !prefersReducedMotion) {
    document.querySelectorAll("[data-tilt-card]").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(8px)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });

    document.querySelectorAll(".tag[data-tilt]").forEach((tag) => {
      tag.addEventListener("mousemove", (e) => {
        const rect = tag.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        tag.style.transform = `translate(${x * 6}px, ${y * 6}px) scale(1.05)`;
      });
      tag.addEventListener("mouseleave", () => {
        tag.style.transform = "";
      });
    });
  }

  /* ---------- Ripple on buttons ---------- */
  document.querySelectorAll("[data-ripple]").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      this.appendChild(ripple);
      ripple.addEventListener("animationend", () => ripple.remove());
    });
  });
})();
