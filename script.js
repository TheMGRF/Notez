"use strict";

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement); // Connecting to the canvas

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = -2;
camera.position.y = 4;
camera.position.z = 10;

let cleared = false;
let meshes = [];

async function run() {
    while (true) {
        if (!cleared) {
            meshes.forEach(element => {
                scene.remove(element);
            });
            meshes = [];

            debug("rawr")
            for (let i = 0; i < 5; i++) {
                box(0xFF0000, i);
            }
            
            for (let i = 0; i < 5; i++) {
                box(0x0000FF, i);
            }
        }
        await sleep(2000);
    }
}

run();

function box(colour, count) {
    const geo = new THREE.BoxGeometry(1, 1, 1);
    const mat = new THREE.MeshBasicMaterial({ color: colour });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.x = -6 * Math.random(3 % count);
    mesh.position.y = 6 * Math.random();
    mesh.position.z = -10;
    
    scene.add(mesh);
    meshes.push(mesh);
}

function animate() {
    requestAnimationFrame(animate);
    camera.translateZ(-0.03);

    if (camera.position.z < -10) {
        cleared = true;
        camera.position.z = 10;
    }
    renderer.render(scene, camera);
}

animate();
