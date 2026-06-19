(function () {
    function qs(selector, scope) {
        return (scope || document).querySelector(selector);
    }

    function qsa(selector, scope) {
        return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
    }

    var mobileToggle = qs('[data-mobile-toggle]');
    var mobilePanel = qs('[data-mobile-panel]');

    if (mobileToggle && mobilePanel) {
        mobileToggle.addEventListener('click', function () {
            mobilePanel.classList.toggle('is-open');
        });
    }

    var hero = qs('[data-hero]');

    if (hero) {
        var slides = qsa('.hero-slide', hero);
        var dots = qsa('[data-hero-dot]', hero);
        var index = 0;
        var timer = null;

        function showSlide(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
            });
        }

        function play() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                showSlide(index + 1);
            }, 5200);
        }

        qsa('[data-hero-next]', hero).forEach(function (button) {
            button.addEventListener('click', function () {
                showSlide(index + 1);
                play();
            });
        });

        qsa('[data-hero-prev]', hero).forEach(function (button) {
            button.addEventListener('click', function () {
                showSlide(index - 1);
                play();
            });
        });

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                showSlide(dotIndex);
                play();
            });
        });

        showSlide(0);
        play();
    }

    qsa('[data-site-search]').forEach(function (form) {
        form.addEventListener('submit', function (event) {
            var input = qs('input[name="q"]', form);
            if (!input || !input.value.trim()) {
                return;
            }
            event.preventDefault();
            window.location.href = './search.html?q=' + encodeURIComponent(input.value.trim());
        });
    });

    qsa('[data-filter-scope]').forEach(function (scope) {
        var keywordInput = qs('[data-filter-input]', scope);
        var yearSelect = qs('[data-filter-year]', scope);
        var typeSelect = qs('[data-filter-type]', scope);
        var cards = qsa('.movie-card', scope);
        var empty = qs('[data-filter-empty]', scope);

        function normalized(value) {
            return (value || '').toString().trim().toLowerCase();
        }

        function applyFilter() {
            var keyword = normalized(keywordInput && keywordInput.value);
            var year = normalized(yearSelect && yearSelect.value);
            var type = normalized(typeSelect && typeSelect.value);
            var visible = 0;

            cards.forEach(function (card) {
                var text = normalized(card.getAttribute('data-title'));
                var cardYear = normalized(card.getAttribute('data-year'));
                var cardType = normalized(card.getAttribute('data-type'));
                var ok = true;

                if (keyword && text.indexOf(keyword) === -1) {
                    ok = false;
                }

                if (year && cardYear !== year) {
                    ok = false;
                }

                if (type && cardType !== type) {
                    ok = false;
                }

                card.style.display = ok ? '' : 'none';
                if (ok) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle('is-visible', visible === 0);
            }
        }

        [keywordInput, yearSelect, typeSelect].forEach(function (element) {
            if (!element) {
                return;
            }
            element.addEventListener('input', applyFilter);
            element.addEventListener('change', applyFilter);
        });

        var params = new URLSearchParams(window.location.search);
        var query = params.get('q');
        if (query && keywordInput) {
            keywordInput.value = query;
        }

        applyFilter();
    });
})();
