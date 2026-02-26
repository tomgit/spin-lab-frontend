//main.ts

// Core
import { createApp } from "./core/createApp";
import { GameLoop } from "./core/GameLoop";

// Loader
import { Preloader } from "./loader/Preloader";
import { GameLoader } from "./loader/GameLoader";

// Objects
import { Background } from "./objects/Background";

// Utils
import { setupStats } from "./utils/stats";
import { setupDebugToggle } from "./utils/debug";

// Footer
import { Footer } from "./objects/Footer";
import { ReelGame } from "./engine/ReelGame";
import { GameController } from "./controller/GameController";
import { Winline } from "./objects/Winline";
import { Texture } from "pixi.js";

(async () => {
  const app = await createApp();

  if (import.meta.env.DEV) {
    globalThis.__PIXI_APP__ = app;
  }

  app.stage.sortableChildren = true;

  // URL params
  const params = new URLSearchParams(window.location.search);
  const game = params.get("game") || "fruitman";

  // Preloader
  const preloader = new Preloader(app);
  await preloader.init();

  // Load manifest + assets
  const manifest = await GameLoader.load(game, (p) => preloader.updateProgress(p));

  // Main Background
  const background = new Background(app);
  await background.init();

  // Controller
  const controller = new GameController();

  // Footer
  const footer = new Footer(app, "/assets/footer.png", background, controller);
  await footer.init();


  // FPS display
  const stats = setupStats();
  setupDebugToggle(stats);

  // Ticker
  const loop = new GameLoop(app);
  loop.add({
    update(delta) {
      stats.begin();
      stats.end();
    },
  });

  // ReelGame engine
  const reelgame = new ReelGame(app, background, footer, controller, loop);
  await reelgame.init();

  // Winlines
  const winlineTextures = manifest.assets.winlines.map(path => Texture.from(path));
  const winline = new Winline(winlineTextures);
  app.stage.addChild(winline.container);


  preloader.hide();

})();
