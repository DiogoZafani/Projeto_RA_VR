import * as THREE from 'three';

// Sala é o Group pai de tudo na cena
// Hierarquia exigida: Scene -> Sala -> (Chão, Sofá)
export const sala = new THREE.Group();
sala.name = 'Sala';

// Chão - filho da Sala, feito com BoxGeometry (sem texturas)
const chao = new THREE.Mesh(
    new THREE.BoxGeometry(6, 0.1, 6),
    new THREE.MeshStandardMaterial({ color: 0x777777 })
);
chao.name = 'Chao';
chao.position.set(0, -0.05, 0);
chao.receiveShadow = false;

sala.add(chao);
