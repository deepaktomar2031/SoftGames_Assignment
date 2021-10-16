// This scene is responsible for presenting capabilities of TextEmoji widget

import * as PIXI from 'pixi.js';
import { GameEngine } from "../../core/game-engine";
// import { TextEmoji } from '../../wrapper/text-emoji';
import { TextEmoji } from '../wrapper/text-emoji';
import { getRandomNumber } from '../../utils';
import { BaseScene } from "../scene";
import { emojiPath } from '../../assets';

let screenWidth = 0;
let screenHeight = 0;

const wordsArray = "Hello World Java Javascript Pixi Task Python Programming Frontend Backend Database Coding Soft Games MSSQL MySQL".split(' ');

function combineTextEmoji(delta: number, context: { timePassed: number, textEmoji: TextEmoji, texture: PIXI.Texture }) {
    context.timePassed += delta;
    const { textEmoji, texture } = context;
    if (context.timePassed > 1000) {
        context.timePassed = 0;
        let textEmojiContainer = [];
        for (let i = 0; i < 3; i++) {
            let type = getRandomNumber(0, 2);
            if (type === 0) {
                let wordIndex = getRandomNumber(0, wordsArray.length);
                textEmojiContainer.push(TextEmoji.createText(wordsArray[wordIndex]));
            } else {
                let imageIndex = getRandomNumber(0, 1000);
                let col = (imageIndex / 40) | 0;
                let row = imageIndex - col * 40;
                texture.frame = new PIXI.Rectangle(col * 64 + 1, row * 64 + 1, 64, 64);
                textEmojiContainer.push(TextEmoji.createImage(texture));
            }
            textEmojiContainer.push((TextEmoji.createText(i < 2 ? " " : "")));
        }
        const fontSize = getRandomNumber(5, 50);
        textEmoji.setContent(textEmojiContainer, fontSize);
        textEmoji.visual.position.set((screenWidth - textEmoji.width) * .5, (screenHeight - textEmoji.height) * .5);
    }
}

export class TextEmojiScene extends BaseScene {
    textEmoji: TextEmoji;
    constructor(protected gameEngine: GameEngine) {
        super(gameEngine);
        const { loader } = gameEngine;
        screenWidth = gameEngine.renderer.screen.width;
        screenHeight = gameEngine.renderer.screen.height;
        this.textEmoji = new TextEmoji([]);
        if (loader.resources[emojiPath]) {
            this.initializeScene();
        } else {
            loader.add(emojiPath).load(() => this.initializeScene());
        }
    }

    private initializeScene() {
        super.initialized();
        const { loader, taskRunner } = this.gameEngine;
        const texture = loader.resources[emojiPath].texture;
        taskRunner.addTask(combineTextEmoji, { timePassed: 2000, textEmoji: this.textEmoji, texture });
        this.sceneContainer.addChild(this.textEmoji.visual);
    }

    destroy() {
        super.destroy();
        this.textEmoji.destroy();
    }
}