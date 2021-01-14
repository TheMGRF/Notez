"use strict";

var camera;
var gameRunning = false;
var clicked = false;
var points = 0;
var kinectron = new Kinectron();

var pointElement = document.getElementById("points");

shouldRun();

/**
 * Loop to start on script load with page to determine
 * whether the game logic should begin yet
 */
async function shouldRun() {
    while (true) {
        if (gameRunning) {
            start();
            break;
        }
        await sleep(800);
    }
}

/**
 * Detect the user clicking "Play" on the start menu and
 * run the @see start method to begin the game
 */
document.getElementById("play").onclick = async function () {
    let welcome = document.getElementById("welcome");
    welcome.style.visibility = "hidden";
    welcome.style.opacity = 0;

    await sleep(200);
    gameRunning = true;

    await sleep(800);
    let title = document.getElementById("titleBox");
    title.style.visibility = "visible";
    title.style.opacity = 1;

    await sleep(2000);
    title.style.visibility = "hidden";
    title.style.opacity = 0;

    await sleep(1000);
    let score = document.getElementById("points");
    score.style.visibility = "visible";
    score.style.opacity = 1;
}

/**
 * Define a function to load local file into the
 * application to set up
 */
function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

var numJsonFrames = 0;
var jsonMotion = null;
/**
 * Load motion JSON file into the scene
 * check the JSON variables 
 * 
 */
readTextFile("motion.json", function (text) {
    jsonMotion = JSON.parse(text);
    numJsonFrames = Object.keys(jsonMotion).length;
}
);

/**
 * Use THREE.js audio loader to play the music track
 * to the user to avoid browser checks and latency
 * 
 * @param {PerspectiveCamera} camera The camera object to play sound to
 */
function playMusic(camera) {
    const listener = new THREE.AudioListener();
    camera.add(listener);

    const sound = new THREE.Audio(listener);

    const audioLoader = new THREE.AudioLoader();
    audioLoader.load("assets/miami_nights.mp3", function (buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(0.2);
        sound.play();
    });
}

/**
 * Play a beep sound effect for when a point is scored
 * 
 * @param {PerspectiveCamera} camera The camera to act as a listener
 */
function playBeep(camera) {
    const listener = new THREE.AudioListener();
    camera.add(listener);

    const sound = new THREE.Audio(listener);

    const audioLoader = new THREE.AudioLoader();
    audioLoader.load("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=",
    function (buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(false);
        sound.setVolume(0.2);
        sound.play();
    });
}

/**
 * Increment the points counter and play a beep to incidate
 * a point has been earned by the useree
 */
function incrementPoints() {
    playBeep(camera);
    points++;
}

var box1 = null;
var box2 = null;
var hands = null;
var meshLH = null;
var meshRH = null;

/**
 * TODO: Collision detection function to check if the blocks interact with each other
 * 
 */
// function checkTouching(a, d) {
//     let b1 = a.position.y - a.geometry.parameters.height / 2;
//     let t1 = a.position.y + a.geometry.parameters.height / 2;
//     let r1 = a.position.x + a.geometry.parameters.width / 2;
//     let l1 = a.position.x - a.geometry.parameters.width / 2;
//     let f1 = a.position.z - a.geometry.parameters.depth / 2;
//     let B1 = a.position.z + a.geometry.parameters.depth / 2;
//     let b2 = d.position.y - d.geometry.parameters.height / 2;
//     let t2 = d.position.y + d.geometry.parameters.height / 2;
//     let r2 = d.position.x + d.geometry.parameters.width / 2;
//     let l2 = d.position.x - d.geometry.parameters.width / 2;
//     let f2 = d.position.z - d.geometry.parameters.depth / 2;
//     let B2 = d.position.z + d.geometry.parameters.depth / 2;

//     let bool = !(t1 < b2 || r1 < l2 || b1 > t2 || l1 > r2 || f1 > B2 || B1 < f2);

//     return bool;
// }

/**
 * Start the game when the user cliks "Play" from the start menu
 */
function start() {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    let canvas = document.body.appendChild(renderer.domElement); // Connecting to the canvas
    canvas.id = "canvas"; // Set canvas ID for easy identification

    const scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    camera.position.x = -1;
    camera.position.y = 1.5;
    camera.position.z = 7;

    const lightAmbient = new THREE.AmbientLight(0x666666);
    scene.add(lightAmbient);

    // Add SpotLight to scene
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.x = -10;
    spotLight.position.y = 40;
    spotLight.position.z = 5;
    spotLight.intensity = 1.0;
    spotLight.penumbra = 0.50;
    spotLight.angle = Math.PI / 6;
    scene.add(spotLight);

    spotLight.target.position.x = 0;
    spotLight.target.position.y = -50;
    spotLight.target.position.z = 0;
    scene.add(spotLight.target);

    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(100, 10, 0);
    light.castShadow = true; // default false
    scene.add(light);

    // Set up shadow properties for the light with default values
    light.shadow.mapSize.width = 512;
    light.shadow.mapSize.height = 512;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500;

    let cleared = false;
    let meshes = [];

    playMusic(camera);

    // Create the joints in the scene to indicate the hands for the interactions 
    hands = new THREE.Object3D();

    var SphereGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);

    // Create a ball for the left hand
    var mLH = new THREE.MeshPhongMaterial({ color: 0xFF000d });
    meshLH = new THREE.Mesh(SphereGeometry, mLH);

    // Create a ball for the right hand
    var mRH = new THREE.MeshPhongMaterial({ color: 0x0203e2 });
    meshRH = new THREE.Mesh(SphereGeometry, mRH);

    hands.position.x = -1.2;
    hands.add(meshLH, meshRH);


    scene.add(hands);

    /**
     * Run the bulk of the game code spawning in boxes and
     * setting world space meshes
     */
    async function run() {
        while (true) {
            if (!cleared) {
                meshes.forEach(element => {
                    scene.remove(element);
                });
                meshes = [];

                let rand = Math.floor(Math.random() * 2);
                rand = rand <= 0 ? 1 : rand;
                for (let i = 0; i < rand; i++) {
                    box1 = box(0x0000FF, i, true); // Red (LEFT)
                }

                rand = Math.floor(Math.random() * 2);
                rand = rand <= 0 ? 1 : rand;
                for (let i = 0; i < rand; i++) {
                    box2 = box(0xFF0000, i, false); // Blue (RIGHT)
                }
            }
            await sleep(4700); // 4.7 seconds elapsed (blocks behind camera)
        }
    }

    floor();
    run();

    /**
     * Create the boxes indicating a beat for the user to hit
     * 
     * @param {color} colour The colour of the box
     * @param {number} count Help randomise the Y value of the box
     * @param {boolean} side Indicate if the box is a "side" box (RED)
     */
    function box(colour, count, side) {
        let geo = new THREE.BoxGeometry(0.65, 0.65, 0.65);
        let mat = new THREE.MeshPhongMaterial({ color: colour });
        let target = new THREE.Mesh(geo, mat);

        if (side) {
            target.position.set(0, 1 * Math.random(5 % count), -5);
        } else {
            target.position.set(-1.9, 1 * Math.random(5 % count), -5);
        }

        scene.add(target);
        meshes.push(target);

        return target;
    }

    /**
     * Create the floor object in the world space to
     * help indicate distance and show box lighting
     */
    function floor() {
        let geo = new THREE.BoxGeometry(1000, 0.1, 1000);
        let mat = new THREE.MeshPhongMaterial({ color: 0x0D0D0D });
        let mesh = new THREE.Mesh(geo, mat);
        mesh.position.x = -6;
        mesh.position.y = -2;
        mesh.position.z = -10;
        mat.opacity = 0.3;

        // TODO: https://stackoverflow.com/questions/19731471/reflective-material-in-three-js

        scene.add(mesh);
    }

    /**
     * Create a function to update meshes using motion
     */
    function getBodies(skeletonFrame) {
        meshLH.position.x = skeletonFrame.joints[kinectron.HANDLEFT].cameraX;
        meshLH.position.y = skeletonFrame.joints[kinectron.HANDLEFT].cameraY;
        meshLH.position.z = skeletonFrame.joints[kinectron.HANDLEFT].cameraZ;
        meshRH.position.x = skeletonFrame.joints[kinectron.HANDRIGHT].cameraX;
        meshRH.position.y = skeletonFrame.joints[kinectron.HANDRIGHT].cameraY;
        meshRH.position.z = skeletonFrame.joints[kinectron.HANDRIGHT].cameraZ;
    }

    var iFrame = 0;

    /**
     * Move the camera to simulate the boxes moving in
     * the world space and update the THREE.js renderer
     */
    function animate() {
        requestAnimationFrame(animate);

        camera.translateZ(-0.03);
        hands.translateZ(-0.03);

        if (camera.position.z < -10) {
            cleared = true;
            camera.position.z = 10;
            cleared = false;
        }

        if (hands.position.z < -10) {
            cleared = true;
            hands.position.z = 10;
            cleared = false;
        }

        // Collision detection for the first target
        /**
         * doesn't actually recognise the mLH or meshLH (and RH) in console so that may be why, recognises the radius of the targets but not the hands
         */
        var distLHTarget1 = Math.sqrt(
        Math.pow(box1.position.x-meshLH.position.x,2) + 
            Math.pow(box1.position.y-meshLH.position.y,2) + 
            Math.pow(box1.position.z-meshLH.position.z,2)
        );

        var distRHTarget1 = Math.sqrt(
        Math.pow(box1.position.x-meshRH.position.x,2) + 
            Math.pow(box1.position.y-meshRH.position.y,2) + 
            Math.pow(box1.position.z-meshRH.position.z,2)
        );

        if ((distLHTarget1 < (box1.geometry.parameters.radius + meshLH.geometry.parameters.radius)) ||
            (distRHTarget1 < (box1.geometry.parameters.radius + meshRH.geometry.parameters.radius)))
        {
            meshRH.material.color.setHex(0x000033);
            box1.material.color.setHex(0x000033);
            incrementPoints();
        }

        // Collision detection for the second target
        var distLHTarget2 = Math.sqrt(
        Math.pow(box2.position.x-meshLH.position.x,2) + 
            Math.pow(box2.position.y-meshLH.position.y,2) + 
            Math.pow(box2.position.z-meshLH.position.z,2)
            );

        var distRHTarget2 = Math.sqrt(
        Math.pow(box2.position.x-meshRH.position.x,2) + 
            Math.pow(box2.position.y-meshRH.position.y,2) + 
            Math.pow(box2.position.z-meshRH.position.z,2)
            );

        if ((distLHTarget2 < (box2.geometry.parameters.radius + meshLH.geometry.parameters.radius)) ||
            (distRHTarget2 < (box2.geometry.parameters.radius + meshRH.geometry.parameters.radius))) {
                meshLH.material.color.setHex(0x330000);
                box2.material.color.setHex(0x330000);
                incrementPoints();
        }

        // TODO: Check to see if left or right side block was interacted with
        // TODO: Maybe slighty redo points when this is done ^
        if (hands.position.z > scene.position.z) {
            mLH.color.setHex(0x330000);
            box2.material.color.setHex(0x330000);
            points += 0.003;
        } else {
            mLH.color.setHex(0xFF0000);
            box2.material.color.setHex(0xFF0000);
        }

        if (hands.position.z > scene.position.z) {
            mRH.color.setHex(0x000033);
            box1.material.color.setHex(0x000033);
            points += 0.003;
        } else {
            mRH.color.setHex(0x0203e2);
            box1.material.color.setHex(0x0203e2);
        }


        //TODO: Input the collision detection for the blocks
        // if (checkTouching(meshLH, box1)) {
        //     meshRH.material.color.setHex(0xFFFFFF);
        //     meshLH.material.color.setHex(0xFFFFFF);
        //     incrementPoints();
        // }

        // if (checkTouching(meshLH, box2)) {
        //     meshLH.material.color.setHex(0xFFFFFF);
        //     box2.material.color.setHex(0xFFFFFF);
        //     incrementPoints();
        // }
        pointElement.innerHTML = "Points: " + parseInt(points);

        iFrame++;

        if (numJsonFrames > 0) {
            var iFrameToRender = iFrame % numJsonFrames;
            getBodies(jsonMotion[iFrameToRender]);
        }

        renderer.render(scene, camera);
    }

    animate();
}