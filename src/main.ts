// Core
import { createApp } from "./core/createApp";
import { GameLoop } from "./core/GameLoop";

// Objects
import { Background } from "./objects/Background";

// Loader 
import { GameLoader } from "./loader/GameLoader";

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

  // Ticker
  const loop = new GameLoop(app); 
  loop.add((delta) => { 
    stats.begin();
    stats.end(); 
  });  
  
})();
