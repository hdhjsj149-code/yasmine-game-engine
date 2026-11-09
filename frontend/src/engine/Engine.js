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
        // Environment Materials

const trunkMaterial = new BABYLON.StandardMaterial(
    "YGE_TrunkMaterial", scene
);
trunkMaterial.diffuseColor = new BABYLON.Color3(
    0.30, 0.16, 0.08
);

const leafMaterial = new BABYLON.StandardMaterial(
    "YGE_LeafMaterial", scene
);
leafMaterial.diffuseColor = new BABYLON.Color3(
    0.12, 0.38, 0.13
);

const rockMaterial = new BABYLON.StandardMaterial(
    "YGE_RockMaterial", scene
);
rockMaterial.diffuseColor = new BABYLON.Color3(
    0.38, 0.40, 0.42
);

// Tree Positions
const treePositions = [
    [-5, -4], [-8, 2], [-4, 6],
    [5, -5], [8, 1], [5, 7],
    [-9, -7], [9, -7]
];

// Create Trees
treePositions.forEach((pos, i) => {

    const trunk = BABYLON.MeshBuilder.CreateCylinder(
        "YGE_TreeTrunk_" + i,
        {
            height: 2.5,
            diameter: 0.45
        },
        scene
    );

    trunk.position.set(pos[0], 1.25, pos[1]);
    trunk.material = trunkMaterial;

    const leaves = BABYLON.MeshBuilder.CreateSphere(
        "YGE_TreeLeaves_" + i,
        {
            diameter: 2.5,
            segments: 8
        },
        scene
    );

    leaves.position.set(pos[0], 3, pos[1]);
    leaves.scaling.y = 1.3;
    leaves.material = leafMaterial;

    shadows.addShadowCaster(trunk);
    shadows.addShadowCaster(leaves);
});

// Rock Positions
const rockPositions = [
    [-3, -5], [3, 5], [-7, 5],
    [7, -4], [-5, 2], [4, -7]
];

// Create Rocks
rockPositions.forEach((pos, i) => {

    const rock = BABYLON.MeshBuilder.CreateSphere(
        "YGE_Rock_" + i,
        {
            diameter: 1,
            segments: 6
        },
        scene
    );

    rock.position.set(
        pos[0],
        0.3,
        pos[1]
    );

    rock.scaling.set(
        1.2,
        0.7,
        0.9
    );

    rock.rotation.y = Math.random() * Math.PI;
    rock.material = rockMaterial;

    shadows.addShadowCaster(rock);
});
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