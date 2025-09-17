import * as THREE from 'three';
import { OrbitControls } from 'three-ext/OrbitControls.js';
import { FBXLoader } from 'three-ext/FBXLoader.js';
import { camDis, getCSize, groundDis } from './value.js';

const containerWrapper = document.getElementById("containerWrapper0");
const container = document.getElementById('container0');

let camera, scene, renderer, controls;
let lightMain, lightSub, lightAmbient;
let totalGroup, model;

init();
animate();
loadFBXModel("/models/drone-opt-100.FBX");

function init() {
	const cSize = getCSize(0);

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	// renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( cSize.width, cSize.height );
	renderer.setAnimationLoop( animate );
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	renderer.setClearColor(0x002244, 0.1);

	container.appendChild( renderer.domElement );
	containerWrapper.style.left = cSize.left + "px";
	containerWrapper.style.top = cSize.top + "px";
	containerWrapper.style.width = cSize.width + "px";

	camera = new THREE.PerspectiveCamera( 60, cSize.width / cSize.height, 0.1, groundDis);
	camera.position.set(0, camDis/2, -camDis*1.5);

	scene = new THREE.Scene();
	totalGroup = new THREE.Group();
	
	scene.add(totalGroup);

	controls = new OrbitControls( camera, renderer.domElement );
	controls.maxDistance = camDis * 3;
	controls.minDistance = camDis / 2;
	controls.maxPolarAngle = Math.PI/2;
	controls.enabled = false;

	lightAmbient = new THREE.AmbientLight( 0xcccccc, 0.8 );
	lightMain = new THREE.DirectionalLight( 0xffffff, 1.2 );
	lightSub = new THREE.DirectionalLight( 0xffffff, 0.2 );
	lightMain.position.set(-1, 1, -1);
	lightSub.position.set(1, 1, 1);
	scene.add( lightAmbient, lightMain, lightSub );

	window.addEventListener( 'resize', onWindowResize );

}

function loadFBXModel(url) { // , onLoad
	const fbxLoader = new FBXLoader();
	fbxLoader.load( url, function (object) {
		object.children[0].scale.set(1, 1, 1);
		var vBox = new THREE.Box3().setFromObject(object);
		var vSize = vBox.getSize(new THREE.Vector3());
		object.children[0].position.z -= (vBox.min.z + vBox.max.z) / 2;
		object.children[0].material = new THREE.MeshStandardMaterial({ color: 0x88AAFF, reflectivity: 1, roughness:0 });

		var scl = (camDis * 0.5) / vSize.y;
		object.scale.setScalar(scl); 
		totalGroup.add(object);
		object.position.set(0, 0, 0);
		model = object;
	},
	xhr => { 
		if (xhr.total > 0) {
			console.log('Loading progress:', (xhr.loaded / xhr.total * 100) + '%'); 
		}
	},
	error => {
		console.error(error);
	});
}

function onWindowResize() {
	const cSize = getCSize(0);
	containerWrapper.style.left = cSize.left + "px";
	containerWrapper.style.top = cSize.top + "px";

	camera.aspect = cSize.width / cSize.height;
	camera.updateProjectionMatrix();

	renderer.setSize( cSize.width, cSize.height );
}

function animate() {
	renderer.render( scene, camera );
	if (model) model.rotation.y += 0.001;
}

