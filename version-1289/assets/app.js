(function () {
  function toggleMenu() {
    var button = document.querySelector('[data-menu-button]');
    var panel = document.querySelector('[data-menu-panel]');
    if (!button || !panel) {
      return;
    }
    button.addEventListener('click', function () {
      panel.classList.toggle('is-hidden');
      button.textContent = panel.classList.contains('is-hidden') ? '☰' : '×';
    });
  }

  function initHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
      });
    }

    function start() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5000);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        start();
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        start();
      });
    });

    show(0);
    start();
  }

  function initFilters() {
    var forms = Array.prototype.slice.call(document.querySelectorAll('[data-filter-form]'));
    forms.forEach(function (form) {
      var scopeSelector = form.getAttribute('data-filter-scope') || 'body';
      var scope = document.querySelector(scopeSelector) || document;
      var input = form.querySelector('[data-filter-input]');
      var chips = Array.prototype.slice.call(form.querySelectorAll('[data-filter-chip]'));
      var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));
      var active = '';

      function apply() {
        var keyword = input ? input.value.trim().toLowerCase() : '';
        cards.forEach(function (card) {
          var haystack = [
            card.getAttribute('data-title') || '',
            card.getAttribute('data-tags') || '',
            card.getAttribute('data-category') || '',
            card.getAttribute('data-year') || ''
          ].join(' ').toLowerCase();
          var matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
          var matchActive = !active || haystack.indexOf(active.toLowerCase()) !== -1;
          card.classList.toggle('is-hidden-card', !(matchKeyword && matchActive));
        });
      }

      form.addEventListener('submit', function (event) {
        event.preventDefault();
        apply();
      });

      if (input) {
        input.addEventListener('input', apply);
      }

      chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
          active = chip.getAttribute('data-filter-chip') || '';
          chips.forEach(function (item) {
            item.classList.toggle('is-active', item === chip);
          });
          apply();
        });
      });

      var params = new URLSearchParams(window.location.search);
      var q = params.get('q');
      if (q && input) {
        input.value = q;
      }
      apply();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    toggleMenu();
    initHero();
    initFilters();
  });
})();
