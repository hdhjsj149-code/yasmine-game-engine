window.YGE = window.YGE || {};

YGE.Engine = class Engine {
    constructor(canvas) {
        this.canvas = canvas;

        this.engine = new BABYLON.Engine(canvas, true);

        this.scene = new BABYLON.Scene(this.engine);

        this.setupScene();
    }

    setupScene() {
        const scene = this.scene;

        // Sky
        scene.clearColor = new BABYLON.Color4(
            0.45, 0.68, 0.9, 1
        );

        // Camera
        this.camera = new BABYLON.ArcRotateCamera(
            "YGE_Camera",
            -Math.PI / 2,
            Math.PI / 3,
            10,
            new BABYLON.Vector3(0, 1, 0),
            scene
        );

        this.camera.attachControl(this.canvas, true);
        this.camera.lowerRadiusLimit = 4;
        this.camera.upperRadiusLimit = 30;
        this.camera.wheelPrecision = 40;

        // Ambient Light
        const ambient = new BABYLON.HemisphericLight(
            "YGE_Ambient",
            new BABYLON.Vector3(0, 1, 0),
            scene
        );

        ambient.intensity = 0.65;

        // Sun Light
        const sun = new BABYLON.DirectionalLight(
            "YGE_Sun",
            new BABYLON.Vector3(-1, -2, 1),
            scene
        );

        sun.position = new BABYLON.Vector3(10, 15, -10);
        sun.intensity = 1.1;

        // Shadows
        const shadows = new BABYLON.ShadowGenerator(
            1024,
            sun
        );

        shadows.useBlurExponentialShadowMap = true;
        shadows.blurKernel = 16;

        // Ground
        const ground = BABYLON.MeshBuilder.CreateGround(
            "YGE_Ground",
            {
                width: 50,
                height: 50
            },
            scene
        );

        const groundMaterial = new BABYLON.StandardMaterial(
            "YGE_GroundMaterial",
            scene
        );

        groundMaterial.diffuseColor = new BABYLON.Color3(
            0.25, 0.42, 0.22
        );

        groundMaterial.specularColor = BABYLON.Color3.Black();

        ground.material = groundMaterial;

        // Test Object
        const box = BABYLON.MeshBuilder.CreateBox(
            "YGE_TestObject",
            { size: 2 },
            scene
        );

        box.position.y = 1;

        const boxMaterial = new BABYLON.StandardMaterial(
            "YGE_BoxMaterial",
            scene
        );

        boxMaterial.diffuseColor = new BABYLON.Color3(
            0.85, 0.35, 0.2
        );

        box.material = boxMaterial;

        shadows.addShadowCaster(box);
        ground.receiveShadows = true;

        this.testObject = box;
        this.shadows = shadows;
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