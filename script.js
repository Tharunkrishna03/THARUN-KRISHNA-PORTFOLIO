// ---------- basic page helpers ----------
document.getElementById('year').textContent = new Date().getFullYear?.() || new Date().getFullYear();

// init AOS (scroll animations)
AOS.init({ offset: 140, duration: 700, once: true });

// GSAP hero reveal
if (window.gsap) {
  gsap.from(".hero .split", { y: 30, opacity: 0, stagger: 0.12, duration: 0.9, ease: "power3.out" });
  gsap.from(".hero-sub", { y: 12, opacity: 0, delay: 0.25, duration: 0.8 });
  gsap.from(".hero-ctas .btn", { y: 10, opacity: 0, stagger: 0.08, delay: 0.45 });
}

// Add incremental AOS delays to service & portfolio cards (slide-up stagger)
function staggerAos(containerSelector, itemSelector, startDelay = 0, step = 80) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  const items = container.querySelectorAll(itemSelector);
  items.forEach((it, i) => {
    const delay = startDelay + i * step;
    it.setAttribute('data-aos-delay', String(delay));
  });
}
staggerAos('#servicesCards', '.card', 60, 120);
staggerAos('#portfolioGrid', '.card, .project', 60, 120);

// ---------------- star sparkle particles ----------------
(() => {
  const canvas = document.getElementById('sparkles');
  const ctx = canvas.getContext('2d');
  let w = canvas.width = innerWidth;
  let h = canvas.height = innerHeight;
  const particles = [];

  function rand(min, max){ return Math.random() * (max - min) + min; }

  // star drawing (simple 5-point)
  function drawStar(x, y, r, rotation, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      ctx.lineTo(Math.cos((18 + i * 72) / 180 * Math.PI) * r, -Math.sin((18 + i * 72) / 180 * Math.PI) * r);
      ctx.lineTo(Math.cos((54 + i * 72) / 180 * Math.PI) * (r * 0.45), -Math.sin((54 + i * 72) / 180 * Math.PI) * (r * 0.45));
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function spawn(x, y) {
    const count = Math.floor(rand(2, 5));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: x + rand(-6, 6),
        y: y + rand(-6, 6),
        vx: rand(-0.6, 0.6),
        vy: rand(-1.4, -0.2),
        r: rand(1.8, 4.8),
        rot: rand(0, Math.PI * 2),
        vrot: rand(-0.08, 0.08),
        life: rand(40, 90),
        age: 0
      });
    }
  }

  // mouse follow spawns
  let lastMove = 0;
  window.addEventListener('mousemove', (e) => {
    const now = Date.now();
    // limit spawn frequency for perf
    if (now - lastMove > 10) {
      spawn(e.clientX, e.clientY);
      lastMove = now;
    }
  });

  // gentle ambient spawn (floating stars across the screen)
  setInterval(() => {
    // spawn near top area occasionally
    if (Math.random() < 0.3) {
      spawn(rand(0, w), rand(0, h * 0.6));
    }
  }, 900);

  function update() {
    ctx.clearRect(0,0,w,h);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.02; // gravity-like
      p.rot += p.vrot;
      p.age++;
      const alpha = 1 - p.age / p.life;
      drawStar(p.x, p.y, p.r, p.rot, Math.max(alpha, 0));
      if (p.age > p.life || p.y > h + 40 || p.x < -40 || p.x > w + 40) {
        particles.splice(i,1);
      }
    }
    requestAnimationFrame(update);
  }
  update();

  window.addEventListener('resize', () => {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
  });
})();

// ---------------- contact form (mailto fallback) ----------------
(function () {
  emailjs.init("Ou_qu_feu12sSNEkc"); // your public key
})();

function sendmail(event) {
  event.preventDefault(); // stop the page from reloading

  emailjs
    .send("service_tpuqps7", "template_ln9myvv", {
      from_name: document.getElementById("cf-name").value,
      email_id: document.getElementById("cf-email").value, 
      message: document.getElementById("cf-message").value,
    })
    .then(
      function (response) {
        alert(" Message sent successfully!");
        document.getElementById("contactForm").reset(); // optional: clear the form
      },
      function (error) {
        alert("FAILED... " + error.text);
      }
    );
}

// ---------------- mobile menu (simple) ----------------
const menuToggle = document.getElementById('menuToggle');
if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    document.querySelector('.nav')?.classList.toggle('open');
  });
}
function makecall() {
  window.location.href = "tel:+91 9597151915";
}

function makemail() {
  window.location.href = "mailto:dtharunkrishna65@gmail.com";
}