// Core
import { createApp } from "./core/createApp";
import { GameLoop } from "./core/GameLoop";

// Objects
import { Background } from "./objects/Background";
import { Footer } from "./objects/Footer";
import { Bunny } from "./objects/Bunny";

// Utils
import { setupStats } from "./utils/stats";
import { setupDebugToggle } from "./utils/debug";

(async () => {
  const app = await createApp();

  // URL params 
  const params = new URLSearchParams(window.location.search); 
  const bgName = params.get("bg") || "fruit"; 
  const backgrounds: Record<string, string> = { dart: "/assets/dart.png", fruit: "/assets/fruit.png" }; 
  const bgUrl = backgrounds[bgName] || backgrounds.dart; 
  
  // Background
  const background = new Background(app, bgUrl); 
  await background.init();
  console.log('background loaded');

  // Footer
  const footer = new Footer(app, "/assets/footer.png", background); 
  await footer.init();
  console.log('footer loaded');

  // FPS display
  const stats = setupStats(); 
  setupDebugToggle(stats);

  // Bunny
  const bunny = new Bunny(app);
  await bunny.init();

  // Ticker
  const loop = new GameLoop(app); 
  loop.add((delta) => { 
    stats.begin();
    bunny.update(delta); 
    stats.end(); 
  });  
  
})();
