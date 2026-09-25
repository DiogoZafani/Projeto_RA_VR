export interface XRInputInfo {
    handedness: string; //Indica a qual mão o controle pertence. Geralmente retorna 'left' (esquerdo), 'right' (direito) ou 'none'

    /**
     * Como o usuário interage ou aponta para as coisas. Pode assumir valores como:

        'gaze': O usuário aponta olhando para o objeto (com os olhos ou mexendo a cabeça).

        'tracked-pointer': O usuário usa um controle físico ou um raio laser saindo da mão.

        'screen': Tocar na tela do celular (comum em WebAR).    
     */
    targetRayMode: string;

    /**
     * Indica se o controle tem uma posição física
     */
    hasGripSpace: boolean;

    /**
     * Indica se o sistema está rastreando os dedos e articulações da mão nua do usuário (sem precisar segurar nenhum controle físico).
     */
    hasHandTracking: boolean;


    degreesOfFreedom: string;
}

export interface XRCapabilities {
    webXR: boolean;

    sessions: {
        inline: boolean;
        immersiveVR: boolean;
        immersiveAR: boolean;
    };

    enabledFeatures: string[];

    inputSources: XRInputInfo[];
}

export async function checkCapabilities(): Promise<XRCapabilities> {

    const xr = navigator.xr;

    // O navegador não possui WebXR
    if (!xr) {
        return {
            webXR: false,

            sessions: {
                inline: false,
                immersiveVR: false,
                immersiveAR: false
            },

            enabledFeatures: [],

            inputSources: []
        };
    }

    // Verifica quais tipos de sessão o aparelho suporta
    const inline = await xr.isSessionSupported('inline');

    const immersiveVR = await xr.isSessionSupported('immersive-vr');

    const immersiveAR = await xr.isSessionSupported('immersive-ar');

    let session: XRSession | null = null;

    /*
     * Tenta iniciar uma sessão XR.
     *
     * Isso só funciona quando esta função é chamada
     * através de uma ação do usuário, como um clique.
     */
    try {

        if (immersiveVR) {

            session = await xr.requestSession('immersive-vr', {
                optionalFeatures: [
                    'hand-tracking',    // Permite que o dispositivo mapeie as articulações dos seus dedos
                    'hit-test',         // Um recurso matemático que "atira" um raio invisível a partir da câmera ou controle para encontrar superfícies reais. 
                    'anchors',          // Permite fixar um ponto virtual no espaço real para que ele nunca mais saia do lugar.
                    'bounded-floor',    // Lê a área de segurança que o usuário configurou no óculos.
                    'depth-sensing'     // Sensor de Profundidade permite que objetos fiquem escondidos atrás de objetos reais
                ]
            });

        } else if (immersiveAR) {

            session = await xr.requestSession('immersive-ar', {
                optionalFeatures: [
                    'hand-tracking',
                    'hit-test',
                    'anchors',
                    'bounded-floor',
                    'depth-sensing'
                ]
            });
        }

    } catch (error) {

        console.log('Não foi possível iniciar uma sessão XR:', error);
    }

    /*
     * Recursos que foram realmente concedidos
     * pela sessão.
     *
     * O ?? [] resolve o erro do TypeScript:
     * se enabledFeatures for undefined,
     * usamos uma lista vazia.
     */
    const enabledFeatures = session
        ? Array.from(session.enabledFeatures ?? [])
        : [];

    const inputSources: XRInputInfo[] = [];

    /*
     * Verifica os dispositivos de entrada
     */
    if (session) {

        for (const input of session.inputSources) {

            let degreesOfFreedom = 'Desconhecido';

            if (input.gripSpace) {
                degreesOfFreedom = '6DoF';
            } else if (input.targetRayMode === 'gaze') {
                degreesOfFreedom = '3DoF';
            }

            inputSources.push({
                handedness: input.handedness,

                targetRayMode: input.targetRayMode,

                hasGripSpace: input.gripSpace !== undefined,

                hasHandTracking:
                    input.hand !== undefined,

                degreesOfFreedom
            });
        }
    }

    /*
     * A sondagem terminou.
     * Podemos encerrar a sessão.
     */
    if (session) {
        await session.end();
    }

    return {
        webXR: true,

        sessions: {
            inline,
            immersiveVR,
            immersiveAR
        },

        enabledFeatures,

        inputSources
    };
}