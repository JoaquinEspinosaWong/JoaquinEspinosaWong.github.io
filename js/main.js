 // Import Libraries (Using CDN for browser)
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.117.1/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.117.1/examples/jsm/loaders/GLTFLoader.js';
import { PointerLockControls } from 'https://cdn.jsdelivr.net/npm/three@0.117.1/examples/jsm/controls/PointerLockControls.js';

// Create a scene
const scene = new THREE.Scene();

// Create a function to toggle fullscreen mode
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// Call toggleFullscreen() when the user wants to full screen
document.addEventListener('keydown', function(event) {
    if (event.key === 'f' || event.key === "F" || event.key === "F11") {
        toggleFullscreen();
    }
});

// Load skybox textures
const loader = new THREE.CubeTextureLoader();
const texture = loader.load([
    'assets/images/back.png',  // NOTE: Files were incorrectly named... haha
    'assets/images/front.png',
    'assets/images/top.png', 
    'assets/images/bottom.png', 
    'assets/images/right.png', 
    'assets/images/left.png' 
]);

scene.background = texture;

// Create a camera
let camera_height = 1.8;
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, camera_height, 10);  // Position the camera

// Create a renderer and add it to the DOM
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a ground plane
const planeGeometry = new THREE.PlaneGeometry(20, 20);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.8 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
scene.add(plane);

// Create boundary walls (10 meters wide, 20 meters long, 3 meters high)
const boundaryGeometry = new THREE.BoxGeometry(20, 3, 0.1);
const boundaryMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000, roughness: 0.8 });

// Front wall
const frontWall = new THREE.Mesh(boundaryGeometry, boundaryMaterial);
frontWall.position.set(0, 1.5, -10);
scene.add(frontWall);

// Back wall
const backWall = new THREE.Mesh(boundaryGeometry, boundaryMaterial);
backWall.position.set(0, 1.5, 10);
scene.add(backWall);

// Left wall
const leftWall = new THREE.Mesh(boundaryGeometry, boundaryMaterial);
leftWall.rotation.y = Math.PI / 2;
leftWall.position.set(-10, 1.5, 0);
scene.add(leftWall);

// Right wall
const rightWall = new THREE.Mesh(boundaryGeometry, boundaryMaterial);
rightWall.rotation.y = Math.PI / 2;
rightWall.position.set(10, 1.5, 0);
scene.add(rightWall);

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Variable to store the loaded model
let model;

// Load a GLTF model
const gltfLoader = new GLTFLoader();
gltfLoader.load('assets/wemby.glb', function(gltf) {
    model = gltf.scene;
    model.position.set(0, 0, 0);  // Position the model at the center of the platform
    scene.add(model);

    // Create a sprite for the text prompt
    const spriteMaterial = new THREE.SpriteMaterial({
        map: createTextTexture('Press E to read me'),
        transparent: true
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(0, 9, 0);  // Position the sprite above the model
    sprite.scale.set(5, 1.5, 1);  // Adjust the scale of the sprite
    sprite.visible = false;
    model.add(sprite);
    model.userData.prompt = sprite;
}, undefined, function(error) {
    console.error('An error occurred loading the model:', error);
});

// Function to create a texture from text
function createTextTexture(text) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = '30px Arial';
    context.fillStyle = 'white';
    context.fillText(text, 0, 30);
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}

// Add PointerLockControls
const controls = new PointerLockControls(camera, renderer.domElement);

document.addEventListener('click', () => {
    controls.lock();
});

const onKeyDown = function(event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = true;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = true;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = true;
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveRight = true;
            break;
        case 'KeyE':
            if (isCloseEnough && model && model.userData.prompt) {
                toggleOverlay();
            }
            break;
    }
};

const onKeyUp = function(event) {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW':
            moveForward = false;
            break;
        case 'ArrowLeft':
        case 'KeyA':
            moveLeft = false;
            break;
        case 'ArrowDown':
        case 'KeyS':
            moveBackward = false;
            break;
        case 'ArrowRight':
        case 'KeyD':
            moveRight = false;
            break;
    }
};

document.addEventListener('keydown', onKeyDown, false);
document.addEventListener('keyup', onKeyUp, false);

const moveSpeed = 0.1;
const acceleration = 0.002;
const deceleration = 0.01;
const maxSpeed = 0.1;
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;

const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

// Head bobbing variables
let bobbingSpeed = 0;
let bobbingAmount = 0;
let bobbingPhase = 0;
const bobbingFrequency = 0.1; // Adjust the frequency of the bobbing effect

let isCloseEnough = false;

// Create overlay for interaction message
const overlay = document.createElement('div');
overlay.style.position = 'absolute';
overlay.style.top = '50%';
overlay.style.left = '50%';
overlay.style.transform = 'translate(-50%, -50%)';
overlay.style.padding = '20px';
overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
overlay.style.color = 'white';
overlay.style.fontSize = '20px';
overlay.style.display = 'none';

// Add text to overlay
const overlayText = document.createElement('div');
overlayText.innerText = 'In the bits and bytes unit, we learned about computers. Not just the components, but how they work and why they work the way that they do. First, we broke down a computer analyzed the components, and researched the computer architecture. Then, got to know what Von Neumann Architecture is and why every CPU nowadays follows the same execution pattern. In a few words, the control and arithmetic/logic unit processes the data received from an input device or from a memory unit and then outputs the processed data. Then we learned about bits, and counting in base 16, and base 2. Base 16 is called "hexadecimal form" while base 2 is binary code. We learned how to communicate directly with computers.  ';
overlay.appendChild(overlayText);

// Add image to overlay
const image = document.createElement('img');
image.src = 'assets/images/computer.png';
image.style.width = '30%';  // Adjust as needed
overlay.appendChild(image);

document.body.appendChild(overlay);

let overlayVisible = false;

function toggleOverlay() {
    overlayVisible = !overlayVisible;
    overlay.style.display = overlayVisible ? 'block' : 'none';
}

// Render loop
function animate() {
    requestAnimationFrame(animate);

    if (controls.isLocked === true) {
        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize(); // Ensure consistent movement in all directions

        // Apply acceleration and deceleration
        if (moveForward || moveBackward || moveLeft || moveRight) {
            velocity.z -= direction.z * acceleration;
            velocity.x -= direction.x * acceleration;

            // Clamp velocity to max speed
            velocity.z = THREE.MathUtils.clamp(velocity.z, -maxSpeed, maxSpeed);
            velocity.x = THREE.MathUtils.clamp(velocity.x, -maxSpeed, maxSpeed);

            // Update bobbing speed based on movement
            bobbingSpeed = Math.sqrt(velocity.x * velocity.x + velocity.z * velocity.z) * 10;
        } else {
            // Apply deceleration
            if (velocity.z > 0) {
                velocity.z = Math.max(velocity.z - deceleration, 0);
            } else {
                velocity.z = Math.min(velocity.z + deceleration, 0);
            }
            if (velocity.x > 0) {
                velocity.x = Math.max(velocity.x - deceleration, 0);
            } else {
                velocity.x = Math.min(velocity.x + deceleration, 0);
            }

            // Reduce bobbing speed when not moving
            bobbingSpeed = 0;
        }

        // Update head bobbing
        if (bobbingSpeed > 0) {
            bobbingPhase += bobbingFrequency;
            bobbingAmount = Math.sin(bobbingPhase) * 0.1 * bobbingSpeed;
            camera.position.y = camera_height + bobbingAmount; // Adjust this value for the base height
        } else {
            camera.position.y = camera_height; // Reset to base height when not moving
        }

        controls.moveRight(-velocity.x);
        controls.moveForward(-velocity.z);

        // Ensure the player stays within boundaries
        camera.position.x = THREE.MathUtils.clamp(camera.position.x, -9.9, 9.9);
        camera.position.z = THREE.MathUtils.clamp(camera.position.z, -9.9, 9.9);
    }

    // Check distance to model
    if (model) {
        const distance = camera.position.distanceTo(model.position);
        if (distance < 10) {  // Adjust distance threshold as needed
            model.userData.prompt.visible = true;
            isCloseEnough = true;
        } else {
            model.userData.prompt.visible = false;
            isCloseEnough = false;
            if (overlayVisible) {
                toggleOverlay();
            }
        }
    }

    renderer.render(scene, camera);
}

// Start the animation loop
animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
