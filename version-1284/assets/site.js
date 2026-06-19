(function () {
  var menuButton = document.querySelector('.menu-toggle');
  var panel = document.querySelector('.mobile-panel');

  if (menuButton && panel) {
    menuButton.addEventListener('click', function () {
      var isOpen = panel.classList.toggle('is-open');
      menuButton.classList.toggle('is-open', isOpen);
      menuButton.setAttribute('aria-expanded', String(isOpen));
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var activeSlide = 0;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    activeSlide = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === activeSlide);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === activeSlide);
    });
  }

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      showSlide(Number(dot.getAttribute('data-go-slide')) || 0);
    });
  });

  if (slides.length > 1) {
    setInterval(function () {
      showSlide(activeSlide + 1);
    }, 5600);
  }

  function normalize(value) {
    return (value || '').toString().trim().toLowerCase();
  }

  function applyFilters(section) {
    var cards = Array.prototype.slice.call(section.querySelectorAll('.movie-card'));
    var searchInput = section.querySelector('.list-search');
    var selects = Array.prototype.slice.call(section.querySelectorAll('.list-filter'));
    var empty = section.querySelector('.empty-state') || document.querySelector('.empty-state');
    var query = normalize(searchInput ? searchInput.value : '');
    var visible = 0;

    cards.forEach(function (card) {
      var text = normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-year'),
        card.getAttribute('data-region'),
        card.getAttribute('data-type'),
        card.getAttribute('data-category'),
        card.getAttribute('data-tags')
      ].join(' '));
      var matched = !query || text.indexOf(query) !== -1;

      selects.forEach(function (select) {
        var key = select.getAttribute('data-filter');
        var value = normalize(select.value);
        var data = normalize(card.getAttribute('data-' + key));
        if (value && data.indexOf(value) === -1) {
          matched = false;
        }
      });

      card.classList.toggle('is-filtered-out', !matched);
      if (matched) {
        visible += 1;
      }
    });

    if (empty) {
      empty.classList.toggle('is-visible', visible === 0 && cards.length > 0);
    }
  }

  Array.prototype.slice.call(document.querySelectorAll('.section-wrap')).forEach(function (section) {
    var controls = Array.prototype.slice.call(section.querySelectorAll('.list-search, .list-filter'));
    if (!controls.length) {
      return;
    }
    controls.forEach(function (control) {
      control.addEventListener('input', function () {
        applyFilters(section);
      });
      control.addEventListener('change', function () {
        applyFilters(section);
      });
    });
    applyFilters(section);
  });

  var params = new URLSearchParams(window.location.search);
  var q = params.get('q');
  if (q) {
    var firstSearch = document.querySelector('.list-search');
    if (firstSearch) {
      firstSearch.value = q;
      var holder = firstSearch.closest('.section-wrap') || document;
      applyFilters(holder);
      firstSearch.focus();
    }
  }
})();

function initMoviePlayer(source) {
  var video = document.getElementById('movie-player');
  var overlay = document.getElementById('play-overlay');
  var started = false;
  var hls = null;

  if (!video || !overlay || !source) {
    return;
  }

  function startPlayback() {
    if (started) {
      video.play();
      return;
    }

    started = true;
    overlay.classList.add('is-hidden');

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      video.play();
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
        video.play();
      });
      return;
    }

    video.src = source;
    video.play();
  }

  overlay.addEventListener('click', startPlayback);
  video.addEventListener('click', function () {
    if (!started || video.paused) {
      startPlayback();
    }
  });
  video.addEventListener('play', function () {
    overlay.classList.add('is-hidden');
  });
  window.addEventListener('beforeunload', function () {
    if (hls) {
      hls.destroy();
    }
  });
}
