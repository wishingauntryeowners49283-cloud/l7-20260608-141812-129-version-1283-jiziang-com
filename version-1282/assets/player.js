import { H as Hls } from './hls.js';

const dataElement = document.getElementById('player-data');
const video = document.querySelector('[data-player-video]');
const cover = document.querySelector('[data-player-cover]');
const button = document.querySelector('[data-player-button]');

if (dataElement && video && cover) {
  const payload = JSON.parse(dataElement.textContent || '{}');
  const sourceUrl = payload.source || '';
  let loaded = false;
  let hls = null;

  const bindSource = () => {
    if (loaded || !sourceUrl) {
      return;
    }
    loaded = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = sourceUrl;
    } else if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false
      });
      hls.loadSource(sourceUrl);
      hls.attachMedia(video);
    } else {
      video.src = sourceUrl;
    }
  };

  const playVideo = () => {
    bindSource();
    cover.classList.add('is-hidden');
    video.setAttribute('controls', 'controls');
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {});
    }
  };

  cover.addEventListener('click', playVideo);
  if (button) {
    button.addEventListener('click', playVideo);
  }
  video.addEventListener('click', () => {
    if (!loaded) {
      playVideo();
    }
  });

  window.addEventListener('pagehide', () => {
    if (hls) {
      hls.destroy();
      hls = null;
    }
  });
}
