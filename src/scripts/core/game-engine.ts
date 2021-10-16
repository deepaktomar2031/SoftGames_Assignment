// Main Game Engine

import * as PIXI from 'pixi.js'
import { SceneManager } from './scene-manager';
import { TaskRunner } from "./task-runner";

export class GameEngine {
    loader: PIXI.Loader;
    renderer: PIXI.Renderer;
    container: PIXI.Container;
    taskRunner: TaskRunner;
    sceneManager: SceneManager;
    private htmlElement: HTMLElement;

    constructor() {
        const dimensions = this.getScreenDimenions();
        const pixelRatio = window.devicePixelRatio;
        this.loader = PIXI.Loader.shared;
        this.renderer = PIXI.autoDetectRenderer({
            width: dimensions.width * pixelRatio,
            height: dimensions.height * pixelRatio,
            antialias: false,
            autoDensity: true,
            resolution: pixelRatio,
            transparent: true
        });
        this.container = new PIXI.Container();
        this.taskRunner = new TaskRunner();
        this.sceneManager = new SceneManager(this);
        this.resizeView();
        this.htmlElement = document.getElementById('game') || document.body;
        this.htmlElement.appendChild(this.renderer.view);
        window.addEventListener('resize', () => this.resizeView());
    }

    getScreenDimenions(): { width: number, height: number } {
        const rect = document.body.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
    }

    resizeView() {
        const dimensions = this.getScreenDimenions();
        this.renderer.resize(dimensions.width, dimensions.height);
    }
}