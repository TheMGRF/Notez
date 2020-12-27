"use strict";

var gameRunning = false;

var clicked = false;

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
document.getElementById("play").onclick = async function() {
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
    let combo = document.getElementById("combo");
    combo.style.visibility = "visible";
    combo.style.opacity = 1;

}

/**
 * Use THREE.js audio loader to play the music track
 * to the user to avoid browser checks and latency
 * 
 * @param {PerspectiveCamera} camera The camera object to play sound to
 */
function playMusic(camera) {
    const listener = new THREE.AudioListener();
    camera.add(listener);

    const sound = new THREE.Audio( listener );

    const audioLoader = new THREE.AudioLoader();
    audioLoader.load("assets/miami_nights.mp3", function(buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(0.2);
        sound.play();
    });
}

/**
 * Start the game when the user cliks "Play" from the start menu
 */
function start() {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    let canvas = document.body.appendChild(renderer.domElement); // Connecting to the canvas
    canvas.id = "canvas"; // Set canvas ID for easy identification

    const scene = new THREE.Scene();
    //scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.x = -2;
    camera.position.y = 4;
    camera.position.z = 10;

    const lightAmbient = new THREE.AmbientLight(0x666666);
    scene.add(lightAmbient);

    // Add SpotLight to scene
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.x = -10;
    spotLight.position.y = 40;
    spotLight.position.z = 5;
    spotLight.intensity = 1.0;
    spotLight.penumbra = 0.50;
    spotLight.angle = Math.PI/6;
    scene.add(spotLight);

    spotLight.target.position.x = 0;
    spotLight.target.position.y = -50;
    spotLight.target.position.z = 0;
    scene.add(spotLight.target);

    const light = new THREE.PointLight( 0xffffff, 1, 100 );
    light.position.set(100, 10, 0);
    light.castShadow = true; // default false
    scene.add( light );

    // Set up shadow properties for the light with default values
    light.shadow.mapSize.width = 512;
    light.shadow.mapSize.height = 512;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500;

    let cleared = false;
    let meshes = [];

    playMusic(camera);

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

                let rand = Math.floor(Math.random() * 4);
                rand = rand <= 0 ? 1 : rand;
                for (let i = 0; i < rand; i++) {
                    box(0xFF0000, i, true); // Red (LEFT)
                }
                
                rand = Math.floor(Math.random() * 4);
                rand = rand <= 0 ? 1 : rand;
                for (let i = 0; i < rand; i++) {
                    box(0x0000FF, i, false); // Blue (RIGHT)
                }
            }
            await sleep(4700); // 4.7 seconds elapsed (blocks behind camera)
        }
    }

    floor();
    run();

    /**
     * Create a box indicating a beat for the user to hit
     * 
     * @param {color} colour The colour of the box
     * @param {number} count Help randomise the Y value of the box
     * @param {boolean} side Indicate if the box is a "side" box (RED)
     */
    function box(colour, count, side) {
        let geo = new THREE.BoxGeometry(1, 1, 1);
        let mat = new THREE.MeshPhongMaterial({ color: colour });
        let mesh = new THREE.Mesh(geo, mat);
        if (side) {
            mesh.position.x = -6;
        }
        mesh.position.y = 6 * Math.random(5 % count);
        mesh.position.z = -10;
        
        scene.add(mesh);
        meshes.push(mesh);
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
        mat.opacity = 0.6;
        
        // TODO: https://stackoverflow.com/questions/19731471/reflective-material-in-three-js

        scene.add(mesh);
    }

    /**
     * Move the camera to simulate the boxes moving in
     * the world space and update the THREE.js renderer
     */
    function animate() {
        requestAnimationFrame(animate);
        camera.translateZ(-0.03);

        if (camera.position.z < -10) {
            cleared = true;
            camera.position.z = 10;
            cleared = false;
        }

        renderer.render(scene, camera);
    }

    animate();
}