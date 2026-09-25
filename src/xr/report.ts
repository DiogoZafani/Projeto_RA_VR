import type { XRCapabilities } from './capabilities.js';

export function showXRReport(capabilities: XRCapabilities): void {

    // Remove relatório anterior, se existir
    const oldReport = document.getElementById('xr-report');

    if (oldReport) {
        oldReport.remove();
    }

    const report = document.createElement('div');

    report.id = 'xr-report';

    const sessions = capabilities.sessions;

    const inputSources = capabilities.inputSources;

    report.innerHTML = `
        <h2>Capacidades XR</h2>

        <h3>WebXR</h3>

        <p>
            API WebXR:
            ${capabilities.webXR ? 'Disponível' : 'Ausente'}
        </p>


        <h3>Tipos de sessão</h3>

        <p>
            Inline:
            ${sessions.inline ? 'Disponível' : 'Ausente'}
        </p>

        <p>
            VR imersivo:
            ${sessions.immersiveVR ? 'Disponível' : 'Ausente'}
        </p>

        <p>
            AR imersivo:
            ${sessions.immersiveAR ? 'Disponível' : 'Ausente'}
        </p>


        <h3>Recursos concedidos</h3>

        ${
            capabilities.enabledFeatures.length > 0

                ? capabilities.enabledFeatures
                    .map(feature => `<p>✓ ${feature}</p>`)
                    .join('')

                : '<p>Nenhum recurso concedido.</p>'
        }


        <h3>Fontes de entrada</h3>

        ${
            inputSources.length > 0

                ? inputSources
                    .map(input => `
                        <div>
                            <p>
                                <strong>Entrada</strong>
                            </p>

                            <p>
                                Mão:
                                ${input.handedness}
                            </p>

                            <p>
                                Tipo:
                                ${input.targetRayMode}
                            </p>

                            <p>
                                Grip Space:
                                ${input.hasGripSpace ? 'Sim' : 'Não'}
                            </p>

                            <p>
                                Hand Tracking:
                                ${input.hasHandTracking ? 'Sim' : 'Não'}
                            </p>

                            <p>
                                Graus de liberdade:
                                ${input.degreesOfFreedom}
                            </p>

                            <hr>
                        </div>
                    `)
                    .join('')

                : '<p>Nenhuma fonte de entrada detectada.</p>'
        }
    `;


    // Estilo do relatório
    report.style.position = 'fixed';

    report.style.top = '10px';

    report.style.left = '10px';

    report.style.padding = '15px';

    report.style.backgroundColor =
        'rgba(0, 0, 0, 0.85)';

    report.style.color = 'white';

    report.style.fontFamily = 'Arial';

    report.style.fontSize = '14px';

    report.style.zIndex = '9999';

    report.style.maxWidth = '350px';

    report.style.maxHeight = '90vh';

    report.style.overflowY = 'auto';


    document.body.appendChild(report);
}