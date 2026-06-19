(function () {
    var header = document.querySelector(".site-header");
    var toggle = document.querySelector(".nav-toggle");

    if (header && toggle) {
        toggle.addEventListener("click", function () {
            var opened = header.classList.toggle("nav-open");
            toggle.setAttribute("aria-expanded", opened ? "true" : "false");
        });
    }

    document.querySelectorAll("img").forEach(function (image) {
        image.addEventListener("error", function () {
            image.classList.add("image-missing");
        }, { once: true });
    });

    var heroSlides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var heroDots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    var heroIndex = 0;

    function showHeroSlide(index) {
        if (!heroSlides.length) {
            return;
        }
        heroIndex = (index + heroSlides.length) % heroSlides.length;
        heroSlides.forEach(function (slide, slideIndex) {
            slide.classList.toggle("is-active", slideIndex === heroIndex);
        });
        heroDots.forEach(function (dot, dotIndex) {
            dot.classList.toggle("is-active", dotIndex === heroIndex);
        });
    }

    heroDots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
            showHeroSlide(index);
        });
    });

    if (heroSlides.length > 1) {
        setInterval(function () {
            showHeroSlide(heroIndex + 1);
        }, 5200);
    }

    var quickSearch = document.querySelector("[data-quick-search]");
    if (quickSearch) {
        quickSearch.addEventListener("submit", function (event) {
            event.preventDefault();
            var input = quickSearch.querySelector("input");
            var keyword = input ? encodeURIComponent(input.value.trim()) : "";
            window.location.href = "search.html" + (keyword ? "?q=" + keyword : "");
        });
    }

    var filterPanel = document.querySelector("[data-filter-panel]");
    if (filterPanel) {
        var keywordInput = filterPanel.querySelector("[data-filter-keyword]");
        var typeSelect = filterPanel.querySelector("[data-filter-type]");
        var regionSelect = filterPanel.querySelector("[data-filter-region]");
        var yearSelect = filterPanel.querySelector("[data-filter-year]");
        var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card"));
        var emptyState = document.querySelector(".empty-state");
        var params = new URLSearchParams(window.location.search);
        var initialKeyword = params.get("q");

        if (keywordInput && initialKeyword) {
            keywordInput.value = initialKeyword;
        }

        function normalize(value) {
            return String(value || "").toLowerCase().trim();
        }

        function applyFilters() {
            var keyword = normalize(keywordInput && keywordInput.value);
            var type = normalize(typeSelect && typeSelect.value);
            var region = normalize(regionSelect && regionSelect.value);
            var year = normalize(yearSelect && yearSelect.value);
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = normalize([
                    card.getAttribute("data-title"),
                    card.getAttribute("data-tags"),
                    card.getAttribute("data-genre"),
                    card.getAttribute("data-region"),
                    card.getAttribute("data-type"),
                    card.querySelector(".movie-desc") ? card.querySelector(".movie-desc").textContent : ""
                ].join(" "));
                var ok = true;

                if (keyword && haystack.indexOf(keyword) === -1) {
                    ok = false;
                }
                if (type && normalize(card.getAttribute("data-type")).indexOf(type) === -1) {
                    ok = false;
                }
                if (region && normalize(card.getAttribute("data-region")).indexOf(region) === -1) {
                    ok = false;
                }
                if (year && normalize(card.getAttribute("data-year")).indexOf(year) === -1) {
                    ok = false;
                }

                card.classList.toggle("hidden-by-filter", !ok);
                if (ok) {
                    visible += 1;
                }
            });

            if (emptyState) {
                emptyState.classList.toggle("is-visible", visible === 0);
            }
        }

        [keywordInput, typeSelect, regionSelect, yearSelect].forEach(function (control) {
            if (control) {
                control.addEventListener("input", applyFilters);
                control.addEventListener("change", applyFilters);
            }
        });

        applyFilters();
    }
})();
