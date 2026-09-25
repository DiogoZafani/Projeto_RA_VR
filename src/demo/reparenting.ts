import * as THREE from 'three';

// Demonstra reparenting com attach() preservando posição mundial
// A almofada começa filha do Sofa e passa a ser filha da Sala

function formatVec(v: THREE.Vector3): string {
    return `(${v.x.toFixed(2)}, ${v.y.toFixed(2)}, ${v.z.toFixed(2)})`;
}

export function demoReparenting(
    almofada: THREE.Object3D,
    sofa: THREE.Object3D,
    sala: THREE.Object3D
): void {
    // Garante que matrizes estão atualizadas antes de medir
    sofa.updateWorldMatrix(true, false);
    sala.updateWorldMatrix(true, false);

    const antes = new THREE.Vector3();
    almofada.getWorldPosition(antes);

    // Troca de pai preservando transformação mundial (não recalcula manualmente)
    sala.attach(almofada);

    const depois = new THREE.Vector3();
    almofada.getWorldPosition(depois);

    const igual =
        antes.distanceTo(depois) < 0.0001 ? 'SIM (preservada)' : 'NÃO';

    // Painel visual simples na tela
    let panel = document.getElementById('reparenting-panel');
    if (!panel) {
        panel = document.createElement('div');
        panel.id = 'reparenting-panel';
        panel.style.position = 'fixed';
        panel.style.right = '10px';
        panel.style.top = '10px';
        panel.style.padding = '10px';
        panel.style.backgroundColor = 'rgba(0,0,0,0.8)';
        panel.style.color = 'white';
        panel.style.fontFamily = 'monospace';
        panel.style.fontSize = '12px';
        panel.style.zIndex = '9998';
        panel.style.maxWidth = '320px';
        panel.style.whiteSpace = 'pre-line';
        document.body.appendChild(panel);
    }

    panel.textContent =
        `Reparenting - Almofada\n` +
        `Pai antes: ${sofa.name}\n` +
        `Pai depois: ${sala.name}\n` +
        `Mundial antes: ${formatVec(antes)}\n` +
        `Mundial depois: ${formatVec(depois)}\n` +
        `Preservada? ${igual}`;
}
