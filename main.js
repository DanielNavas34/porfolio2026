/* ═══════════════════════════════════════════
   GSAP SETUP
═══════════════════════════════════════════ */
gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════
   CURSOR
═══════════════════════════════════════════ */
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0 });
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  follower.style.left = followerX + 'px';
  follower.style.top = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

// Cursor grow on hover
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => {
    gsap.to(cursor, { width: 24, height: 24, duration: 0.3 });
    gsap.to(follower, { scale: 1.5, duration: 0.3 });
  });
  el.addEventListener('mouseleave', () => {
    gsap.to(cursor, { width: 12, height: 12, duration: 0.3 });
    gsap.to(follower, { scale: 1, duration: 0.3 });
  });
});

/* ═══════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ═══════════════════════════════════════════
   HAMBURGER
═══════════════════════════════════════════ */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
  });
});

/* ═══════════════════════════════════════════
   PROGRESS BAR
═══════════════════════════════════════════ */
const progressBar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  progressBar.style.width = pct + '%';
});

/* ═══════════════════════════════════════════
   PARTICLES CANVAS
═══════════════════════════════════════════ */
(function() {
  const canvas = document.getElementById('particles-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.1
    };
  }

  for (let i = 0; i < 80; i++) particles.push(createParticle());

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,245,212,${p.alpha})`;
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    });
    requestAnimationFrame(drawParticles);
  }
  drawParticles();

  // Draw subtle connections
  setInterval(() => {
    particles.forEach((p1, i) => {
      particles.slice(i + 1).forEach(p2 => {
        const d = Math.hypot(p1.x - p2.x, p1.y - p2.y);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0,245,212,${0.06 * (1 - d/120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      });
    });
  }, 50);
})();

/* ═══════════════════════════════════════════
   HERO ANIMATIONS
═══════════════════════════════════════════ */
const tl = gsap.timeline({ delay: 0.2 });

// Name reveal
const nameWords = document.querySelectorAll('.hero-name .word');
tl.from(nameWords, {
  y: '110%',
  duration: 1,
  ease: 'power4.out',
  stagger: 0.12
});

tl.to('#hero-badge', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4');
tl.to('#hero-role', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3');
tl.to('#hero-desc', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.2');
tl.to('#hero-actions', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.2');
tl.to('#hero-meta', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.2');
tl.to('#scroll-indicator', { opacity: 1, duration: 0.6 }, '-=0.1');

/* ═══════════════════════════════════════════
   SCROLL ANIMATIONS
═══════════════════════════════════════════ */
document.querySelectorAll('.reveal').forEach(el => {
  gsap.fromTo(el, 
    { opacity: 0, y: 40 },
    {
      opacity: 1, y: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    }
  );
});

document.querySelectorAll('.reveal-left').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, x: -40 },
    {
      opacity: 1, x: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    }
  );
});

document.querySelectorAll('.reveal-right').forEach(el => {
  gsap.fromTo(el,
    { opacity: 0, x: 40 },
    {
      opacity: 1, x: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    }
  );
});

/* Stagger for tech items */
document.querySelectorAll('.tech-grid').forEach(grid => {
  const items = grid.querySelectorAll('.tech-item');
  gsap.fromTo(items,
    { opacity: 0, y: 20, scale: 0.95 },
    {
      opacity: 1, y: 0, scale: 1,
      duration: 0.5,
      ease: 'power2.out',
      stagger: 0.06,
      scrollTrigger: {
        trigger: grid,
        start: 'top 90%',
        toggleActions: 'play none none none'
      }
    }
  );
});

/* Stagger for cards */
document.querySelectorAll('.project-card, .service-card').forEach((card, i) => {
  gsap.fromTo(card,
    { opacity: 0, y: 40 },
    {
      opacity: 1, y: 0,
      duration: 0.7,
      ease: 'power3.out',
      delay: (i % 2) * 0.12,
      scrollTrigger: {
        trigger: card,
        start: 'top 90%',
        toggleActions: 'play none none none'
      }
    }
  );
});

/* ═══════════════════════════════════════════
   COUNTERS
═══════════════════════════════════════════ */
document.querySelectorAll('.counter').forEach(counter => {
  const target = parseInt(counter.dataset.target);
  ScrollTrigger.create({
    trigger: counter,
    start: 'top 85%',
    onEnter: () => {
      gsap.fromTo({ val: 0 }, { val: target, duration: 1.5, ease: 'power2.out',
        onUpdate: function() {
          counter.textContent = '+' + Math.ceil(this.targets()[0].val);
        }
      });
    },
    once: true
  });
});

/* ═══════════════════════════════════════════
   MAGNETIC BUTTONS
═══════════════════════════════════════════ */
document.querySelectorAll('.btn-primary, .btn-secondary, .nav-cta').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btn, { x: x * 0.2, y: y * 0.2, duration: 0.3, ease: 'power2.out' });
  });
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
  });
});

/* ═══════════════════════════════════════════
   HOVER 3D on project cards
═══════════════════════════════════════════ */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width - 0.5;
    const cy = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(card, {
      rotateY: cx * 6,
      rotateX: -cy * 6,
      transformPerspective: 800,
      ease: 'power1.out',
      duration: 0.4
    });
  });
  card.addEventListener('mouseleave', () => {
    gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.5, ease: 'power2.out' });
  });
});

/* ═══════════════════════════════════════════
   SMOOTH SECTION HIGHLIGHT IN NAV
═══════════════════════════════════════════ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute('href') === '#' + current ? 'var(--accent)' : '';
  });
});

/* ═══════════════════════════════════════════
   FORM (Actualizado para abrir cliente de correo)
═══════════════════════════════════════════ */
function handleFormSubmit() {
  const nombre = document.getElementById('nombre').value;
  const email = document.getElementById('email').value;
  const asunto = document.getElementById('asunto').value;
  const mensaje = document.getElementById('mensaje').value;

  const asuntoCodificado = encodeURIComponent(asunto || 'Nuevo contacto desde el Portfolio');
  const cuerpoCodificado = encodeURIComponent(`Nombre: ${nombre}\nEmail: ${email}\n\nMensaje:\n${mensaje}`);

  const mailtoLink = `mailto:danielnavas711900@gmail.com?subject=${asuntoCodificado}&body=${cuerpoCodificado}`;

  window.location.href = mailtoLink;

  const btn = document.querySelector('.form-submit');
  btn.textContent = '✓ Abriendo correo...';
  btn.style.background = '#1a1a1a';
  btn.style.color = 'var(--accent)';
  btn.style.borderColor = 'var(--accent)';
  
  setTimeout(() => {
    btn.innerHTML = 'Enviar mensaje <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
    btn.style.background = 'var(--accent)';
    btn.style.color = '#000';
    btn.style.borderColor = 'transparent';
    
    // Limpiamos los campos
    document.getElementById('nombre').value = '';
    document.getElementById('email').value = '';
    document.getElementById('asunto').value = '';
    document.getElementById('mensaje').value = '';
  }, 3000);
}

/* ═══════════════════════════════════════════
   MODAL GALLERY LOGIC (Actualizado robusto)
═══════════════════════════════════════════ */
function openGallery(projectId) {
  const modal = document.getElementById('gallery-modal');
  if (!modal) return;
  
  const modalContent = modal.querySelector('.modal-content');
  const modalImages = modal.querySelectorAll('.modal-item');

  modal.classList.add('active');
  
  // Bloquear el scroll de la página de fondo
  document.body.style.overflow = 'hidden';

  // Animación GSAP para la entrada del modal
  gsap.to(modal, { opacity: 1, duration: 0.4, ease: 'power2.out' });
  
  // Animación GSAP para el contenedor (escala desde abajo)
  gsap.fromTo(modalContent, 
    { y: 50, scale: 0.95, opacity: 0 }, 
    { y: 0, scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.2)', delay: 0.1 }
  );

  // Animación escalonada para las fotos
  gsap.fromTo(modalImages,
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: 'power2.out', delay: 0.3 }
  );
}

function closeGallery() {
  const modal = document.getElementById('gallery-modal');
  if (!modal) return;
  
  const modalContent = modal.querySelector('.modal-content');
  
  // Desbloquear el scroll
  document.body.style.overflow = '';
  
  // Animación de salida
  gsap.to(modalContent, { y: 30, scale: 0.95, opacity: 0, duration: 0.3, ease: 'power2.in' });
  gsap.to(modal, { opacity: 0, duration: 0.4, ease: 'power2.in', delay: 0.1, onComplete: () => {
    modal.classList.remove('active');
  }});
}

// Cerrar modal con la tecla ESC
document.addEventListener('keydown', (e) => {
  const modal = document.getElementById('gallery-modal');
  if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
    closeGallery();
  }
});