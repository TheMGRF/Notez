const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement); // Connecting to the canvas

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 0;
camera.position.y = 4;
camera.position.z = 10;

for (let i = 0; i < 5; i++) {
    const geo = new THREE.BoxGeometry(1, 1, 1);
    const mat = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.x = 2 * Math.random(3 % i);
    mesh.position.y = 6 * Math.random();
    mesh.position.z = -10;
    
    scene.add(mesh);

    const light = new THREE.PointLight(0xFF0000, 1, 2000);
    light.parent = scene;
    // const textureLoader = new THREE.TextureLoader();
    // const lensflare = new THREE.LensFlare();

    // const flare0 = textureLoader.load("lensflare0.png");
    // const flare1 = textureLoader.load("lensflare1.png");
    // const flare2 = textureLoader.load("lensflare2.png");
    // const flare3 = textureLoader.load("lensflare3.png");

    // lensflare.addElement(new LensflareElement(flare0, 512, 0));
    // lensflare.addElement(new LensflareElement(flare1, 512, 0));
    // lensflare.addElement(new LensflareElement(flare2, 512, 0));
    // lensflare.addElement(new LensflareElement(flare3, 60, 0.6));

    // light.add(lensflare);

    light.position.set(50, 50, 50);
    scene.add(light);

}

for (let i = 0; i < 5; i++) {
    const geo = new THREE.BoxGeometry(1, 1, 1);
    const mat = new THREE.MeshBasicMaterial({ color: 0x0000FF });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.x = -6 * Math.random(3 % i);
    mesh.position.y = 6 * Math.random();
    mesh.position.z = -10;
    
    scene.add(mesh);

    const light = new THREE.PointLight(0xFF0000, 1, 2000);
    light.parent = scene;
    // const textureLoader = new THREE.TextureLoader();
    // const lensflare = new THREE.LensFlare();

    // const flare0 = textureLoader.load("lensflare0.png");
    // const flare1 = textureLoader.load("lensflare1.png");
    // const flare2 = textureLoader.load("lensflare2.png");
    // const flare3 = textureLoader.load("lensflare3.png");

    // lensflare.addElement(new LensflareElement(flare0, 512, 0));
    // lensflare.addElement(new LensflareElement(flare1, 512, 0));
    // lensflare.addElement(new LensflareElement(flare2, 512, 0));
    // lensflare.addElement(new LensflareElement(flare3, 60, 0.6));

    // light.add(lensflare);

    light.position.set(50, 50, 50);
    scene.add(light);

}

function animate() {
    requestAnimationFrame(animate);
    camera.translateZ(-0.03);
    renderer.render(scene, camera);
}

animate();
