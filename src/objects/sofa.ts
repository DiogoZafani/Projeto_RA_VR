import * as THREE from 'three';

// =====================================================
// Código antigo com GLB
// =====================================================
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// export let sofa: THREE.Object3D | null = null;
// export function loadSofa(scene: THREE.Scene): void {
//     const loader = new GLTFLoader();
//     loader.load(
//         '/models/sofa.glb',
//         (gltf) => {
//             sofa = gltf.scene;
//             sofa.scale.set(1, 1, 1);
//             sofa.position.set(0, 0, 0);
//             scene.add(sofa);
//         },
//         (xhr) => console.log((xhr.loaded / xhr.total * 100) + '% carregado'),
//         (error) => console.error('Ocorreu um erro ao carregar o modelo:', error)
//     );
// }
// =====================================================

// Sofá feito com código puro - apenas BoxGeometry
// Hierarquia: Sofa (Group) é pai de todas as partes
// Mover/rotacionar o Sofa move todas as partes junto (Scene Graph)

export const sofa = new THREE.Group();
sofa.name = 'Sofa';

// Material simples, sem texturas
const tecidoAssento = new THREE.MeshStandardMaterial({ color: 0x8b5a2b });
const tecidoEncosto = new THREE.MeshStandardMaterial({ color: 0x8b5a2b });
const tecidoBraco = new THREE.MeshStandardMaterial({ color: 0x6d4c41 });
const tecidoAlmofada = new THREE.MeshStandardMaterial({ color: 0xd7a86e });

// Assento - base do sofá
const assento = new THREE.Mesh(
    new THREE.BoxGeometry(2, 0.4, 1),
    tecidoAssento
);
assento.name = 'Assento';
assento.position.set(0, 0.2, 0);
sofa.add(assento);

// Encosto - atrás do assento
const encosto = new THREE.Mesh(
    new THREE.BoxGeometry(2, 0.6, 0.2),
    tecidoEncosto
);
encosto.name = 'Encosto';
encosto.position.set(0, 0.7, -0.4);
sofa.add(encosto);

// Braço esquerdo
const bracoEsquerdo = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.5, 1),
    tecidoBraco
);
bracoEsquerdo.name = 'BracoEsquerdo';
bracoEsquerdo.position.set(-0.85, 0.45, 0);
sofa.add(bracoEsquerdo);

// Braço direito
const bracoDireito = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.5, 1),
    tecidoBraco
);
bracoDireito.name = 'BracoDireito';
bracoDireito.position.set(0.85, 0.45, 0);
sofa.add(bracoDireito);

// Almofada - objeto usado no teste de reparenting
export const almofada = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.2, 0.4),
    tecidoAlmofada
);
almofada.name = 'Almofada';
almofada.position.set(0, 0.5, 0.1);
sofa.add(almofada);
