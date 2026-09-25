import * as THREE from 'three';

import { scene } from './scene/scene.js';
import { camera } from './scene/camera.js';
import { renderer } from './scene/renderer.js';
import { setupLighting } from './scene/lighting.js';
import { sala } from './objects/room.js';
import { sofa, almofada } from './objects/sofa.js';
import { demoReparenting } from './demo/reparenting.js';
import { createFramePanel, updateFramePanel, BUDGET_MS } from './performance/frameMonitor.js';
import { checkCapabilities } from './xr/capabilities.js';
import { showXRReport } from './xr/report.js';

setupLighting(scene);

// Scene -> Sala -> (Chão, Sofa -> Assento, Encosto, Braços, Almofada)
scene.add(sala);
sala.add(sofa);

console.log('[Árvore] Scene -> Sala -> Chão + Sofa -> (Assento, Encosto, Braços, Almofada)');
console.log(sala);
console.log(sofa);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // Sofa agora é Group com filhos, intersect recursivo
    const intersects = raycaster.intersectObject(sofa, true);

    if (intersects.length > 0) {
        sofa.rotation.y += Math.PI / 4;
    }
});


const button = document.getElementById('check-xr');

button?.addEventListener('click', async () => {
    const capabilities = await checkCapabilities();
    showXRReport(capabilities);
});

createFramePanel();

setTimeout(() => {
    demoReparenting(almofada, sofa, sala);
}, 2000);

const clock = new THREE.Clock();

function animate(): void {
    requestAnimationFrame(animate);

    const delta = clock.getDelta(); // segundos desde último frame ex: 0.016 seg
    const frameMs = delta * 1000;

    updateFramePanel(frameMs, BUDGET_MS);

    sofa.rotation.y += 0.6 * delta;

    renderer.render(scene, camera);
}

animate();
