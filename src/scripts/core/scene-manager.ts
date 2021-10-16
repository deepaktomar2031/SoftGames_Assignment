// Scene Manager manages the scenes ie enter & exit

import { GameEngine } from "./game-engine";
import { BaseScene, SceneConstructor } from "../scenes/scene";

export class SceneManager {
    private scenes: SceneConstructor[] = [];
    private currentScene: BaseScene | undefined;

    constructor(private gameEngine: GameEngine) { }

    push(constructor: SceneConstructor) {
        this.currentScene?.destroy();
        this.scenes.unshift(constructor);
        this.currentScene = new constructor(this.gameEngine);
    }

    pop() {
        this.currentScene?.destroy();
        this.scenes.shift();
        if (this.scenes.length) {
            this.currentScene = new this.scenes[0](this.gameEngine);
        }
    }
}