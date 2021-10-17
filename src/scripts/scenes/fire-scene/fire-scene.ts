// This scene is responoble for presenting the fire particle effect

import * as PIXI from 'pixi.js';
import * as particles from 'pixi-particles'
import { GameEngine } from "../../core/game-engine";
import { BaseScene } from "../scene";
import { config } from "./fire-config";
import { firePath } from '../../assets';

function fireAnimation(delta: number, context: { emitter: particles.Emitter }) {
    context.emitter.update(delta * 0.001);
}

export class FireScene extends BaseScene {
    private emitter: particles.Emitter | undefined;
    private texture: PIXI.Texture[] = [];
    constructor(protected gameEngine: GameEngine) {
        super(gameEngine);
        const { taskRunner } = gameEngine;
        this.gameEngine.loader.add(firePath).load(() => {
            super.initialized();
            for (let i = 0; i < firePath.length; ++i) {
                this.texture.push(this.gameEngine.loader.resources[firePath[i]].texture);
            }
            const emitterContainer = new PIXI.Container();
            const emitter = new particles.Emitter(emitterContainer, this.texture, config);
            emitter.updateOwnerPos(window.innerWidth * .5, window.innerHeight * .5);
            taskRunner.addTask(fireAnimation, { emitter });
            gameEngine.container.addChild(emitterContainer);
        });
    }

    destroy() {
        super.destroy();
        this.texture.forEach(texture => texture.destroy(true));
        if (this.emitter) {
            this.emitter.destroy();
        }
    }
}