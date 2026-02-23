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

(async () => {
  const app = await createApp();
  app.stage.sortableChildren = true;

  // URL params 
  const params = new URLSearchParams(window.location.search); 
  const game = params.get("game") || "fruitman"; 

  const preloader = new Preloader(app);
  await preloader.init();
  
  // Load manifest + assets
  await GameLoader.load(game, (p) => preloader.updateProgress(p));

  // Background
  const background = new Background(app); 
  await background.init();

  // ReelGame engine
  const reelgame = new ReelGame(app, background); 
  await reelgame.init();

  // Footer
  const footer = new Footer(app, "/assets/footer.png", background); 
  await footer.init();
  
  // Hide the preloader
  setTimeout(() => {
    preloader.hide();  
  }, 200);

  // FPS display
  const stats = setupStats(); 
  setupDebugToggle(stats);
  
  // Ticker
  const loop = new GameLoop(app); 
  loop.add({ update(delta) {
     stats.begin(); 
     stats.end(); 
  } });
  
})();
