// Core
import { createApp } from "./core/createApp";
import { GameLoop } from "./core/GameLoop";

// Loader 
import { GameLoader } from "./loader/GameLoader";

// Objects
import { Background } from "./objects/Background";
import { Bunny } from "./objects/Bunny";

// Utils
import { setupStats } from "./utils/stats";
import { setupDebugToggle } from "./utils/debug";

(async () => {
  const app = await createApp();

  // URL params 
  const params = new URLSearchParams(window.location.search); 
  const game = params.get("game") || "fruitman"; 

  // Load manifest + assets
  await GameLoader.load(game); 

  // Background
  const background = new Background(app); 
  await background.init();

  // FPS display
  const stats = setupStats(); 
  setupDebugToggle(stats);

  // Bunny
  const bunny = new Bunny(app);
  await bunny.init();  

  // Ticker
  const loop = new GameLoop(app); 
  loop.add(bunny); 
  loop.add({ update(delta) {
     stats.begin(); 
     stats.end(); 
  } });
  
})();
