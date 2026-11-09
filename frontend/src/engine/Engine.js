window.YGE = window.YGE || {};

YGE.Engine = class Engine {
    constructor(canvas) {
        this.canvas = canvas;
        this.engine = new BABYLON.Engine(canvas, true);
        this.scene = new BABYLON.Scene(this.engine);

        this.keys = {};
        this.joystick = { x: 0, y: 0 };

        this.setupScene();
        this.createPlayer();
        this.createControls();
    }

    setupScene() {
        const scene = this.scene;

        scene.clearColor = new BABYLON.Color4(
            0.45, 0.68, 0.9, 1
        );

        // Graphics settings
        this.engine.setHardwareScalingLevel(1);

        // Camera
        this.camera = new BABYLON.ArcRotateCamera(
            "YGE_Camera",
            -Math.PI / 2,
            1.15,
            8,
            new BABYLON.Vector3(0, 1, 0),
            scene
        );

        this.camera.lowerRadiusLimit = 4;
        this.camera.upperRadiusLimit = 18;
        this.camera.lowerBetaLimit = 0.2;
        this.camera.upperBetaLimit = 1.5;
        this.camera.wheelPrecision = 50;
        this.camera.attachControl(this.canvas, true);

        // Lighting
        const ambient = new BABYLON.HemisphericLight(
            "YGE_Ambient",
            new BABYLON.Vector3(0, 1, 0),
            scene
        );

        ambient.intensity = 0.8;

        const sun = new BABYLON.DirectionalLight(
            "YGE_Sun",
            new BABYLON.Vector3(-1, -2, 1),
            scene
        );

        sun.position.set(20, 30, -20);
        sun.intensity = 1.0;

        this.shadows = new BABYLON.ShadowGenerator(
            1024,
            sun
        );

        this.shadows.useBlurExponentialShadowMap = true;
        this.shadows.blurKernel = 16;

        // Large World Ground
        const ground = BABYLON.MeshBuilder.CreateGround(
            "YGE_Ground",
            {
                width: 200,
                height: 200
            },
            scene
        );

        const groundMat = new BABYLON.StandardMaterial(
            "YGE_GroundMaterial",
            scene
        );

        groundMat.diffuseColor = new BABYLON.Color3(
            0.25, 0.42, 0.22
        );

        groundMat.specularColor = BABYLON.Color3.Black();

        ground.material = groundMat;
        ground.receiveShadows = true;

        // Environment
        this.createEnvironment();
    }

    createEnvironment() {
        const scene = this.scene;

        const trunkMat = new BABYLON.StandardMaterial(
            "TreeTrunk", scene
        );

        trunkMat.diffuseColor = new BABYLON.Color3(
            0.3, 0.16, 0.08
        );

        const leafMat = new BABYLON.StandardMaterial(
            "TreeLeaves", scene
        );

        leafMat.diffuseColor = new BABYLON.Color3(
            0.12, 0.38, 0.13
        );

        const rockMat = new BABYLON.StandardMaterial(
            "RockMaterial", scene
        );

        rockMat.diffuseColor = new BABYLON.Color3(
            0.38, 0.40, 0.42
        );

        for (let i = 0; i < 35; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = 12 + Math.random() * 65;

            const x = Math.cos(angle) * distance;
            const z = Math.sin(angle) * distance;

            const trunk = BABYLON.MeshBuilder.CreateCylinder(
                "TreeTrunk_" + i,
                {
                    height: 2.5,
                    diameter: 0.4
                },
                scene
            );

            trunk.position.set(x, 1.25, z);
            trunk.material = trunkMat;

            const leaves = BABYLON.MeshBuilder.CreateSphere(
                "TreeLeaves_" + i,
                {
                    diameter: 2.5,
                    segments: 12
                },
                scene
            );

            leaves.position.set(x, 3, z);
            leaves.scaling.y = 1.3;
            leaves.material = leafMat;

            this.shadows.addShadowCaster(trunk);
            this.shadows.addShadowCaster(leaves);
        }

        for (let i = 0; i < 40; i++) {
            const rock = BABYLON.MeshBuilder.CreateSphere(
                "Rock_" + i,
                {
                    diameter: 1,
                    segments: 8
                },
                scene
            );

            const angle = Math.random() * Math.PI * 2;
            const distance = 5 + Math.random() * 75;

            rock.position.set(
                Math.cos(angle) * distance,
                0.3,
                Math.sin(angle) * distance
            );

            rock.scaling.set(
                1.2,
                0.7,
                0.9
            );

            rock.material = rockMat;
            this.shadows.addShadowCaster(rock);
        }
    }

    createPlayer() {
        const scene = this.scene;

        this.player = new BABYLON.TransformNode(
            "YGE_Player",
            scene
        );

        const bodyMat = new BABYLON.StandardMaterial(
            "PlayerBodyMaterial",
            scene
        );

        bodyMat.diffuseColor = new BABYLON.Color3(
            0.15, 0.35, 0.8
        );

        const skinMat = new BABYLON.StandardMaterial(
            "PlayerSkinMaterial",
            scene
        );

        skinMat.diffuseColor = new BABYLON.Color3(
            0.75, 0.52, 0.35
        );

        const body = BABYLON.MeshBuilder.CreateCapsule(
            "PlayerBody",
            {
                height: 1.8,
                radius: 0.35
            },
            scene
        );

        body.position.y = 1.1;
        body.material = bodyMat;
        body.parent = this.player;

        const head = BABYLON.MeshBuilder.CreateSphere(
            "PlayerHead",
            {
                diameter: 0.65,
                segments: 16
            },
            scene
        );

        head.position.y = 2.2;
        head.material = skinMat;
        head.parent = this.player;

        this.shadows.addShadowCaster(body);
        this.shadows.addShadowCaster(head);

        this.player.position.set(0, 0, 0);

        this.speed = 0.10;
    }

    createControls() {
        window.addEventListener("keydown", e => {
            this.keys[e.key.toLowerCase()] = true;
        });

        window.addEventListener("keyup", e => {
            this.keys[e.key.toLowerCase()] = false;
        });

        // Mobile Joystick
        const base = document.createElement("div");

        base.style.cssText = `
            position:fixed;
            bottom:35px;
            left:25px;
            width:125px;
            height:125px;
            border-radius:50%;
            background:#ffffff33;
            border:2px solid #ffffff88;
            z-index:10;
            touch-action:none;
        `;

        const knob = document.createElement("div");

        knob.style.cssText = `
            position:absolute;
            width:48px;
            height:48px;
            left:36px;
            top:36px;
            border-radius:50%;
            background:#ffffffcc;
            box-shadow:0 2px 8px #0005;
        `;

        base.appendChild(knob);
        document.body.appendChild(base);

        this.joystickBase = base;
        this.joystickKnob = knob;

        const updateJoystick = e => {
            const rect = base.getBoundingClientRect();

            const dx = e.clientX - (rect.left + rect.width / 2);
            const dy = e.clientY - (rect.top + rect.height / 2);

            const max = 38;
            const length = Math.hypot(dx, dy);
            const scale = length > max ? max / length : 1;

            const x = dx * scale;
            const y = dy * scale;

            this.joystick.x = x / max;
            this.joystick.y = y / max;

            knob.style.transform =
                `translate(${x}px, ${y}px)`;
        };

        base.addEventListener("pointerdown", e => {
            base.setPointerCapture(e.pointerId);
            updateJoystick(e);
        });

        base.addEventListener("pointermove", e => {
            if (e.buttons || e.pressure > 0) {
                updateJoystick(e);
            }
        });

        const reset = () => {
            this.joystick.x = 0;
            this.joystick.y = 0;
            knob.style.transform = "translate(0px, 0px)";
        };

        base.addEventListener("pointerup", reset);
        base.addEventListener("pointercancel", reset);
    }

    updatePlayer() {
        let x = this.joystick.x;
        let z = this.joystick.y;

        if (this.keys["w"] || this.keys["arrowup"]) z -= 1;
        if (this.keys["s"] || this.keys["arrowdown"]) z += 1;
        if (this.keys["a"] || this.keys["arrowleft"]) x -= 1;
        if (this.keys["d"] || this.keys["arrowright"]) x += 1;

        const length = Math.hypot(x, z);

        if (length < 0.1) return;

        x /= length;
        z /= length;

        const alpha = this.camera.alpha;

        const forwardX = -Math.sin(alpha);
        const forwardZ = -Math.cos(alpha);

        const rightX = Math.cos(alpha);
        const rightZ = -Math.sin(alpha);

        const moveX = rightX * x - forwardX * z;
        const moveZ = rightZ * x - forwardZ * z;

        this.player.position.x += moveX * this.speed;
        this.player.position.z += moveZ * this.speed;

        this.player.rotation.y = Math.atan2(
            moveX,
            moveZ
        );
    }

    start() {
        this.engine.runRenderLoop(() => {
            this.updatePlayer();

            this.camera.target.copyFrom(
                this.player.position.add(
                    new BABYLON.Vector3(0, 1.3, 0)
                )
            );

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