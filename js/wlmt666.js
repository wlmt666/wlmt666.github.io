(() => {
  const bootAboutPage = () => {
    const stage = document.querySelector('.about-stage');
    const particlesLayer = document.querySelector('.about-particles');
    const cards = document.querySelectorAll('.about-card');
    if (!stage || !particlesLayer || !cards.length) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.matchMedia('(max-width: 640px)').matches;
    const colors = ['rgba(98,255,230,.9)', 'rgba(255,87,214,.9)', 'rgba(245,201,103,.9)', 'rgba(142,123,255,.9)'];

    if (!particlesLayer.children.length) {
      const count = mobile ? 8 : 14;
      for (let i = 0; i < count; i += 1) {
        const particle = document.createElement('span');
        particle.className = 'about-particle';
        particle.style.setProperty('--x', `${Math.random() * 100}%`);
        particle.style.setProperty('--y', `${Math.random() * 100}%`);
        particle.style.setProperty('--size', `${8 + Math.random() * 18}px`);
        particle.style.setProperty('--duration', `${6 + Math.random() * 8}s`);
        particle.style.setProperty('--delay', `${Math.random() * 4}s`);
        particle.style.setProperty('--color', colors[i % colors.length]);
        particlesLayer.appendChild(particle);
      }
    }

    const observer = 'IntersectionObserver' in window
      ? new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.2 })
      : null;

    cards.forEach(card => {
      if (observer) observer.observe(card);
      else card.classList.add('is-visible');
    });

    if (prefersReduced) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const render = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      stage.style.setProperty('--about-bg-x', `${currentX * 0.03}px`);
      stage.style.setProperty('--about-bg-y', `${currentY * 0.03}px`);
      cards.forEach((card, index) => {
        const depth = (index % 2 === 0 ? 1 : -1) * 0.4;
        card.style.setProperty('--tilt-x', `${currentX * depth * 0.02}px`);
        card.style.setProperty('--tilt-y', `${currentY * depth * 0.02}px`);
      });
      window.requestAnimationFrame(render);
    };

    const updateTarget = event => {
      const rect = stage.getBoundingClientRect();
      targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 26;
      targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 18;
    };

    stage.addEventListener('pointermove', updateTarget);
    stage.addEventListener('pointerleave', () => {
      targetX = 0;
      targetY = 0;
    });
    render();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootAboutPage, { once: true });
  } else {
    bootAboutPage();
  }
})();
