
window.YGE = window.YGE || {};

YGE.Engine = class Engine {
    constructor(canvas) {
        this.canvas = canvas;

        this.engine = new BABYLON.Engine(
            canvas,
            true
        );

        this.scene = new BABYLON.Scene(
            this.engine
        );

        this.setupScene();
    }

    setupScene() {
        const scene = this.scene;

        scene.clearColor = new BABYLON.Color4(
            0.08, 0.09, 0.13, 1
        );

        const camera = new BABYLON.ArcRotateCamera(
            "YGE_Camera",
            -Math.PI / 2,
            Math.PI / 3,
            8,
            BABYLON.Vector3.Zero(),
            scene
        );

        camera.attachControl(this.canvas, true);

        new BABYLON.HemisphericLight(
            "YGE_Light",
            new BABYLON.Vector3(0, 1, 0),
            scene
        );

        const box = BABYLON.MeshBuilder.CreateBox(
            "YGE_TestObject",
            { size: 2 },
            scene
        );

        box.position.y = 1;

        const ground = BABYLON.MeshBuilder.CreateGround(
            "YGE_Ground",
            { width: 20, height: 20 },
            scene
        );

        ground.position.y = 0;
    }

    start() {
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

        window.addEventListener("resize", () => {
            this.engine.resize();
        });
    }

    stop() {
        this.engine.stopRenderLoop();
    }
};

