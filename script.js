const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const yearElement = document.getElementById("year");
if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

if (window.AOS) {
  AOS.init({
    offset: 120,
    duration: prefersReducedMotion ? 0 : 700,
    once: true,
    disable: prefersReducedMotion
  });
}

if (window.gsap && !prefersReducedMotion) {
  gsap.from(".hero .split", {
    y: 28,
    opacity: 0,
    stagger: 0.12,
    duration: 0.85,
    ease: "power3.out"
  });
  gsap.from(".hero-sub", {
    y: 18,
    opacity: 0,
    delay: 0.2,
    duration: 0.8
  });
  gsap.from(".hero-ctas .btn, .hero-highlights li, .socials a", {
    y: 12,
    opacity: 0,
    stagger: 0.08,
    delay: 0.35,
    duration: 0.65
  });
}

function staggerAos(containerSelector, itemSelector, startDelay = 0, step = 80) {
  const container = document.querySelector(containerSelector);
  if (!container) {
    return;
  }

  const items = container.querySelectorAll(itemSelector);
  items.forEach((item, index) => {
    item.setAttribute("data-aos-delay", String(startDelay + index * step));
  });
}

staggerAos("#servicesCards", ".card", 80, 110);
staggerAos("#portfolioGrid", ".project", 80, 110);

const siteHeader = document.getElementById("siteHeader");
if (siteHeader) {
  const updateHeaderState = () => {
    siteHeader.classList.toggle("scrolled", window.scrollY > 16);
  };

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });
}

const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");
const navLinks = Array.from(document.querySelectorAll('.nav a[href^="#"]'));

function closeMenu() {
  if (!menuToggle || !siteNav) {
    return;
  }

  siteNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");

  const icon = menuToggle.querySelector("i");
  if (icon) {
    icon.className = "bx bx-menu";
  }
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));

    const icon = menuToggle.querySelector("i");
    if (icon) {
      icon.className = isOpen ? "bx bx-x" : "bx bx-menu";
    }
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}

const sections = Array.from(document.querySelectorAll("main section[id]"));
if ("IntersectionObserver" in window && sections.length && navLinks.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const activeId = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          const isActive = link.getAttribute("href") === `#${activeId}`;
          link.classList.toggle("active", isActive);
        });
      });
    },
    {
      threshold: 0.45,
      rootMargin: "-10% 0px -35% 0px"
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

function initializeSparkles() {
  const canvas = document.getElementById("sparkles");
  if (!canvas) {
    return;
  }

  const disableSparkles = prefersReducedMotion || window.matchMedia("(pointer: coarse)").matches;
  if (disableSparkles) {
    canvas.remove();
    return;
  }

  const context = canvas.getContext("2d");
  if (!context) {
    return;
  }

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  const particles = [];

  const randomBetween = (min, max) => Math.random() * (max - min) + min;

  function drawStar(x, y, radius, rotation, alpha) {
    context.save();
    context.translate(x, y);
    context.rotate(rotation);
    context.globalAlpha = alpha;
    context.fillStyle = "rgba(255, 255, 255, 0.95)";
    context.beginPath();

    for (let index = 0; index < 5; index += 1) {
      context.lineTo(
        Math.cos(((18 + index * 72) * Math.PI) / 180) * radius,
        -Math.sin(((18 + index * 72) * Math.PI) / 180) * radius
      );
      context.lineTo(
        Math.cos(((54 + index * 72) * Math.PI) / 180) * radius * 0.45,
        -Math.sin(((54 + index * 72) * Math.PI) / 180) * radius * 0.45
      );
    }

    context.closePath();
    context.fill();
    context.restore();
  }

  function spawn(x, y, count = Math.floor(randomBetween(1, 4))) {
    for (let index = 0; index < count; index += 1) {
      particles.push({
        x: x + randomBetween(-8, 8),
        y: y + randomBetween(-8, 8),
        vx: randomBetween(-0.5, 0.5),
        vy: randomBetween(-1.1, -0.1),
        radius: randomBetween(1.3, 3.6),
        rotation: randomBetween(0, Math.PI * 2),
        rotationVelocity: randomBetween(-0.07, 0.07),
        life: randomBetween(35, 70),
        age: 0
      });
    }
  }

  let lastMove = 0;
  window.addEventListener("mousemove", (event) => {
    const now = Date.now();
    if (now - lastMove < 35) {
      return;
    }

    spawn(event.clientX, event.clientY, 2);
    lastMove = now;
  });

  const ambientTimer = window.setInterval(() => {
    if (Math.random() < 0.35) {
      spawn(randomBetween(0, width), randomBetween(0, height * 0.7), 1);
    }
  }, 1200);

  function update() {
    context.clearRect(0, 0, width, height);

    for (let index = particles.length - 1; index >= 0; index -= 1) {
      const particle = particles[index];
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.015;
      particle.rotation += particle.rotationVelocity;
      particle.age += 1;

      const alpha = 1 - particle.age / particle.life;
      drawStar(particle.x, particle.y, particle.radius, particle.rotation, Math.max(alpha, 0));

      if (
        particle.age > particle.life ||
        particle.y > height + 40 ||
        particle.x < -40 ||
        particle.x > width + 40
      ) {
        particles.splice(index, 1);
      }
    }

    window.requestAnimationFrame(update);
  }

  update();

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener("beforeunload", () => {
    window.clearInterval(ambientTimer);
  });
}

initializeSparkles();

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

function setFormStatus(message, type = "") {
  if (!formStatus) {
    return;
  }

  formStatus.textContent = message;
  formStatus.classList.remove("success", "error");

  if (type) {
    formStatus.classList.add(type);
  }
}

function openMailFallback({ name, email, message }) {
  const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
  window.location.href = `mailto:dtharunkrishna65@gmail.com?subject=${subject}&body=${body}`;
}

if (window.emailjs) {
  emailjs.init("Ou_qu_feu12sSNEkc");
}

if (contactForm) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("cf-name")?.value.trim() || "";
    const email = document.getElementById("cf-email")?.value.trim() || "";
    const message = document.getElementById("cf-message")?.value.trim() || "";

    if (!name || !email || !message) {
      setFormStatus("Please complete all fields before sending.", "error");
      return;
    }

    setFormStatus("Sending your message...", "");

    if (!window.emailjs) {
      setFormStatus("Email service is unavailable. Opening your email app instead.", "error");
      openMailFallback({ name, email, message });
      return;
    }

    try {
      await emailjs.send("service_tpuqps7", "template_ln9myvv", {
        from_name: name,
        email_id: email,
        message
      });

      contactForm.reset();
      setFormStatus("Your message was sent successfully.", "success");
    } catch (error) {
      setFormStatus("The form could not send automatically. Opening your email app instead.", "error");
      openMailFallback({ name, email, message });
    }
  });

  contactForm.addEventListener("reset", () => {
    window.setTimeout(() => {
      setFormStatus("", "");
    }, 0);
  });
}
