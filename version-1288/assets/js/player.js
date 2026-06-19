(function () {
    function initMoviePlayer(settings) {
        var video = document.querySelector(settings.selector);
        var overlay = document.querySelector(settings.overlaySelector);
        var source = settings.source;
        var prepared = false;
        var hlsInstance = null;

        if (!video || !source) {
            return;
        }

        function prepare() {
            if (prepared) {
                return;
            }
            prepared = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
                video.load();
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
                hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    video.play().catch(function () {});
                });
                return;
            }

            video.src = source;
            video.load();
        }

        function start() {
            prepare();
            if (overlay) {
                overlay.classList.add('is-hidden');
            }
            video.play().catch(function () {
                video.setAttribute('controls', 'controls');
            });
        }

        if (overlay) {
            overlay.addEventListener('click', start);
        }

        video.addEventListener('click', function () {
            if (video.paused) {
                start();
            }
        });

        video.addEventListener('play', function () {
            if (overlay) {
                overlay.classList.add('is-hidden');
            }
        });

        window.addEventListener('pagehide', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }

    window.initMoviePlayer = initMoviePlayer;
})();
