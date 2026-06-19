(function () {
    function ready(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    ready(function () {
        var menuButton = document.querySelector('.mobile-menu-toggle');
        var mobileNav = document.querySelector('.mobile-nav');
        if (menuButton && mobileNav) {
            menuButton.addEventListener('click', function () {
                var isOpen = mobileNav.classList.toggle('is-open');
                menuButton.setAttribute('aria-expanded', String(isOpen));
            });
        }

        document.querySelectorAll('[data-hero]').forEach(function (hero) {
            var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
            var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
            var prev = hero.querySelector('[data-hero-prev]');
            var next = hero.querySelector('[data-hero-next]');
            var index = 0;
            var timer = null;

            function show(nextIndex) {
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
                clearInterval(timer);
                timer = setInterval(function () {
                    show(index + 1);
                }, 5000);
            }

            if (prev) {
                prev.addEventListener('click', function () {
                    show(index - 1);
                    play();
                });
            }

            if (next) {
                next.addEventListener('click', function () {
                    show(index + 1);
                    play();
                });
            }

            dots.forEach(function (dot) {
                dot.addEventListener('click', function () {
                    show(Number(dot.getAttribute('data-hero-dot')) || 0);
                    play();
                });
            });

            show(0);
            play();
        });

        document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
            var root = scope.closest('main') || document;
            var input = root.querySelector('[data-filter-input]');
            var year = root.querySelector('[data-filter-year]');
            var type = root.querySelector('[data-filter-type]');
            var cards = Array.prototype.slice.call(scope.querySelectorAll('.js-movie-card'));
            var empty = scope.querySelector('.filter-empty') || root.querySelector('.filter-empty');

            function applyFilter() {
                var query = input ? input.value.trim().toLowerCase() : '';
                var yearValue = year ? year.value : '';
                var typeValue = type ? type.value : '';
                var visible = 0;

                cards.forEach(function (card) {
                    var text = (card.getAttribute('data-search') || '').toLowerCase();
                    var cardYear = card.getAttribute('data-year') || '';
                    var cardType = card.getAttribute('data-type') || '';
                    var matched = true;

                    if (query && text.indexOf(query) === -1) {
                        matched = false;
                    }
                    if (yearValue && cardYear !== yearValue) {
                        matched = false;
                    }
                    if (typeValue && cardType.indexOf(typeValue) === -1) {
                        matched = false;
                    }

                    card.classList.toggle('is-hidden', !matched);
                    if (matched) {
                        visible += 1;
                    }
                });

                if (empty) {
                    empty.classList.toggle('is-visible', visible === 0);
                }
            }

            [input, year, type].forEach(function (control) {
                if (control) {
                    control.addEventListener('input', applyFilter);
                    control.addEventListener('change', applyFilter);
                }
            });
        });
    });
})();
