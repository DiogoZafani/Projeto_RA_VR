// Monitor simples de custo de frame
// Mostra na tela o tempo do frame e compara com orçamento de 16.67 ms (60 FPS)

const BUDGET_MS = 16.67;

let panel: HTMLDivElement | null = null;

export function createFramePanel(): HTMLDivElement {
    panel = document.createElement('div');
    panel.id = 'frame-panel';
    panel.style.position = 'fixed';
    panel.style.left = '10px';
    panel.style.bottom = '10px';
    panel.style.padding = '10px';
    panel.style.backgroundColor = 'rgba(0,0,0,0.8)';
    panel.style.color = 'white';
    panel.style.fontFamily = 'monospace';
    panel.style.fontSize = '12px';
    panel.style.zIndex = '9998';
    panel.style.whiteSpace = 'pre-line';
    panel.textContent = `Frame: -- ms\nOrçamento: ${BUDGET_MS.toFixed(2)} ms\nStatus: --`;
    document.body.appendChild(panel);
    return panel;
}

export function updateFramePanel(frameMs: number, budget: number = BUDGET_MS): void {
    if (!panel) return;
    const status = frameMs <= budget ? 'Dentro do orçamento' : 'Acima do orçamento';
    const color = frameMs <= budget ? '#4caf50' : '#f44336';
    panel.textContent =
        `Frame: ${frameMs.toFixed(2)} ms\n` +
        `Orçamento: ${budget.toFixed(2)} ms\n` +
        `Status: ${status}`;
    panel.style.borderLeft = `4px solid ${color}`;
}

export { BUDGET_MS };
