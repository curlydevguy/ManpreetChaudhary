/* ==========================================================================
   CANVAS BACKGROUND — SOOTHING AIRY PARTICLES & SUBTLE AMBIENCE
   Light Theme • Soft Slate Blue & Sage Drift • Ultra Lightweight
   ========================================================================== */

(function initCanvasBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId = null;
  let width = 0;
  let height = 0;
  let particles = [];
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const PARTICLE_COUNT = window.innerWidth < 768 ? 22 : 42;
  const CONNECTION_DIST = 140;
  const MOUSE_DIST = 160;

  const mouse = {
    x: -1000,
    y: -1000,
    targetX: -1000,
    targetY: -1000
  };

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -10;
      this.vx = (Math.random() - 0.5) * 0.28;
      this.vy = (Math.random() * 0.2) + 0.1; // Gentle downward drift
      this.radius = Math.random() * 1.6 + 0.8;
      this.baseAlpha = Math.random() * 0.22 + 0.08;
      this.alpha = this.baseAlpha;
      // Alternate subtle slate blue and calm sage
      this.color = Math.random() > 0.4 ? '37, 99, 235' : '74, 124, 89';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Mouse deflection
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < MOUSE_DIST) {
        const force = (1 - dist / MOUSE_DIST) * 0.6;
        this.x -= (dx / dist) * force;
        this.y -= (dy / dist) * force;
        this.alpha = Math.min(0.45, this.baseAlpha + force * 0.3);
      } else {
        this.alpha += (this.baseAlpha - this.alpha) * 0.05;
      }

      if (this.y > height + 20) this.reset();
      if (this.x < -20) this.x = width + 20;
      if (this.x > width + 20) this.x = -20;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
      ctx.fill();
    }
  }

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    mouse.x += (mouse.targetX - mouse.x) * 0.1;
    mouse.y += (mouse.targetY - mouse.y) * 0.1;

    // Connect nearby particles with subtle serene line
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      p1.update();
      p1.draw();

      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECTION_DIST) {
          const lineAlpha = (1 - dist / CONNECTION_DIST) * 0.1;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(37, 99, 235, ${lineAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    if (!prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(render);
    }
  }

  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    mouse.targetX = -1000;
    mouse.targetY = -1000;
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    } else if (!prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(render);
    }
  });

  resize();
  if (!prefersReducedMotion) {
    render();
  }
})();
