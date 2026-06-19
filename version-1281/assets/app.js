(function() {
    var toggle = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');
    if (toggle && mobileNav) {
        toggle.addEventListener('click', function() {
            mobileNav.classList.toggle('open');
        });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
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
            slides.forEach(function(slide, i) {
                slide.classList.toggle('active', i === current);
            });
            dots.forEach(function(dot, i) {
                dot.classList.toggle('active', i === current);
            });
        }

        function restart() {
            if (timer) {
                clearInterval(timer);
            }
            timer = setInterval(function() {
                show(current + 1);
            }, 5200);
        }

        if (prev) {
            prev.addEventListener('click', function() {
                show(current - 1);
                restart();
            });
        }
        if (next) {
            next.addEventListener('click', function() {
                show(current + 1);
                restart();
            });
        }
        dots.forEach(function(dot) {
            dot.addEventListener('click', function() {
                show(parseInt(dot.getAttribute('data-hero-dot'), 10) || 0);
                restart();
            });
        });
        restart();
    }

    var searchInputs = Array.prototype.slice.call(document.querySelectorAll('[data-search-input]'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
    var status = document.querySelector('[data-search-status]');

    function normalize(value) {
        return (value || '').toString().toLowerCase().replace(/\s+/g, '');
    }

    function applySearch(value) {
        var query = normalize(value);
        var visible = 0;
        cards.forEach(function(card) {
            var source = normalize((card.getAttribute('data-title') || '') + ' ' + (card.getAttribute('data-meta') || ''));
            var matched = !query || source.indexOf(query) !== -1;
            card.classList.toggle('is-hidden', !matched);
            if (matched) {
                visible += 1;
            }
        });
        if (status) {
            status.textContent = query ? '已匹配 ' + visible + ' 部' : '';
        }
    }

    searchInputs.forEach(function(input) {
        input.addEventListener('input', function() {
            applySearch(input.value);
        });
    });
})();
