export function setupFullscreenSwipe() {
  let startY = 0;

  window.addEventListener("touchstart", (e) => {
    startY = e.touches[0].clientY;
  });

  window.addEventListener("touchend", (e) => {
    const endY = e.changedTouches[0].clientY;
    const diff = startY - endY;
    if (diff > 80) {
      enterFullscreen();
    }
    if (diff < -80) {
      exitFullscreen();
    }
  });
}

async function enterFullscreen() {
  const elem = document.getElementById("pixi-container");
  if (!elem) return;

  if (elem.requestFullscreen) {
    await elem.requestFullscreen();
  } else if ((elem as any).webkitRequestFullscreen) {
    (elem as any).webkitRequestFullscreen();
  }
}

async function exitFullscreen() {
  if (document.fullscreenElement) {
    await document.exitFullscreen();
  } else if ((document as any).webkitExitFullscreen) {
    (document as any).webkitExitFullscreen();
  }

}
