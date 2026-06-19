(function () {
  function attachStream(video, streamUrl) {
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      return Promise.resolve();
    }
    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      return new Promise(function (resolve) {
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          resolve();
        });
      });
    }
    video.src = streamUrl;
    return Promise.resolve();
  }

  document.addEventListener('DOMContentLoaded', function () {
    var frame = document.querySelector('[data-player]');
    var video = document.querySelector('[data-player-video]');
    var cover = document.querySelector('[data-player-cover]');
    var button = document.querySelector('[data-player-button]');
    if (!frame || !video || !cover || !button) {
      return;
    }
    var streamUrl = video.getAttribute('data-stream');
    var ready = false;

    function begin() {
      cover.classList.add('is-hidden');
      if (!ready) {
        ready = true;
        attachStream(video, streamUrl).then(function () {
          video.play().catch(function () {});
        });
        return;
      }
      video.play().catch(function () {});
    }

    cover.addEventListener('click', begin);
    button.addEventListener('click', function (event) {
      event.preventDefault();
      begin();
    });
    video.addEventListener('click', function () {
      if (video.paused) {
        video.play().catch(function () {});
      }
    });
  });
})();
