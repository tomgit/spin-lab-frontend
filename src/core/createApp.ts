//createApp.ts
import { Application } from "pixi.js";

export async function createApp() {
  const app = new Application();

  await app.init({
    antialias: true,
    resolution: Math.min(window.devicePixelRatio, 2),
    autoDensity: true,
    background: "#000000",
    resizeTo: window,
  });

  document.getElementById("pixi-container")!.appendChild(app.canvas);

  return app;
}
