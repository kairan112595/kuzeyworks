import * as THREE from 'three';
import { FBXLoader } from 'three-ext/FBXLoader.js';
import { STLLoader } from 'three-ext/STLLoader.js';

const loader = new THREE.CubeTextureLoader();
loader.setPath( './image/' );

const roughness = 0.3, metalness = 0.7,
	envMap = loader.load( [
		'posx.jpg', 'negx.jpg',
		'posy.jpg', 'negy.jpg',
		'posz.jpg', 'negz.jpg'
	] );

// FBX Loader instance
const fbxLoader = new FBXLoader();

// STL Loader instance
const stlLoader = new STLLoader();

export function loadFBXModel(url, onLoad, onProgress, onError) {
	fbxLoader.load(
		url,
		function (object) {
			// Process the loaded FBX model
			object.traverse(function (child) {
				if (child.isMesh) {
					child.castShadow = true;
					child.receiveShadow = true;
					
					// Apply standard material if needed
					if (child.material) {
						// Update material properties if needed
						if (child.material.isMeshBasicMaterial) {
							// Convert to standard material for better lighting
							const newMaterial = new THREE.MeshStandardMaterial({
								color: child.material.color,
								map: child.material.map,
								roughness: roughness,
								metalness: metalness,
								envMap: envMap
							});
							child.material = newMaterial;
						}
					}
				}
			});
			
			// Add to scene or group
			if (typeof totalGroup !== 'undefined') {
				totalGroup.add(object);
			}
			
			if (onLoad) onLoad(object);
		},
		onProgress,
		onError
	);
}

export function loadSTLModel(url, onLoad, onProgress, onError) {
	stlLoader.load(
		url,
		function (geometry) {
			// Create material for STL model
			const material = new THREE.MeshStandardMaterial({
				color: 0x606060,
				roughness: roughness,
				metalness: metalness,
				envMap: envMap
			});
			
			// Create mesh from geometry
			const mesh = new THREE.Mesh(geometry, material);
			mesh.castShadow = true;
			mesh.receiveShadow = true;
			
			// Center the geometry
			geometry.computeBoundingBox();
			const center = new THREE.Vector3();
			geometry.boundingBox.getCenter(center);
			geometry.translate(-center.x, -center.y, -center.z);
			
			// Create a group to contain the mesh
			const group = new THREE.Group();
			group.add(mesh);
			group.name = 'STL_Model';
			
			// Add to scene or group
			if (typeof totalGroup !== 'undefined') {
				totalGroup.add(group);
			}
			
			if (onLoad) onLoad(group);
		},
		onProgress,
		onError
	);
}

export function loadEnvironment() {
	const groundMap = new THREE.TextureLoader().load('./image/grid-2.png');
}

