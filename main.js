import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import PineTree from './Pine';
import * as dat from 'lil-gui';

const global = {
  message:'twitter@urban_banal                    ',
  expansion: 0.95,
  slenderness: 50,
  trunkRatio: 0.2,
  leafThreshold: 0.2,
  leafSize: 20,
  height: 50,
  spawningStength: 1,
  leafBlobPropotion: 0.3,
  leafOpacity: 0.4,
  x: 0,
  z: 0,
  leafColor: '#558822',
  curve: true,
  regenerate: regenerate,
  saveImage: function() {
    captureImage = true;
  },
  saveModel: function() {
    if(pine)pine.exportToOBJ();
  }
}

const gui = new dat.GUI();
gui.add(global, 'message').name('Author: Richard Qian Li, 2023');
gui.add(global, 'expansion', 0.15, 0.95, 0.05)
gui.add(global, 'slenderness', 5, 100,5);
gui.add(global, 'trunkRatio', 0.1, 1, 0.1);
gui.add(global, 'spawningStength', 0.1, 1.2, 0.1);
gui.add(global, 'leafBlobPropotion', 0.1, 2, 0.1);
gui.add(global, 'leafThreshold', 0.05, 1, 0.05);
gui.add(global, 'leafSize', 0, 100, 10).onChange(()=>{if(pine)pine.leafSize = global.leafSize;});
gui.add(global, 'leafOpacity', 0, 1, 0.1).onChange(()=>{if(pine)pine.leafOpacity = global.leafOpacity;});
gui.add(global, 'height', 1, 100, 1).onChange(regenerate);
gui.add(global, 'x', -100, 100,1).onChange(()=>{if(pine)pine.treeGroup.position.x = global.x;});
gui.add(global, 'z', -100, 100,1).onChange(()=>{if(pine)pine.treeGroup.position.z = global.z;});
gui.add(global, 'curve').onChange(()=>{if(pine)pine.curve = global.curve;});
gui.addColor(global, 'leafColor').onChange(()=>{if(pine)pine.leafColor = global.leafColor;});
gui.add(global, 'regenerate');
gui.add(global, 'saveImage');
gui.add(global, 'saveModel');


let captureImage = false;
// Create scene, camera, and renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xccddff);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(50 , 3, 50 );
const cameraTarget = new THREE.Vector3(100, 30, 0);
camera.lookAt(cameraTarget);


const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;
renderer.shadowMap.needsUpdate = true;
renderer.toneMappingExposure = 0.5;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

let pine = new PineTree(global.height, global.x, global.z, global.expansion, global.slenderness, global.trunkRatio, global.leafThreshold, global.spawningStength, global.leafBlobPropotion, global.leafSize, global.curve, global.leafColor, global.leafOpacity);
pine.addToScene(scene);

// //add a large plane down below at y = -10 to catch shadows
const planeGeometry = new THREE.PlaneGeometry(10000, 10000);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0xaaccaa,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;
plane.rotation.x = Math.PI / 2;
plane.position.y = -1;
scene.add(plane);


//add a directional light
const directionalLight = new THREE.DirectionalLight(0xffffee, 2);
directionalLight.position.set(-100, 100, 100); 
directionalLight.target.position.set(0, 0, 0); 
directionalLight.castShadow = true;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 500;
directionalLight.shadow.camera.left = -80; 
directionalLight.shadow.camera.right = 80; 
directionalLight.shadow.camera.top = 80; 
directionalLight.shadow.camera.bottom = -80; 
directionalLight.shadow.mapSize.width = 512;
directionalLight.shadow.mapSize.height = 512;
directionalLight.shadow.darkness = 0.3;//set the shadow darker
directionalLight.shadow.bias = -0.005;
scene.add(directionalLight);
scene.add(directionalLight.target); 
const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(cameraHelper);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
function createOrbitHelper(radius) {
  // Create a circle with only the outer edge
  const circleGeometry = new THREE.CircleGeometry(radius, 64);
  const edgesGeometry = new THREE.EdgesGeometry(circleGeometry); // Get only the outer edge
  const material = new THREE.LineBasicMaterial({ color: 0x888888 }); // Red color for visibility

  // Create a circle mesh
  const circle = new THREE.LineSegments(edgesGeometry, material);
  return circle;
}

// Create circles for each plane
const orbitHelperXY = createOrbitHelper(50);
const orbitHelperYZ = createOrbitHelper(50);
const orbitHelperXZ = createOrbitHelper(50);

// Rotate them to align with the planes
orbitHelperYZ.rotation.y = Math.PI / 2;
orbitHelperXZ.rotation.x = Math.PI / 2;

// Add the orbit helpers to the scene
scene.add(orbitHelperXY, orbitHelperYZ, orbitHelperXZ);


// Create an AxesHelper with a given size
const axesHelper = new THREE.AxesHelper(50);
scene.add(axesHelper);


window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
  // Update camera's aspect ratio and projection matrix
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  // Update renderer's size
  renderer.setSize(window.innerWidth, window.innerHeight);
}
// document.getElementById('regenerate').addEventListener('click', regenerate);

function regenerate() {
  scene.remove(pine.treeGroup);
  pine = new PineTree(global.height, global.x, global.z, global.expansion, global.slenderness, global.trunkRatio, global.leafThreshold, global.spawningStength, global.leafBlobPropotion, global.leafSize, global.curve, global.leafColor, global.leafOpacity);

  pine.addToScene(scene);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
  if (captureImage) {
    const dataURL = renderer.domElement.toDataURL('image/png');

    // Create a link element
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'screenshot.png';
    link.click();

    // Reset the captureImage flag
    captureImage = false;
  }

}
animate(); //call the loop

