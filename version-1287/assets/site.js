(function () {
    function qs(selector, root) {
        return (root || document).querySelector(selector);
    }

    function qsa(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    var toggle = qs("[data-nav-toggle]");
    var mobileNav = qs("[data-mobile-nav]");
    if (toggle && mobileNav) {
        toggle.addEventListener("click", function () {
            mobileNav.classList.toggle("is-open");
        });
    }

    qsa("[data-hero]").forEach(function (hero) {
        var slides = qsa("[data-hero-slide]", hero);
        var dots = qsa("[data-hero-dot]", hero);
        var prev = qs("[data-hero-prev]", hero);
        var next = qs("[data-hero-next]", hero);
        var current = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, idx) {
                slide.classList.toggle("is-active", idx === current);
            });
            dots.forEach(function (dot, idx) {
                dot.classList.toggle("is-active", idx === current);
            });
        }

        function play() {
            clearInterval(timer);
            timer = setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        if (prev) {
            prev.addEventListener("click", function () {
                show(current - 1);
                play();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                show(current + 1);
                play();
            });
        }

        dots.forEach(function (dot, idx) {
            dot.addEventListener("click", function () {
                show(idx);
                play();
            });
        });

        show(0);
        play();
    });

    function applyFilter(scope) {
        var keywordInput = qs("[data-filter-keyword]", scope);
        var yearInput = qs("[data-filter-year]", scope);
        var typeInput = qs("[data-filter-type]", scope);
        var cards = qsa(".movie-card", scope.parentNode);
        var empty = qs("[data-empty-result]", scope.parentNode);
        var keyword = keywordInput ? keywordInput.value.trim().toLowerCase() : "";
        var year = yearInput ? yearInput.value : "";
        var type = typeInput ? typeInput.value : "";
        var visible = 0;

        cards.forEach(function (card) {
            var haystack = [
                card.getAttribute("data-title") || "",
                card.getAttribute("data-region") || "",
                card.getAttribute("data-genre") || "",
                card.getAttribute("data-category") || "",
                card.getAttribute("data-type") || "",
                card.getAttribute("data-year") || ""
            ].join(" ").toLowerCase();
            var ok = true;
            if (keyword && haystack.indexOf(keyword) === -1) {
                ok = false;
            }
            if (year && card.getAttribute("data-year") !== year) {
                ok = false;
            }
            if (type && card.getAttribute("data-type") !== type) {
                ok = false;
            }
            card.hidden = !ok;
            if (ok) {
                visible += 1;
            }
        });

        if (empty) {
            empty.classList.toggle("is-visible", visible === 0);
        }
    }

    qsa("[data-filter-scope]").forEach(function (scope) {
        var keywordInput = qs("[data-filter-keyword]", scope);
        var params = new URLSearchParams(window.location.search);
        var query = params.get("q");
        if (keywordInput && query) {
            keywordInput.value = query;
        }
        qsa("input, select", scope).forEach(function (control) {
            control.addEventListener("input", function () {
                applyFilter(scope);
            });
            control.addEventListener("change", function () {
                applyFilter(scope);
            });
        });
        applyFilter(scope);
    });
})();

function initMoviePlayer(videoId, overlayId, streamUrl) {
    var video = document.getElementById(videoId);
    var overlay = document.getElementById(overlayId);
    var status = document.getElementById(videoId + "-status");
    var hls = null;
    var ready = false;
    var starting = false;

    if (!video || !overlay || !streamUrl) {
        return;
    }

    function hideOverlay() {
        overlay.classList.add("is-hidden");
    }

    function showStatus(message) {
        if (status) {
            status.hidden = false;
            status.textContent = message;
        }
    }

    function playVideo() {
        hideOverlay();
        var result = video.play();
        if (result && typeof result.catch === "function") {
            result.catch(function () {
                showStatus("播放暂时无法启动，请稍后重试");
            });
        }
    }

    function prepare() {
        if (ready) {
            playVideo();
            return;
        }
        ready = true;
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = streamUrl;
            playVideo();
            return;
        }
        if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
            hls.loadSource(streamUrl);
            hls.attachMedia(video);
            hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                playVideo();
            });
            hls.on(window.Hls.Events.ERROR, function (event, data) {
                if (data && data.fatal) {
                    showStatus("播放暂时无法加载，请稍后重试");
                }
            });
            return;
        }
        video.src = streamUrl;
        playVideo();
    }

    function start(event) {
        if (event) {
            event.preventDefault();
        }
        if (starting) {
            return;
        }
        starting = true;
        prepare();
        setTimeout(function () {
            starting = false;
        }, 300);
    }

    overlay.addEventListener("click", start);
    video.addEventListener("click", function () {
        if (video.paused) {
            start();
        }
    });
    video.addEventListener("play", hideOverlay);
}
