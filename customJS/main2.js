import * as THREE from 'three';
import { OrbitControls } from 'three-ext/OrbitControls.js';
import { FBXLoader } from 'three-ext/FBXLoader.js';
import { camDis, getCSize, groundDis } from './value.js';
const envMap = new THREE.CubeTextureLoader().load([
    '../image/posx.jpg', '../image/negx.jpg',
    '../image/posy.jpg', '../image/negy.jpg',
    '../image/posz.jpg', '../image/negz.jpg'
]);

const containerWrapper2 = document.getElementById("containerWrapper2");
const container2 = document.getElementById('container2');

let camera2, scene2, renderer2, controls2;
let lightMain2, lightSub2, lightAmbient2;
let totalGroup2, model2;

init2();
animate();
loadFBXModel("/models/brick-wall.FBX");

function init2() {
    const cSize = getCSize(2);

    renderer2 = new THREE.WebGLRenderer( { antialias: true } );
    // renderer2.setPixelRatio( window.devicePixelRatio );
    renderer2.setSize( cSize.width, cSize.height );
    renderer2.setAnimationLoop( animate );
    renderer2.shadowMap.enabled = true;
    renderer2.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer2.setClearColor(0x002244, 0.1);

    container2.appendChild( renderer2.domElement );
    containerWrapper2.style.left = cSize.left + "px";
    containerWrapper2.style.top = cSize.top + "px";
    containerWrapper2.style.width = cSize.width + "px";

    camera2 = new THREE.PerspectiveCamera( 60, cSize.width / cSize.height, 0.1, groundDis);
    camera2.position.set(-camDis*0.7, camDis/2, -camDis*0.7);

    scene2 = new THREE.Scene();
    totalGroup2 = new THREE.Group();
    
    scene2.add(totalGroup2);

    controls2 = new OrbitControls( camera2, renderer2.domElement );
    controls2.maxDistance = camDis * 3;
    controls2.minDistance = camDis / 2;
    controls2.maxPolarAngle = Math.PI/2;

    lightAmbient2 = new THREE.AmbientLight( 0xcccccc, 0.8 );
    lightMain2 = new THREE.DirectionalLight( 0xffffff, 1.2 );
    lightSub2 = new THREE.DirectionalLight( 0xffffff, 0.2 );
    lightMain2.position.set(-1, 1, -1);
    lightSub2.position.set(1, 1, 1);
    scene2.add( lightAmbient2, lightMain2, lightSub2 );

    window.addEventListener( 'resize', onWindowResize );
}

function loadFBXModel(url) { // , onLoad
    const fbxLoader = new FBXLoader();
    fbxLoader.load( url, function (object) {
        object.children[0].scale.set(1, 1, 1);
        var vBox = new THREE.Box3().setFromObject(object);
        var vSize = vBox.getSize(new THREE.Vector3());
        console.log(object);
        // object.children[0].position.z -= (vBox.min.z + vBox.max.z) / 2;
        object.children[0].material = new THREE.MeshStandardMaterial({ color: 0xFFAA88, reflectivity: 0.5, roughness:0.3, metalness: 0.3 });
        object.children[1].material = new THREE.MeshStandardMaterial({ color: 0xAAAA88, reflectivity: 1, roughness:0, envMap:envMap, metalness: 0.8 });

        var scl = (camDis * 0.5) / vSize.y;
        object.scale.setScalar(scl); 
        totalGroup2.add(object);
        object.position.set(0, 0, 0);
        model2 = object;
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
    const cSize = getCSize(2);
    containerWrapper2.style.left = cSize.left + "px";
    containerWrapper2.style.top = cSize.top + "px";

    camera2.aspect = cSize.width / cSize.height;
    camera2.updateProjectionMatrix();

    renderer2.setSize( cSize.width, cSize.height );
}

function animate() {
    renderer2.render( scene2, camera2 );
    if (model2) {
        model2.rotation.y += 0.001;
    }
}

