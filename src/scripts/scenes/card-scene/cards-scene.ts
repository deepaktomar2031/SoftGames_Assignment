// Card Scene for Option 1 ie Stack of Cards

import * as PIXI from 'pixi.js';
import { GameEngine } from "../../core/game-engine";
import { ITask, TaskRunner } from "../../core/task-runner";
import { cardsPath } from '../../assets';
import { BaseScene } from '../scene';

let displayWidth = 0;
let displayHeight = 0;

const CARD_COUNT = 144;
const CARD_DELAY = 1000;
const REACH_TIME = 2000;

class Card {
    width: number = 0;
    height: number = 0;
    background: PIXI.Sprite;

    constructor(texture: PIXI.Texture) {
        this.background = new PIXI.Sprite(texture);
        this.width = texture.width
        this.height = texture.height
    }

    destroy() {
        this.background.destroy({ texture: true, children: true, baseTexture: true });
    }
}

function cardDelay(delta: number, context: { passed: 0, cards: Card[], index: number, delay: number }, task: ITask, runner: TaskRunner) {
    let { cards, index, delay } = context;
    context.passed += delta;
    if (context.passed > delay) {
        if (index !== cards.length) {
            const finalPosition = displayWidth - cards[index].width - 2 * cards[index].background.x;
            runner.addTask(cardAnimation, { finalPosition, timeToReach: REACH_TIME, card: cards[index] });
            runner.addTask(cardDelay, { passed: 0, cards: cards, index: ++index, delay: CARD_DELAY });
        }
        task.stop();
    }
}

function cardAnimation(delta: number, context: { finalPosition: number, timeToReach: number, card: Card }, task: ITask) {
    let { finalPosition, timeToReach, card } = context;
    const cardSpeed = (finalPosition - card.background.x) / timeToReach;
    card.background.x += cardSpeed * delta;
    context.timeToReach -= delta;
    if (timeToReach <= 0) {
        card.background.zIndex = -1;
        card.background.x = finalPosition;
        task.stop();
    }
}

export class CardsScene extends BaseScene {
    private cards: Card[] = [];
    constructor(protected gameEngine: GameEngine) {
        super(gameEngine);
        displayWidth = this.gameEngine.renderer.screen.width;
        displayHeight = this.gameEngine.renderer.screen.height;
        const { loader } = gameEngine;
        this.sceneContainer.sortableChildren = true;
        const texture = this.getCards();
        if (texture) {
            this.initializeScene()
        } else {
            loader.add(cardsPath).load(() => this.initializeScene());
        }
    }

    destroy() {
        super.destroy();
        this.cards.forEach(card => card.destroy);
    }

    private getCards(): PIXI.Texture | undefined {
        return this.gameEngine.loader.resources[cardsPath[0]]?.texture;
    }

    private initializeScene(): void {
        super.initialized();
        const { taskRunner, loader } = this.gameEngine;
        const texture = loader.resources[cardsPath[0]].texture;
        let x = 100;
        let y = (displayHeight - texture.height) * .15;
        for (let i = 0; i < CARD_COUNT; i++) {
            const textureName = cardsPath[i % 8];
            const card = new Card(loader.resources[textureName].texture);
            card.background.position.set(x, y);
            this.cards.unshift(card);
            this.sceneContainer.addChild(card.background);
            y += 3;
        }
        taskRunner.addTask(cardDelay, { passed: 0, cards: this.cards, index: 0, delay: 200 });
    }
}