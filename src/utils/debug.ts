import Stats from "stats.js";

export function setupDebugToggle(stats: Stats, key: string = "F2") {
  let visible = false;

  window.addEventListener("keydown", (e) => {
    if (e.code === key) {
      visible = !visible;
      stats.dom.style.display = visible ? "block" : "none";
    }
  });
}
