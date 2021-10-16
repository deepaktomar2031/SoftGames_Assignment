// BaseScene initialisation

import * as PIXI from 'pixi.js';
import { GameEngine } from "../core/game-engine";
import { ITask } from "../core/task-runner";

const styleBackButton = new PIXI.TextStyle({
    fontFamily: 'Times New Roman',
    fontSize: 30,
    fontWeight: 'bold',
    fill: '#FFFFFF'
});

export interface SceneInterface {
    initialized(): void
    destroy(): void
}

export interface SceneConstructor {
    new(gameEngine: GameEngine): BaseScene
}

export abstract class BaseScene implements SceneInterface {
    protected sceneContainer: PIXI.Container;
    protected UIContainer: PIXI.Container;
    protected backButton: PIXI.Text;
    protected loader: PIXI.Text;
    constructor(protected gameEngine: GameEngine) {
        this.sceneContainer = new PIXI.Container();
        this.UIContainer = new PIXI.Container();
        this.gameEngine.container.addChild(this.sceneContainer);
        this.gameEngine.container.addChild(this.UIContainer);
        this.backButton = new PIXI.Text('Back', styleBackButton);
        this.backButton.interactive = true;
        this.backButton.buttonMode = true;
        this.backButton.position.set(this.gameEngine.renderer.screen.width - 100, 10);
        this.backButton.once('pointerdown', () => {
            this.gameEngine.sceneManager.pop();
        })
        this.loader = new PIXI.Text('Loading.....', styleBackButton);
        this.loader.position.set(
            (this.gameEngine.renderer.screen.width - this.loader.width) * .5,
            (this.gameEngine.renderer.screen.height - this.loader.height) * .5,
        )
        this.UIContainer.addChild(this.backButton);
        this.gameEngine.taskRunner.addTask((delta: number, context: { passed: number }, task: ITask) => {
            context.passed += delta;
            if (context.passed > 200) {
                this.UIContainer.addChild(this.loader);
                task.stop();
            }
        }, { passed: 0 });
    }

    initialized() {
        this.loader.renderable = false;
    }

    destroy() {
        this.gameEngine.loader.reset();
        this.gameEngine.taskRunner.stopAll();
        this.gameEngine.container.removeChildren().forEach(child => child.destroy());
    }
}