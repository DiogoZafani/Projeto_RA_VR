import * as THREE from 'three';

/**
 * Instancia o render
 */
export const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);
