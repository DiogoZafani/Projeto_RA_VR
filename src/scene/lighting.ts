import * as THREE from 'three';

/**
 * Iluminação
 */
export function setupLighting(scene: THREE.Scene): void {
    const light = new THREE.HemisphereLight(
        0xffffff,
        0x444444,
        3
    );

    scene.add(light);
}
