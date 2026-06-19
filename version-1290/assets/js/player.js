(function () {
    function bindMoviePlayer(streamUrl, videoId, buttonId) {
        var video = document.getElementById(videoId);
        var button = document.getElementById(buttonId);
        var hls = null;
        var loaded = false;

        if (!video || !button || !streamUrl) {
            return;
        }

        function attachStream() {
            if (loaded) {
                return;
            }

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = streamUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true,
                    backBufferLength: 60
                });
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
            } else {
                video.src = streamUrl;
            }

            loaded = true;
        }

        function start(event) {
            if (event) {
                event.preventDefault();
            }
            attachStream();
            button.classList.add('is-hidden');
            var promise = video.play();
            if (promise && typeof promise.catch === 'function') {
                promise.catch(function () {
                    video.setAttribute('controls', 'controls');
                });
            }
        }

        button.addEventListener('click', start);
        video.addEventListener('click', function (event) {
            if (!loaded || video.paused) {
                start(event);
            }
        });
        video.addEventListener('ended', function () {
            if (hls && typeof hls.stopLoad === 'function') {
                hls.stopLoad();
            }
        });
    }

    window.bindMoviePlayer = bindMoviePlayer;
})();
