document.addEventListener('scroll', () => {
  document.querySelectorAll('.feature, .tariff-card').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      el.style.transition = '0.6s';
      el.style.transform = 'translateY(0)';
      el.style.opacity = '1';
    }
  });
});
