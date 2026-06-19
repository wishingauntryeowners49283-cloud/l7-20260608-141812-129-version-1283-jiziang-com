import { H as Hls } from './hls-dru42stk.js';

function setupMobileNavigation() {
  const toggle = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-site-nav]');

  if (!toggle || !nav) {
    return;
  }

  toggle.addEventListener('click', () => {
    nav.classList.toggle('is-open');
  });
}

function setupHeroCarousel() {
  const carousel = document.querySelector('[data-hero-carousel]');

  if (!carousel) {
    return;
  }

  const slides = Array.from(carousel.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(carousel.querySelectorAll('[data-hero-dot]'));
  const previous = carousel.querySelector('[data-hero-prev]');
  const next = carousel.querySelector('[data-hero-next]');
  let current = 0;
  let timer = null;

  function showSlide(index) {
    current = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === current);
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === current);
    });
  }

  function schedule() {
    window.clearInterval(timer);
    timer = window.setInterval(() => showSlide(current + 1), 5600);
  }

  dots.forEach((dot, dotIndex) => {
    dot.addEventListener('click', () => {
      showSlide(dotIndex);
      schedule();
    });
  });

  previous?.addEventListener('click', () => {
    showSlide(current - 1);
    schedule();
  });

  next?.addEventListener('click', () => {
    showSlide(current + 1);
    schedule();
  });

  if (slides.length > 1) {
    schedule();
  }
}

function setupVideoPlayers() {
  const videos = Array.from(document.querySelectorAll('.js-hls-player'));

  videos.forEach((video) => {
    const source = video.dataset.src;
    const shell = video.closest('.player-shell');
    const startButton = shell?.querySelector('.player-start');

    if (!source) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });

      hls.loadSource(source);
      hls.attachMedia(video);
    } else {
      video.src = source;
    }

    startButton?.addEventListener('click', async () => {
      try {
        await video.play();
      } catch (error) {
        video.controls = true;
      }
    });

    video.addEventListener('play', () => {
      shell?.classList.add('is-playing');
    });

    video.addEventListener('pause', () => {
      shell?.classList.remove('is-playing');
    });
  });
}

function setupDetailActions() {
  const playLinks = Array.from(document.querySelectorAll('[data-scroll-to-player]'));

  playLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const player = document.querySelector('.player-card');
      player?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function setupSearchPage() {
  const list = document.querySelector('[data-searchable-list]');
  const input = document.querySelector('#searchInput');
  const genre = document.querySelector('#genreFilter');
  const type = document.querySelector('#typeFilter');
  const region = document.querySelector('#regionFilter');
  const year = document.querySelector('#yearFilter');
  const resultCount = document.querySelector('#resultCount');
  const form = document.querySelector('[data-search-form]');

  if (!list || !input) {
    return;
  }

  const cards = Array.from(list.querySelectorAll('.movie-card'));
  const params = new URLSearchParams(window.location.search);
  const query = params.get('q');

  if (query) {
    input.value = query;
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function applyFilters() {
    const keyword = normalize(input.value);
    const genreValue = normalize(genre?.value);
    const typeValue = normalize(type?.value);
    const regionValue = normalize(region?.value);
    const yearValue = normalize(year?.value);
    let visible = 0;

    cards.forEach((card) => {
      const text = normalize(card.dataset.search);
      const matchesKeyword = !keyword || text.includes(keyword);
      const matchesGenre = !genreValue || normalize(card.dataset.genre) === genreValue || text.includes(genreValue);
      const matchesType = !typeValue || normalize(card.dataset.type) === typeValue;
      const matchesRegion = !regionValue || normalize(card.dataset.region) === regionValue;
      const matchesYear = !yearValue || normalize(card.dataset.year) === yearValue;
      const shouldShow = matchesKeyword && matchesGenre && matchesType && matchesRegion && matchesYear;

      card.classList.toggle('is-hidden', !shouldShow);

      if (shouldShow) {
        visible += 1;
      }
    });

    if (resultCount) {
      resultCount.textContent = String(visible);
    }
  }

  [input, genre, type, region, year].forEach((control) => {
    control?.addEventListener('input', applyFilters);
    control?.addEventListener('change', applyFilters);
  });

  form?.addEventListener('reset', () => {
    window.setTimeout(applyFilters, 0);
  });

  applyFilters();
}

document.addEventListener('DOMContentLoaded', () => {
  setupMobileNavigation();
  setupHeroCarousel();
  setupVideoPlayers();
  setupDetailActions();
  setupSearchPage();
});
