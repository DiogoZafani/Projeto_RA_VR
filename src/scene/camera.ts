import * as THREE from 'three';

/**
 * Instancia uma câmera
 */
export const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(5, 4, 6);
camera.lookAt(0, 0, 0);
