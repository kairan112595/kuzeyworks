import * as THREE from 'three';
import { OrbitControls } from 'three-ext/OrbitControls.js';
import { FBXLoader } from 'three-ext/FBXLoader.js';
import { camDis, getCSize, groundDis } from './value.js';

const containerWrapper1 = document.getElementById("containerWrapper1");
const container1 = document.getElementById('container1');

let camera1, scene1, renderer1, controls1;
let lightMain1, lightSub1, lightAmbient1;
let totalGroup1, model1;

init();
animate();
loadFBXModel1("/models/v2-twin.FBX");

function init() {
    const cSize = getCSize(1);

    renderer1 = new THREE.WebGLRenderer( { antialias: true } );
    // renderer.setPixelRatio( window.devicePixelRatio );
    renderer1.setSize( cSize.width, cSize.height );
    renderer1.setAnimationLoop( animate );
    renderer1.shadowMap.enabled = true;
    renderer1.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer1.setClearColor(0x002244, 0.1);

    container1.appendChild( renderer1.domElement );
    containerWrapper1.style.left = cSize.left + "px";
    containerWrapper1.style.top = cSize.top + "px";
    containerWrapper1.style.width = cSize.width + "px";

    camera1 = new THREE.PerspectiveCamera( 60, cSize.width / cSize.height, 0.1, groundDis);
    camera1.position.set(camDis*0.7, camDis/2, camDis*0.7);

    scene1 = new THREE.Scene();
    totalGroup1 = new THREE.Group();

    scene1.add(totalGroup1);

    controls1 = new OrbitControls( camera1, renderer1.domElement );
    controls1.maxDistance = camDis * 3;
    controls1.minDistance = camDis / 2;
    controls1.maxPolarAngle = Math.PI/2;
    controls1.enabled = false;

    lightAmbient1 = new THREE.AmbientLight( 0xcccccc, 0.8 );
    lightMain1 = new THREE.DirectionalLight( 0xffffff, 1.2 );
    lightSub1 = new THREE.DirectionalLight( 0xffffff, 0.2 );
    lightMain1.position.set(-1, 1, -1);
    lightSub1.position.set(1, 1, 1);
    scene1.add( lightAmbient1, lightMain1, lightSub1 );
    window.addEventListener( 'resize', onWindowResize );
}

function loadFBXModel1(url) { // , onLoad
    const fbxLoader = new FBXLoader();
    fbxLoader.load( url, function (object) {
        object.children[0].scale.set(1, 1, 1);
        var vBox = new THREE.Box3().setFromObject(object);
        var vSize = vBox.getSize(new THREE.Vector3());
        object.children[0].position.z -= (vBox.min.z + vBox.max.z) / 2;
        object.children[0].material = new THREE.MeshStandardMaterial({ color: 0xFFAA88, reflectivity: 1, roughness:0 });
		console.log(object);

        var scl = (camDis * 0.5) / vSize.y;
        object.scale.setScalar(scl); 
        totalGroup1.add(object);
        object.position.set(0, 0, 0);
        model1 = object;
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
    const cSize = getCSize(1);
    containerWrapper1.style.left = cSize.left + "px";
    containerWrapper1.style.top = cSize.top + "px";

    camera1.aspect = cSize.width / cSize.height;
    camera1.updateProjectionMatrix();

    renderer1.setSize( cSize.width, cSize.height );
}

function animate() {
    renderer1.render( scene1, camera1 );
    if (model1) {
        model1.rotation.y -= 0.001;
    }
}

