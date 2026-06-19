(function () {
  var loader = null;

  function loadHls() {
    if (window.Hls) {
      return Promise.resolve(window.Hls);
    }
    if (loader) {
      return loader;
    }
    loader = new Promise(function (resolve) {
      var script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/hls.js@1.5.20/dist/hls.min.js";
      script.onload = function () {
        resolve(window.Hls || null);
      };
      script.onerror = function () {
        resolve(null);
      };
      document.head.appendChild(script);
    });
    return loader;
  }

  function initPlayer(videoId, coverId, url) {
    var video = document.getElementById(videoId);
    var cover = document.getElementById(coverId);
    var hlsInstance = null;
    var ready = false;
    if (!video || !cover || !url) {
      return;
    }
    async function prepare() {
      if (ready) {
        return;
      }
      ready = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
      } else {
        var Hls = await loadHls();
        if (Hls && Hls.isSupported()) {
          hlsInstance = new Hls({ enableWorker: true, lowLatencyMode: true });
          hlsInstance.loadSource(url);
          hlsInstance.attachMedia(video);
        } else {
          video.src = url;
        }
      }
    }
    async function start() {
      cover.classList.add("is-hidden");
      video.controls = true;
      await prepare();
      var playTask = video.play();
      if (playTask && typeof playTask.catch === "function") {
        playTask.catch(function () {});
      }
    }
    cover.addEventListener("click", start);
    video.addEventListener("click", function () {
      if (video.paused) {
        start();
      } else {
        video.pause();
      }
    });
    window.addEventListener("pagehide", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }

  window.VideoKit = { initPlayer: initPlayer };
})();
