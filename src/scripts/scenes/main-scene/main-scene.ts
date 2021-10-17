// Menu scene is responible for presenting the main menu of the application

import * as PIXI from 'pixi.js';
import { GameEngine } from "../../core/game-engine";
import { CardsScene } from '../card-scene/cards-scene';
import { FireScene } from '../fire-scene/fire-scene';
import { TextEmojiScene } from '../text-emoji-scene/text-emoji-scene';
import { BaseScene, SceneConstructor } from "../scene";

const MENU_OFFSET = 50;

export class MenuScene extends BaseScene {
    private scenes: SceneConstructor[] = [CardsScene, TextEmojiScene, FireScene];
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

        const textEmojiOption = new PIXI.Text('2. Text & Image', style);
        textEmojiOption.interactive = true;
        textEmojiOption.buttonMode = true;
        textEmojiOption.x = 0;
        textEmojiOption.y = cardsOption.y + cardsOption.height + MENU_OFFSET;

        const fireOption = new PIXI.Text('3. Fire Effect', style);
        fireOption.interactive = true;
        fireOption.buttonMode = true;
        fireOption.x = 0;
        fireOption.y = textEmojiOption.y + textEmojiOption.height + MENU_OFFSET;

        mainContainer.addChild(cardsOption);
        mainContainer.addChild(textEmojiOption);
        mainContainer.addChild(fireOption)

        mainContainer.x = (gameEngine.renderer.screen.width - mainContainer.width) * .5;
        mainContainer.y = (gameEngine.renderer.screen.height - mainContainer.height) * .5;

        mainContainer.interactive = true;
        mainContainer.on('pointerdown', (event: PIXI.InteractionEvent) => {
            let sceneToPush = null;
            switch (event.target) {
                case cardsOption:
                    sceneToPush = this.scenes[0]
                    break;
                case textEmojiOption:
                    sceneToPush = this.scenes[1];
                    break;
                case fireOption:
                    sceneToPush = this.scenes[2];
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