const menuButton = document.querySelector('[data-menu-toggle]');
const mobileNav = document.querySelector('[data-mobile-nav]');

if (menuButton && mobileNav) {
  menuButton.addEventListener('click', () => {
    mobileNav.classList.toggle('is-open');
  });
}

const hero = document.querySelector('[data-hero]');

if (hero) {
  const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
  let current = 0;

  const showSlide = (index) => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === current);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === current);
    });
  };

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => showSlide(index));
  });

  if (slides.length > 1) {
    setInterval(() => showSlide(current + 1), 5600);
  }
}

const filterPanel = document.querySelector('[data-filter-panel]');

if (filterPanel) {
  const cards = Array.from(document.querySelectorAll('[data-card]'));
  const searchInput = filterPanel.querySelector('[data-filter-search]');
  const categorySelect = filterPanel.querySelector('[data-filter-category]');
  const yearSelect = filterPanel.querySelector('[data-filter-year]');
  const emptyState = document.querySelector('[data-empty-state]');
  const params = new URLSearchParams(window.location.search);
  const query = params.get('q');

  if (query && searchInput) {
    searchInput.value = query;
  }

  const applyFilters = () => {
    const keyword = (searchInput?.value || '').trim().toLowerCase();
    const category = categorySelect?.value || '';
    const year = yearSelect?.value || '';
    let visibleCount = 0;

    cards.forEach((card) => {
      const haystack = [
        card.dataset.title,
        card.dataset.region,
        card.dataset.genre,
        card.dataset.year
      ].join(' ').toLowerCase();
      const categoryMatched = !category || card.dataset.category === category;
      const yearMatched = !year || card.dataset.year === year;
      const keywordMatched = !keyword || haystack.includes(keyword);
      const visible = categoryMatched && yearMatched && keywordMatched;
      card.style.display = visible ? '' : 'none';
      if (visible) {
        visibleCount += 1;
      }
    });

    if (emptyState) {
      emptyState.style.display = visibleCount ? 'none' : 'block';
    }
  };

  filterPanel.addEventListener('input', applyFilters);
  filterPanel.addEventListener('change', applyFilters);
  filterPanel.addEventListener('submit', (event) => {
    event.preventDefault();
    applyFilters();
  });
  applyFilters();
}
