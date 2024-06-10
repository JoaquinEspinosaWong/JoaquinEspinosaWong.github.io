// Import Libraries (Using CDN for browser)
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.117.1/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.117.1/examples/jsm/loaders/GLTFLoader.js';
import { PointerLockControls } from 'https://cdn.jsdelivr.net/npm/three@0.117.1/examples/jsm/controls/PointerLockControls.js';
import { RectAreaLightUniformsLib } from 'https://cdn.jsdelivr.net/npm/three@0.117.1/examples/jsm/lights/RectAreaLightUniformsLib.js';

// Initialize RectAreaLight
RectAreaLightUniformsLib.init();

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
    'assets/images/back.png',
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
camera.position.set(0, camera_height, 2);  // Position the camera

// Create a renderer and add it to the DOM
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Enable shadow maps
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Use PCF soft shadow maps for better shadow quality
document.body.appendChild(renderer.domElement);

// Add lights
const ambientLight = new THREE.AmbientLight(0xdbaea4, 0.3); // Reduced ambient light for better contrast
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
directionalLight.position.set(10, 5, -10); // Change direction of light
directionalLight.target.position.set(0, 0, 8); // Point the light at the center of the scene
directionalLight.castShadow = true; // Enable shadow casting

// Adjust shadow properties for better realism
directionalLight.shadow.mapSize.width = 2048; // Increased shadow map size
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.5; // Near plane of the shadow camera
directionalLight.shadow.camera.far = 50; // Far plane of the shadow camera
directionalLight.shadow.camera.left = -15; // Left edge of the shadow camera frustum
directionalLight.shadow.camera.right = 15; // Right edge of the shadow camera frustum
directionalLight.shadow.camera.top = 15; // Top edge of the shadow camera frustum
directionalLight.shadow.camera.bottom = -15; // Bottom edge of the shadow camera frustum
directionalLight.shadow.bias = -0.0005; // Reduced shadow bias for better shadow quality

scene.add(directionalLight);
scene.add(directionalLight.target); // Add the light target to the scene

// Add RectAreaLight
const rectLight1 = new THREE.RectAreaLight(0xffffff, 4, 1, 9);
rectLight1.position.set(4, 3.4, 2);
rectLight1.lookAt(4, 0, 2);
scene.add(rectLight1);

const rectLight2 = new THREE.RectAreaLight(0xffffff, 4, 1, 9);
rectLight2.position.set(8, 3.4, 2);
rectLight2.lookAt(8, 0, 2);
scene.add(rectLight2);

const rectLight3 = new THREE.RectAreaLight(0xffffff, 4, 1, 9);
rectLight3.position.set(12, 3.4, 2);
rectLight3.lookAt(12, 0, 2);
scene.add(rectLight3);

// Variables to store the loaded models
let helloModel, wembyModel, wembyBoundingBox, pythonModel, bitsModel, bitsBoundingBox, wonModel, wonBoundingBox, supermarketModel, supermarketBoundingBox, mushroomModel, iotModel, iotBoundingBox, aiModel, reflectionModel, reflectionBoundingBox;

// Load a GLTF model
const gltfLoader = new GLTFLoader();
gltfLoader.load('/assets/background.glb', function(gltf) {
    helloModel = gltf.scene;
    helloModel.position.set(-1, 0, 3);  // Position the model
    helloModel.castShadow = true; // Enable shadow casting
    helloModel.traverse(function(node) {
        if (node.isMesh) {
            node.castShadow = true; // Ensure all child meshes cast shadows
            node.receiveShadow = true; // Ensure all child meshes receive shadows
        }
    });
    scene.add(helloModel);

    // Create a sprite for the text prompt
    const spriteMaterial = new THREE.SpriteMaterial({
    })
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(0, 1, 0);  // Position the sprite above the model
    sprite.scale.set(5, 1, 1);  // Adjust the scale of the sprite
    sprite.visible = false;
    helloModel.add(sprite);
    helloModel.userData.prompt = sprite;
}, undefined, function(error) {
    console.error('An error occurred loading the model:', error);
});

// Load the second GLTF model
gltfLoader.load('/assets/computer.glb', function(gltf) {
    wembyModel = gltf.scene;
    wembyModel.position.set(9.15, 0.93, 2);  // Position the model
    wembyModel.castShadow = true; // Enable shadow casting
    wembyModel.traverse(function(node) {
        if (node.isMesh) {
            node.castShadow = true; // Ensure all child meshes cast shadows
            node.receiveShadow = true; // Ensure all child meshes receive shadows
        }
    });
    scene.add(wembyModel);

    // Create a bounding box for the wembyModel
    wembyBoundingBox = new THREE.Box3().setFromObject(wembyModel);

    // Create a sprite for the text prompt
    const spriteMaterial = new THREE.SpriteMaterial({
        map: createTextTexture('Press E to read me'),
        transparent: true
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(-0.5, 0.2, 0);  // Position the sprite above the model
    sprite.scale.set(3, 1, 1);  // Adjust the scale of the sprite
    sprite.visible = false;
    wembyModel.add(sprite);
    wembyModel.userData.prompt = sprite;
}, undefined, function(error) {
    console.error('An error occurred loading the model:', error);
});

// Function to create a texture from text
function createTextTexture(text) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = '20px Arial';
    context.fillStyle = 'white';
    context.fillText(text, 0, 30);
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}

// Load the python GLTF model
gltfLoader.load('/assets/python.glb', function(gltf) {
    pythonModel = gltf.scene;
    pythonModel.position.set(5.9, 1.4, 2.7);  // Position the model
    pythonModel.scale.set(0.2, 0.2, 0.2); // Adjust the scale factors as needed
    pythonModel.castShadow = true; // Enable shadow casting
    pythonModel.traverse(function(node) {
        if (node.isMesh) {
            node.castShadow = true; // Ensure all child meshes cast shadows
            node.receiveShadow = true; // Ensure all child meshes receive shadows
        }
    });
    scene.add(pythonModel);
    // Create a sprite for the text prompt
    const spriteMaterial = new THREE.SpriteMaterial({
        map: createTextTexture('Press E to learn about Python'),
        transparent: true
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(0, 0.2, -1);  // Position the sprite above the model
    sprite.scale.set(10, 10, 10);  // Adjust the scale of the sprite
    sprite.visible = false;
    pythonModel.add(sprite);
    pythonModel.userData.prompt = sprite;
}, undefined, function(error) {
    console.error('An error occurred loading the model:', error);
});

// Load the won GLTF model
gltfLoader.load('/assets/won.glb', function(gltf) {
    wonModel = gltf.scene;
    wonModel.position.set(11.75, 0.85, 0.5);  // Position the model
    wonModel.rotateY(Math.PI / -2); // Math.PI / 2 radians equals 90 degrees
    wonModel.castShadow = true; // Enable shadow casting
    wonModel.traverse(function(node) {
        if (node.isMesh) {
            node.castShadow = true; // Ensure all child meshes cast shadows
            node.receiveShadow = true; // Ensure all child meshes receive shadows
        }
    });
    scene.add(wonModel);

    // Create a bounding box for the wonmodel
    wonBoundingBox = new THREE.Box3().setFromObject(wonModel);
    
    // Create a sprite for the text prompt
    const spriteMaterial = new THREE.SpriteMaterial({
        map: createTextTexture('Press E to learn about Case 1'),
        transparent: true
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(0, 0.3, 0);  // Position the sprite above the model
    sprite.scale.set(1, 1, 1);  // Adjust the scale of the sprite
    sprite.visible = false;
    wonModel.add(sprite);
    wonModel.userData.prompt = sprite;
}, undefined, function(error) {
    console.error('An error occurred loading the model:', error);
});

// Load the supermarket GLTF model
gltfLoader.load('/assets/supermarket.glb', function(gltf) {
    supermarketModel = gltf.scene;
    supermarketModel.position.set(11.75, 0.85, 1.8);  // Position the model
    supermarketModel.rotateY(Math.PI / -2); // Math.PI / 2 radians equals 90 degrees
    supermarketModel.castShadow = true; // Enable shadow casting
    supermarketModel.traverse(function(node) {
        if (node.isMesh) {
            node.castShadow = true; // Ensure all child meshes cast shadows
            node.receiveShadow = true; // Ensure all child meshes receive shadows
        }
    });
    scene.add(supermarketModel);

    // Create a bounding box for the wembyModel
    supermarketBoundingBox = new THREE.Box3().setFromObject(supermarketModel);
    
    // Create a sprite for the text prompt
    const spriteMaterial = new THREE.SpriteMaterial({
        map: createTextTexture('Press E to learn about Case 2'),
        transparent: true
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(0, 0.3, 0);  // Position the sprite above the model
    sprite.scale.set(1, 1, 1);  // Adjust the scale of the sprite
    sprite.visible = false;
    supermarketModel.add(sprite);
    supermarketModel.userData.prompt = sprite;
}, undefined, function(error) {
    console.error('An error occurred loading the model:', error);
});

// Load the reflection GLTF model
gltfLoader.load('/assets/reflection.glb', function(gltf) {
    reflectionModel = gltf.scene;
    reflectionModel.position.set(13.5, 0.85, 2);  // Position the model
    reflectionModel.rotateY(Math.PI / -2); // Math.PI / 2 radians equals 90 degrees
    reflectionModel.castShadow = true; // Enable shadow casting
    reflectionModel.traverse(function(node) {
        if (node.isMesh) {
            node.castShadow = true; // Ensure all child meshes cast shadows
            node.receiveShadow = true; // Ensure all child meshes receive shadows
        }
    });
    scene.add(reflectionModel);

    // Create a bounding box for the reflectionModel
    reflectionBoundingBox = new THREE.Box3().setFromObject(reflectionModel);
    
    // Create a sprite for the text prompt
    const spriteMaterial = new THREE.SpriteMaterial({
        map: createTextTexture('Press E to access the reflection'),
        transparent: true
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(0, 0.3, 0);  // Position the sprite above the model
    sprite.scale.set(1, 1, 1);  // Adjust the scale of the sprite
    sprite.visible = false;
    reflectionModel.add(sprite);
    reflectionModel.userData.prompt = sprite;
}, undefined, function(error) {
    console.error('An error occurred loading the model:', error);
});


// Load the mushroom GLTF model
gltfLoader.load('/assets/mushroom.glb', function(gltf) {
    mushroomModel = gltf.scene;
    mushroomModel.position.set(3.6, 1.6, 2.7);  // Position the model
    mushroomModel.scale.set(0.5,0.5,0.5)
    mushroomModel.rotateX(Math.PI / -2); // Math.PI / 2 radians equals 90 degrees
    mushroomModel.traverse(function(node) {

    });
    scene.add(mushroomModel);

    // Create a sprite for the text prompt
    const spriteMaterial = new THREE.SpriteMaterial({
        map: createTextTexture('Press E to learn about my Program'),
        transparent: true
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(0, 0.3, 0);  // Position the sprite above the model
    sprite.scale.set(1, 1, 1);  // Adjust the scale of the sprite
    sprite.visible = false;
    mushroomModel.add(sprite);
    mushroomModel.userData.prompt = sprite;
}, undefined, function(error) {
    console.error('An error occurred loading the model:', error);
});

// Load the ai GLTF model
gltfLoader.load('/assets/eraser.glb', function(gltf) {
    aiModel = gltf.scene;
    aiModel.position.set(7.3, 1.9, -3);  // Position the model
    aiModel.scale.set(2,2,2)
    aiModel.rotateX(Math.PI / 2); // Math.PI / 2 radians equals 90 degrees
    aiModel.rotateY(Math.PI / 2); // Math.PI / 2 radians equals 90 degrees
    aiModel.traverse(function(node) {

    });
    scene.add(aiModel);

    // Create a sprite for the text prompt
    const spriteMaterial = new THREE.SpriteMaterial({
        map: createTextTexture('Press E to learn about AI'),
        transparent: true
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(-0.3, 0.3, 0);  // Position the sprite above the model
    sprite.scale.set(0.5, 0.5, 0.5);  // Adjust the scale of the sprite
    sprite.visible = false;
    aiModel.add(sprite);
    aiModel.userData.prompt = sprite;
}, undefined, function(error) {
    console.error('An error occurred loading the model:', error);
});


// Load the fourth GLTF model
gltfLoader.load('/assets/bits.glb', function(gltf) {
    bitsModel = gltf.scene;
    bitsModel.position.set(3, 0.93, 1);  // Position the model
    bitsModel.scale.set(0.3,0.3,0.3)
    bitsModel.rotateY(Math.PI / 2); // Math.PI / 2 radians equals 90 degrees
    bitsModel.castShadow = true; // Enable shadow casting
    bitsModel.traverse(function(node) {
        if (node.isMesh) {
            node.castShadow = true; // Ensure all child meshes cast shadows
            node.receiveShadow = true; // Ensure all child meshes receive shadows
        }
    });
    scene.add(bitsModel);

    // Create a bounding box for the wembyModel
    bitsBoundingBox = new THREE.Box3().setFromObject(bitsModel);

    // Create a sprite for the text prompt
    const spriteMaterial = new THREE.SpriteMaterial({
        map: createTextTexture('Press E to read me'),
        transparent: true
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(0, 1.5, -1);  // Position the sprite above the model
    sprite.scale.set(5, 5, 5);  // Adjust the scale of the sprite
    sprite.visible = false;
    bitsModel.add(sprite);
    bitsModel.userData.prompt = sprite;
}, undefined, function(error) {
    console.error('An error occurred loading the model:', error);
});

// Load the IOT GLTF model
gltfLoader.load('/assets/phidgets.glb', function(gltf) {
    iotModel = gltf.scene;
    iotModel.position.set(10, 0.89, -2.5);  // Position the model
    iotModel.scale.set(1,1,1)
    iotModel.rotateY(Math.PI / 6); // Math.PI / 2 radians equals 90 degrees
    iotModel.castShadow = true; // Enable shadow casting
    iotModel.traverse(function(node) {
        if (node.isMesh) {
            node.castShadow = true; // Ensure all child meshes cast shadows
            node.receiveShadow = true; // Ensure all child meshes receive shadows
        }
    });
    scene.add(iotModel);

    // Create a bounding box for the wembyModel
    iotBoundingBox = new THREE.Box3().setFromObject(iotModel);

    // Create a sprite for the text prompt
    const spriteMaterial = new THREE.SpriteMaterial({
        map: createTextTexture('Press E to read about Phidgets'),
        transparent: true
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(0, 0.3, 0);  // Position the sprite above the model
    sprite.scale.set(1, 1, 1);  // Adjust the scale of the sprite
    sprite.visible = false;
    iotModel.add(sprite);
    iotModel.userData.prompt = sprite;
}, undefined, function(error) {
    console.error('An error occurred loading the model:', error);
});



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

            if (isCloseEnoughWemby && wembyModel && wembyModel.userData.prompt) {
                toggleOverlay(wembyOverlay);
            }
            if (isCloseEnoughPython && pythonModel && pythonModel.userData.prompt) {
                toggleOverlay(pythonOverlay);
            }
            if (isCloseEnoughBits && bitsModel && bitsModel.userData.prompt) {
                toggleOverlay(bitsOverlay);
            }
            if (isCloseEnoughWon && wonModel && wonModel.userData.prompt) {
                toggleOverlay(wonOverlay);
            }
            if (isCloseEnoughSupermarket && supermarketModel && supermarketModel.userData.prompt) {
                toggleOverlay(supermarketOverlay);
            }
            if (isCloseEnoughMushroom && mushroomModel && mushroomModel.userData.prompt) {
                toggleOverlay(mushroomOverlay);
            }
            if (isCloseEnoughIot && iotModel && iotModel.userData.prompt) {
                toggleOverlay(iotOverlay);
            }
            if (isCloseEnoughAi && aiModel && aiModel.userData.prompt) {
                toggleOverlay(aiOverlay);
            }
            if (isCloseEnoughReflection && reflectionModel && reflectionModel.userData.prompt) {
                toggleOverlay(reflectionOverlay);
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
const maxSpeed = 0.04;
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;

const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

// Head bobbing variables
let bobbingSpeed = 0;
let bobbingAmount = 0;
let bobbingPhase = 0;
const bobbingFrequency = 0.1; // Adjust the frequency of the bobbing effect


let isCloseEnoughWemby = false;
let isCloseEnoughPython = false;
let isCloseEnoughBits = false;
let isCloseEnoughWon = false;
let isCloseEnoughSupermarket = false;
let isCloseEnoughMushroom = false;
let isCloseEnoughIot = false;
let isCloseEnoughAi = false;
let isCloseEnoughReflection = false;


// Create overlay for wembyModel interaction message
const wembyOverlay = document.createElement('div');
wembyOverlay.style.position = 'absolute';
wembyOverlay.style.top = '50%';
wembyOverlay.style.left = '50%';
wembyOverlay.style.transform = 'translate(-50%, -50%)';
wembyOverlay.style.padding = '20px';
wembyOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
wembyOverlay.style.color = 'white';
wembyOverlay.style.fontSize = '24px';
wembyOverlay.style.textAlign = 'center';
wembyOverlay.style.display = 'none';
wembyOverlay.style.zIndex = '10';
const wembyOverlayText = document.createElement('div');
wembyOverlayText.innerHTML = 'Spreadsheets are an excellent tool for organizing and examining data, allowing one to make the accurate computation of various calculations. Spreadsheets are present across various settings, from households to professional workplaces. Their significance is essential in large companies, providing a means for business monitoring and analysis.';
wembyOverlay.appendChild(wembyOverlayText);

// Add image to wembyOverlay
const wembyImage = document.createElement('img');
wembyImage.src = 'assets/images/computer.png';
wembyImage.style.width = '100%';  // Adjust as needed
wembyOverlay.appendChild(wembyImage);

document.body.appendChild(wembyOverlay);

// Create overlay for wembyModel interaction message
const wembyOverlay2 = document.createElement('div');
wembyOverlay2.style.position = 'absolute';
wembyOverlay2.style.top = '50%';
wembyOverlay2.style.left = '50%';
wembyOverlay2.style.transform = 'translate(-50%, -50%)';
wembyOverlay2.style.padding = '20px';
wembyOverlay2.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
wembyOverlay2.style.color = 'white';
wembyOverlay2.style.fontSize = '24px';
wembyOverlay2.style.textAlign = 'center';
wembyOverlay2.style.display = 'none';
wembyOverlay2.style.zIndex = '10';
const wembyOverlayText2 = document.createElement('div');
wembyOverlayText2.innerHTML = 'In this unit, we learned spreadsheets inside-out. My overall learning experience was very positive. Although I had used spreadsheets before, I did not realize how much their efficiency could be optimized. This has been a truly eye-opening opportunity. However, I believe that in the future, students should be given more freedom to choose what they want to model. For example, I would have preferred to plan the hours I would spend on each activity during a vacation rather than focusing on the budget.'
wembyOverlay.appendChild(wembyOverlayText2);

// Create overlay for wonModel interaction message
const wonOverlay = document.createElement('div');
wonOverlay.style.position = 'absolute';
wonOverlay.style.top = '50%';
wonOverlay.style.left = '50%';
wonOverlay.style.transform = 'translate(-50%, -50%)';
wonOverlay.style.padding = '20px';
wonOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
wonOverlay.style.color = 'white';
wonOverlay.style.fontSize = '24px';
wonOverlay.style.textAlign = 'center';
wonOverlay.style.display = 'none';
wonOverlay.style.zIndex = '10';


// Add image to wonOverlay
const wonImage = document.createElement('img');
wonImage.src = 'assets/images/case1.png';
wonImage.style.width = '100%';  // Adjust as needed
wonOverlay.appendChild(wonImage);

document.body.appendChild(wonOverlay);

// Create overlay for supermarket interaction message
const supermarketOverlay = document.createElement('div');
supermarketOverlay.style.position = 'absolute';
supermarketOverlay.style.top = '50%';
supermarketOverlay.style.left = '50%';
supermarketOverlay.style.transform = 'translate(-50%, -50%)';
supermarketOverlay.style.padding = '20px';
supermarketOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
supermarketOverlay.style.color = 'white';
supermarketOverlay.style.fontSize = '24px';
supermarketOverlay.style.textAlign = 'center';
supermarketOverlay.style.display = 'none';
supermarketOverlay.style.zIndex = '10';


// Add image to supermarketOverlay
const supermarketImage = document.createElement('img');
supermarketImage.src = 'assets/images/case2.png';
supermarketImage.style.width = '100%';  // Adjust as needed
supermarketOverlay.appendChild(supermarketImage);

document.body.appendChild(supermarketOverlay);

// Create overlay for reflectionModel interaction message
const reflectionOverlay = document.createElement('div');
reflectionOverlay.style.position = 'absolute';
reflectionOverlay.style.top = '50%';
reflectionOverlay.style.left = '50%';
reflectionOverlay.style.transform = 'translate(-50%, -50%)';
reflectionOverlay.style.padding = '20px';
reflectionOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
reflectionOverlay.style.color = 'white';
reflectionOverlay.style.fontSize = '24px';
reflectionOverlay.style.textAlign = 'center';
reflectionOverlay.style.display = 'none';
reflectionOverlay.style.zIndex = '10';
const reflectionOverlayText = document.createElement('div');
reflectionOverlayText.innerHTML = 'Back during the initial stages of my portfolio, I chose prototype #2 as my homepage. These were sketches drawn on paper for my homepage. Some major feedback I received was that it was very generic and not very special. Because of the feedback, I wanted to create a new and more unique one. Originally, I was using Wix because of their drag-and-drop workflow. However, since 3d models are not supported with Wix, so I decided to make my own website and host it on GitHub pages. I have learned that creating a website is easy but creating a good one requires a lot of research. As I was looking for inspiration, I stumbled across a website "ColorLib" which included a lot of student portfolios. Looking at them, however, I realized that I wanted to have something extra unique... and is the reason my portfolio looks so different. Making this portfolio made me realize how passionate I am about coding and making a product. I am very grateful to my teacher Ms. Castro for making me work so much these last two years. '
reflectionOverlay.appendChild(reflectionOverlayText);

document.body.appendChild(reflectionOverlay);

// Create overlay for pythonModel interaction message
const pythonOverlay = document.createElement('div');
pythonOverlay.style.position = 'absolute';
pythonOverlay.style.top = '50%';
pythonOverlay.style.left = '50%';
pythonOverlay.style.transform = 'translate(-50%, -50%)';
pythonOverlay.style.padding = '20px';
pythonOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
pythonOverlay.style.color = 'white';
pythonOverlay.style.fontSize = '24px';
pythonOverlay.style.textAlign = 'center';
pythonOverlay.style.display = 'none';
pythonOverlay.style.zIndex = '10';
const pythonOverlayText = document.createElement('div');
pythonOverlayText.innerHTML = 'Programming is the process of creating instructions for a computer to follow. These instructions, known as code, are written in a specific language that the computer can understand. The goal of programming is to solve problems or perform tasks by writing sequences of commands that tell the computer what to do. Python is a high-level, interpreted programming language, designed with readability and simplicity in mind. Its clear and straightforward syntax makes it especially popular among beginners. As an interpreted language, Python executes code line by line, rather than being pre-compiled into machine code like some other languages. This feature allows for quicker testing and debugging since you can run the code directly without a separate compilation step.Im relatively happy about learning Python, even though I had some prior experience from last year. Taking the class was a great opportunity to refresh my knowledge. Initially, my attitude was not very positive because I knew we would be starting from scratch, which felt like a waste of time. However, I now believe that next time, students prior experience should be considered, and a more challenging test could be offered to make the learning process more worthwhile in the long run.'
pythonOverlay.appendChild(pythonOverlayText);

document.body.appendChild(pythonOverlay);

// Create overlay for bits interaction message
const bitsOverlay = document.createElement('div');
bitsOverlay.style.position = 'absolute';
bitsOverlay.style.top = '50%';
bitsOverlay.style.left = '50%';
bitsOverlay.style.transform = 'translate(-50%, -50%)';
bitsOverlay.style.padding = '20px';
bitsOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
bitsOverlay.style.color = 'white';
bitsOverlay.style.fontSize = '18px';
bitsOverlay.style.textAlign = 'center';
bitsOverlay.style.display = 'none';
bitsOverlay.style.zIndex = '10';
const bitsOverlayText = document.createElement('div');
bitsOverlayText.innerHTML = 'During the bits and bytes unit, we thoroughly investigated computers, not only examining their components but also delving into the reasons behind their functionality. Our exploration commenced with the disassembly of a computer, where we meticulously analyzed its parts and delved into its architectural intricacies. We were then introduced to the Von Neumann Architecture and its profound significance, comprehending the uniform execution pattern followed by every modern CPU. Fundamentally, the control and arithmetic/logic unit processed data obtained from input devices or memory units before outputting the processed data. Additionally, we delved into the realm of bits, mastering the art of counting in base 16 (hexadecimal) and base 2 (binary), thereby acquiring the ability to directly communicate with computers.In the realm of base conversions, such as converting from octal to hexadecimal form, we learned that transitioning through binary is essential. To convert from decimal to binary, we constructed a table encompassing powers of 2 (including 1) from right to left and then populated it to form the desired number. Once in binary format, transitioning to hexadecimal was simplified by grouping the binary digits into sets of four. To comprehend computer architecture more intimately, we had the opportunity to dissect an old Dell Optiplex GX270 (Desktop) dating back to 2003. Within its components, we identified the motherboard, CPU, GPU, RAM, Floppy Drive, DVD ROM, Power Supply, USB Audio Panel Board, Riser Card, Blower Fan, and the case. Each component purpose was meticulously examined, discerning whether it served as a storage, input, output, or processing device, culminating in a detailed presentation elucidating their functionalities.'
bitsOverlay.appendChild(bitsOverlayText);

// Add image to bitsoverlay
const bitsImage = document.createElement('img');
bitsImage.src = 'assets/images/bitsandbites.png';
bitsImage.style.width = '100%';  // Adjust as needed
bitsOverlay.appendChild(bitsImage);

// Create overlay for bits interaction message
const bitsOverlay2 = document.createElement('div');
bitsOverlay2.style.position = 'absolute';
bitsOverlay2.style.top = '50%';
bitsOverlay2.style.left = '50%';
bitsOverlay2.style.transform = 'translate(-50%, -50%)';
bitsOverlay2.style.padding = '20px';
bitsOverlay2.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
bitsOverlay2.style.color = 'white';
bitsOverlay2.style.fontSize = '18px';
bitsOverlay2.style.textAlign = 'center';
bitsOverlay2.style.display = 'none';
bitsOverlay2.style.zIndex = '10';
const bitsOverlayText2 = document.createElement('div');
bitsOverlayText2.innerHTML = 'Overall, I really liked this unit but it was way too short. Getting to know how computers really worked was eye-opening in a way of its own. '
bitsOverlay.appendChild(bitsOverlayText2);


document.body.appendChild(bitsOverlay);

// Create overlay for iot interaction message
const iotOverlay = document.createElement('div');
iotOverlay.style.position = 'absolute';
iotOverlay.style.top = '50%';
iotOverlay.style.left = '50%';
iotOverlay.style.transform = 'translate(-50%, -50%)';
iotOverlay.style.padding = '20px';
iotOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
iotOverlay.style.color = 'white';
iotOverlay.style.fontSize = '18px';
iotOverlay.style.textAlign = 'center';
iotOverlay.style.display = 'none';
iotOverlay.style.zIndex = '10';
const iotOverlayText = document.createElement('div');
iotOverlayText.innerHTML = 'Overall, I really liked this unit but it was way too short. Getting to know how computers really worked was eye-opening in a way of its own. '
iotOverlay.appendChild(iotOverlayText);

// Add image to iot overlay
const iotImage = document.createElement('img');
iotImage.src = 'assets/images/phidgets.png';
iotImage.style.width = '100%';  // Adjust as needed
iotOverlay.appendChild(iotImage);

document.body.appendChild(iotOverlay);

// Create overlay for mushroom interaction message
const mushroomOverlay = document.createElement('div');
mushroomOverlay.style.position = 'absolute';
mushroomOverlay.style.top = '50%';
mushroomOverlay.style.left = '50%';
mushroomOverlay.style.transform = 'translate(-50%, -50%)';
mushroomOverlay.style.padding = '20px';
mushroomOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
mushroomOverlay.style.color = 'white';
mushroomOverlay.style.fontSize = '24px';
mushroomOverlay.style.textAlign = 'center';
mushroomOverlay.style.display = 'none';
mushroomOverlay.style.zIndex = '10';
const mushroomOverlayText = document.createElement('div');
mushroomOverlayText.innerHTML = 'In this unit, I learned how to use variables, lists, functions, conditional statements, and loops.'
mushroomOverlay.appendChild(mushroomOverlayText);

// Add image to mushroomOverlay
const mushroomImage = document.createElement('img');
mushroomImage.src = 'assets/images/pythoncode.png';
mushroomImage.style.width = '80%';  // Adjust as needed
mushroomOverlay.appendChild(mushroomImage);

document.body.appendChild(mushroomOverlay);

// Create overlay for ai interaction message
const aiOverlay = document.createElement('div');
aiOverlay.style.position = 'absolute';
aiOverlay.style.top = '50%';
aiOverlay.style.left = '50%';
aiOverlay.style.transform = 'translate(-50%, -50%)';
aiOverlay.style.padding = '20px';
aiOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
aiOverlay.style.color = 'white';
aiOverlay.style.fontSize = '24px';
aiOverlay.style.textAlign = 'center';
aiOverlay.style.display = 'none';
aiOverlay.style.zIndex = '10';
const aiOverlayText = document.createElement('div');
aiOverlayText.innerHTML = 'AI replicates human intelligence, utilized in daily life for tasks like personal assistants, healthcare diagnostics, education, and optimizing transportation. It fosters positive advancements but sparks ethical concerns regarding privacy infringement, biased decision-making, potential job displacement, and security vulnerabilities.'
aiOverlay.appendChild(aiOverlayText);

document.body.appendChild(aiOverlay);

let overlayVisible = false;

function toggleOverlay(overlay) {
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

        // Calculate the player's bounding box
        const playerBox = new THREE.Box3().setFromCenterAndSize(
            camera.position,
            new THREE.Vector3(1, camera_height * 2, 1) // Size of the player's bounding box
        );

        // Check for collision with wembyModel's bounding box
        if (wembyBoundingBox && wembyBoundingBox.intersectsBox(playerBox)) {
            // Handle collision with wembyModel
            adjustPositionAfterCollision(playerBox, wembyBoundingBox);
        }

         // Check for collision with bits's bounding box
        if (bitsBoundingBox && bitsBoundingBox.intersectsBox(playerBox)) {
            // Handle collision with wembyModel
            adjustPositionAfterCollision(playerBox, bitsBoundingBox);
        }
        // Check for collision with wonModel's bounding box
        if (wonBoundingBox && wonBoundingBox.intersectsBox(playerBox)) {
            // Handle collision with wonModel
            adjustPositionAfterCollision(playerBox, wonBoundingBox);
        }
        // Check for collision with supermarketModel's bounding box
        if (supermarketBoundingBox && supermarketBoundingBox.intersectsBox(playerBox)) {
            // Handle collision with supermarketModel
            adjustPositionAfterCollision(playerBox, supermarketBoundingBox);
        }
        // Check for collision with iotModel's bounding box
        if (iotBoundingBox && iotBoundingBox.intersectsBox(playerBox)) {
            // Handle collision with iotModel
            adjustPositionAfterCollision(playerBox, iotBoundingBox);
        }
        // Check for collision with reflectionBoundingBox
        if (reflectionBoundingBox && reflectionBoundingBox.intersectsBox(playerBox)) {
            // Handle collision with reflectionBoundingBox
            adjustPositionAfterCollision(playerBox, reflectionBoundingBox);
        }
        
        

        controls.moveRight(-velocity.x);
        controls.moveForward(-velocity.z);

        // Ensure the player stays within boundaries
        camera.position.x = THREE.MathUtils.clamp(camera.position.x, 0, 18);
        camera.position.z = THREE.MathUtils.clamp(camera.position.z, -2.5, 2);
    }

    // Inside the animate function, adjust the distance check for pythonModel and wembyModel
    if (pythonModel) {
        const distanceToPython = camera.position.distanceTo(pythonModel.position);
        if (distanceToPython < 1.3) {  // Adjust distance threshold as needed
            pythonModel.userData.prompt.visible = true;
            isCloseEnoughPython = true;
        } else {
            pythonModel.userData.prompt.visible = false;
            isCloseEnoughPython = false;
            if (overlayVisible && pythonOverlay.style.display === 'block') {
                toggleOverlay(pythonOverlay);
            }
        }
    }

    if (wembyModel) {
        const distanceToWemby = camera.position.distanceTo(wembyModel.position);
        if (distanceToWemby < 1.5) {  // Adjust distance threshold as needed
            wembyModel.userData.prompt.visible = true;
            isCloseEnoughWemby = true;
        } else {
            wembyModel.userData.prompt.visible = false;
            isCloseEnoughWemby = false;
            if (overlayVisible && wembyOverlay.style.display === 'block') {
                toggleOverlay(wembyOverlay);
            }
        }
    }
    if (bitsModel) {
        const distanceToBits = camera.position.distanceTo(bitsModel.position);
        if (distanceToBits < 1.2) {  // Adjust distance threshold as needed
            bitsModel.userData.prompt.visible = true;
            isCloseEnoughBits = true;
        } else {
            bitsModel.userData.prompt.visible = false;
            isCloseEnoughBits = false;
            if (overlayVisible && bitsOverlay.style.display === 'block') {
                toggleOverlay(bitsOverlay);
            }
        }
    }
    if (wonModel) {
        const distanceToWon = camera.position.distanceTo(wonModel.position);
        if (distanceToWon < 1.2) {  // Adjust distance threshold as needed
            wonModel.userData.prompt.visible = true;
            isCloseEnoughWon = true;
        } else {
            wonModel.userData.prompt.visible = false;
            isCloseEnoughWon = false;
            if (overlayVisible && wonOverlay.style.display === 'block') {
                toggleOverlay(wonOverlay);
            }
        }
    }
    if (supermarketModel) {
        const distanceToSupermarket = camera.position.distanceTo(supermarketModel.position);
        if (distanceToSupermarket < 1.2) {  // Adjust distance threshold as needed
            supermarketModel.userData.prompt.visible = true;
            isCloseEnoughSupermarket = true;
        } else {
            supermarketModel.userData.prompt.visible = false;
            isCloseEnoughSupermarket = false;
            if (overlayVisible && supermarketOverlay.style.display === 'block') {
                toggleOverlay(supermarketOverlay);
            }
        }
    }
    if (reflectionModel) {
        const distanceToReflection = camera.position.distanceTo(reflectionModel.position);
        if (distanceToReflection < 1.2) {  // Adjust distance threshold as needed
            reflectionModel.userData.prompt.visible = true;
            isCloseEnoughReflection = true;
        } else {
            reflectionModel.userData.prompt.visible = false;
            isCloseEnoughReflection = false;
            if (overlayVisible && reflectionOverlay.style.display === 'block') {
                toggleOverlay(reflectionOverlay);
            }
        }
    }
    if (mushroomModel) {
        const distanceToMushroom = camera.position.distanceTo(mushroomModel.position);
        if (distanceToMushroom < 1) {  // Adjust distance threshold as needed
            mushroomModel.userData.prompt.visible = true;
            isCloseEnoughMushroom = true;
        } else {
            mushroomModel.userData.prompt.visible = false;
            isCloseEnoughMushroom = false;
            if (overlayVisible && mushroomOverlay.style.display === 'block') {
                toggleOverlay(mushroomOverlay);
            }
        }
    }
    if (iotModel) {
        const distanceToIot = camera.position.distanceTo(iotModel.position);
        if (distanceToIot < 2) {  // Adjust distance threshold as needed
            iotModel.userData.prompt.visible = true;
            isCloseEnoughIot = true;
        } else {
            iotModel.userData.prompt.visible = false;
            isCloseEnoughIot = false;
            if (overlayVisible && iotOverlay.style.display === 'block') {
                toggleOverlay(iotOverlay);
            }
        }
    }
    if (aiModel) {
        const distanceToAi = camera.position.distanceTo(aiModel.position);
        if (distanceToAi < 2) {  // Adjust distance threshold as needed
            aiModel.userData.prompt.visible = true;
            isCloseEnoughAi = true;
        } else {
            aiModel.userData.prompt.visible = false;
            isCloseEnoughAi = false;
            if (overlayVisible && aiOverlay.style.display === 'block') {
                toggleOverlay(aiOverlay);
            }
        }
    }


    renderer.render(scene, camera);
}

// Adjust player position after collision
function adjustPositionAfterCollision(playerBox, collisionBox) {
    const overlapX = Math.min(
        collisionBox.max.x - playerBox.min.x,
        playerBox.max.x - collisionBox.min.x
    );
    const overlapZ = Math.min(
        collisionBox.max.z - playerBox.min.z,
        playerBox.max.z - collisionBox.min.z
    );

    if (overlapX < overlapZ) {
        if (playerBox.min.x < collisionBox.min.x) {
            camera.position.x -= overlapX;
        } else {
            camera.position.x += overlapX;
        }
    } else {
        if (playerBox.min.z < collisionBox.min.z) {
            camera.position.z -= overlapZ;
        } else {
            camera.position.z += overlapZ;
        }
    }
}

// Start the animation loop
animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
