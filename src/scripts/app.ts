// Initializes the gameEngine

import { GameEngine } from './core/game-engine';
import { MenuScene } from './scenes/main-scene/main-scene';
import { meterFPS } from './utils';

const gameEngine = new GameEngine();

window.onload = () => {
    const FPSMeter = meterFPS(document.getElementById('FPSMeter'))
    gameEngine.sceneManager.push(MenuScene);
   
    (function render(time: number): void {
        FPSMeter.measure(time);
        gameEngine.taskRunner.update(time);
        gameEngine.renderer.render(gameEngine.container);
        requestAnimationFrame(render);
    })(0);

    FPSMeter.show();
};