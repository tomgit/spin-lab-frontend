import Stats from "stats.js";

export function setupStats() {
  const stats = new Stats();
  stats.showPanel(0);
  document.body.appendChild(stats.dom);
  stats.dom.style.display = "none";
  return stats;
}
