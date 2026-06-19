(function () {
  function bindMenu() {
    var button = document.querySelector("[data-menu-button]");
    var panel = document.querySelector("[data-mobile-panel]");
    if (!button || !panel) {
      return;
    }
    button.addEventListener("click", function () {
      panel.classList.toggle("is-open");
    });
  }

  function bindHero() {
    var slider = document.querySelector("[data-hero-slider]");
    if (!slider) {
      return;
    }
    var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
    if (!slides.length) {
      return;
    }
    var current = 0;
    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === current);
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
      });
    });
    window.setInterval(function () {
      show(current + 1);
    }, 5200);
  }

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function bindFilters() {
    var areas = Array.prototype.slice.call(document.querySelectorAll("[data-filter-area]"));
    areas.forEach(function (area) {
      var input = area.querySelector("[data-filter-input]");
      var yearSelect = area.querySelector("[data-year-filter]");
      var typeSelect = area.querySelector("[data-type-filter]");
      var cards = Array.prototype.slice.call(area.querySelectorAll("[data-card]"));
      if (area.hasAttribute("data-query-from-url") && input) {
        var params = new URLSearchParams(window.location.search);
        var q = params.get("q");
        if (q) {
          input.value = q;
        }
      }
      function apply() {
        var keyword = normalize(input && input.value);
        var year = normalize(yearSelect && yearSelect.value);
        var type = normalize(typeSelect && typeSelect.value);
        cards.forEach(function (card) {
          var haystack = normalize([
            card.getAttribute("data-title"),
            card.getAttribute("data-region"),
            card.getAttribute("data-genre"),
            card.getAttribute("data-tags"),
            card.getAttribute("data-year"),
            card.getAttribute("data-type")
          ].join(" "));
          var matchesKeyword = !keyword || haystack.indexOf(keyword) !== -1;
          var matchesYear = !year || normalize(card.getAttribute("data-year")) === year;
          var matchesType = !type || normalize(card.getAttribute("data-type")) === type;
          card.classList.toggle("is-hidden", !(matchesKeyword && matchesYear && matchesType));
        });
      }
      if (input) {
        input.addEventListener("input", apply);
      }
      if (yearSelect) {
        yearSelect.addEventListener("change", apply);
      }
      if (typeSelect) {
        typeSelect.addEventListener("change", apply);
      }
      apply();
    });
  }

  bindMenu();
  bindHero();
  bindFilters();
})();
