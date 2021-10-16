// Menu scene Main Menu in the Game

import * as PIXI from 'pixi.js';
import { GameEngine } from "../../core/game-engine";
import { CardsScene } from '../card-scene/cards-scene';
import { BaseScene, SceneConstructor } from "../scene";

export class MenuScene extends BaseScene {
    private scenes: SceneConstructor[] = [CardsScene];
    constructor(protected gameEngine: GameEngine) {
        super(gameEngine);
        super.initialized();
        this.backButton.renderable = false;
        const style = new PIXI.TextStyle({
            fontFamily: 'Times New Roman',
            fontSize: 30,
            fontWeight: 'bold',
            fill: '#FFFFFF'
        });
        const mainContainer = new PIXI.Container();

        const cardsOption = new PIXI.Text('1. Stack of Cards', style);
        cardsOption.interactive = true;
        cardsOption.buttonMode = true;
        cardsOption.x = 0;
        cardsOption.y = 0;

        mainContainer.addChild(cardsOption);

        mainContainer.x = (gameEngine.renderer.screen.width - mainContainer.width) * .5;
        mainContainer.y = (gameEngine.renderer.screen.height - mainContainer.height) * .5;

        mainContainer.interactive = true;
        mainContainer.on('pointerdown', (event: PIXI.InteractionEvent) => {
            let sceneToPush = null;
            switch (event.target) {
                case cardsOption:
                    sceneToPush = this.scenes[0]
                    break;
            }
            if (sceneToPush) {
                gameEngine.sceneManager.push(sceneToPush);
            }
        });
        gameEngine.container.addChild(mainContainer);
    }

    destroy() {
        this.gameEngine.container.removeChildren();
    }
}