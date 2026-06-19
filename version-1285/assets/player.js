(function () {
    var video = document.getElementById("moviePlayer");
    var overlay = document.querySelector(".play-overlay");
    var source = window.__PLAYER_SOURCE__ || "";
    var ready = false;
    var hlsInstance = null;

    function preparePlayer() {
        if (ready || !video || !source) {
            return;
        }

        ready = true;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(source);
            hlsInstance.attachMedia(video);
        } else {
            video.src = source;
        }
    }

    function playVideo() {
        if (!video) {
            return;
        }

        preparePlayer();

        if (overlay) {
            overlay.classList.add("is-hidden");
        }

        var promise = video.play();
        if (promise && typeof promise.catch === "function") {
            promise.catch(function () {});
        }
    }

    if (overlay) {
        overlay.addEventListener("click", playVideo);
    }

    if (video) {
        video.addEventListener("click", function () {
            if (video.paused) {
                playVideo();
            }
        });
    }

    window.addEventListener("pagehide", function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
})();
