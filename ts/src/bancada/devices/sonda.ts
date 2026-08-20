import {
  classificarAparelho,
  inferirGraus,
  type ClasseDeAparelho,
  type GrausDeLiberdade,
} from './graus';
import {
  RECURSOS_CONSULTADOS,
  classificarRecurso,
  type EstadoDeRecurso,
} from './recursos';
import {
  ContadorDeEstabilidade,
  diagnosticarEstabilidade,
  type Estabilidade,
} from './estabilidade';

export type ModoSondavel = 'immersive-vr' | 'immersive-ar';
export type Suporte = 'sim' | 'nao' | 'desconhecido';

const MODOS_CONSULTADOS: readonly XRSessionMode[] = [
  'inline',
  'immersive-vr',
  'immersive-ar',
];
const ESPACOS_TENTADOS: readonly XRReferenceSpaceType[] = [
  'bounded-floor',
  'local-floor',
  'unbounded',
  'local',
  'viewer',
];
const QUADROS_OBSERVADOS: number = 90;

export interface LeituraDeSessao {
  readonly modo: XRSessionMode;
  readonly suporte: Suporte;
  readonly observacao: string;
}

export interface RecursoSondado {
  readonly nome: string;
  readonly finalidade: string;
  readonly estado: EstadoDeRecurso;
}

export interface FonteDeEntradaSondada {
  readonly lado: XRHandedness;
  readonly mira: XRTargetRayMode;
  readonly temPoseDePunho: boolean;
  readonly temMao: boolean;
  readonly perfis: readonly string[];
}

export interface SondaSemSessao {
  readonly contextoSeguro: boolean;
  readonly temWebXr: boolean;
  readonly sessoes: readonly LeituraDeSessao[];
  readonly modosSuportados: readonly string[];
}

export interface SondaEmSessao {
  readonly modo: ModoSondavel;
  readonly recursos: readonly RecursoSondado[];
  readonly espacosConcedidos: readonly string[];
  readonly fontesDeEntrada: readonly FonteDeEntradaSondada[];
  readonly graus: GrausDeLiberdade;
  readonly composicao: XREnvironmentBlendMode;
  readonly estabilidade: Estabilidade;
  readonly diagnostico: string;
}

export interface ResultadoDaSonda {
  readonly semSessao: SondaSemSessao;
  readonly emSessao: SondaEmSessao | undefined;
  readonly motivoSemSessao: string | undefined;
  readonly classe: ClasseDeAparelho;
}

let ultimoResultado: ResultadoDaSonda | undefined;

export function consultarUltimoResultado(): ResultadoDaSonda | undefined {
  return ultimoResultado;
}

async function consultarSuporte(
  xr: XRSystem,
  modo: XRSessionMode,
): Promise<LeituraDeSessao> {
  try {
    const suportado: boolean = await xr.isSessionSupported(modo);
    return {
      modo,
      suporte: suportado ? 'sim' : 'nao',
      observacao: suportado
        ? 'O navegador declarou suporte a este tipo de sessão.'
        : 'O navegador declarou que este tipo de sessão não está disponível.',
    };
  } catch (erro: unknown) {
    return {
      modo,
      suporte: 'desconhecido',
      observacao:
        erro instanceof Error
          ? `A consulta falhou: ${erro.message}`
          : 'A consulta não devolveu uma explicação.',
    };
  }
}

export async function sondarSemSessao(): Promise<SondaSemSessao> {
  const xr: XRSystem | undefined = navigator.xr;
  if (xr === undefined) {
    return {
      contextoSeguro: window.isSecureContext,
      temWebXr: false,
      sessoes: MODOS_CONSULTADOS.map((modo) => ({
        modo,
        suporte: 'desconhecido',
        observacao: window.isSecureContext
          ? 'A API WebXR não foi exposta pelo navegador.'
          : 'A página não está em contexto seguro; a API WebXR foi bloqueada.',
      })),
      modosSuportados: [],
    };
  }

  const sessoes: LeituraDeSessao[] = await Promise.all(
    MODOS_CONSULTADOS.map((modo) => consultarSuporte(xr, modo)),
  );
  return {
    contextoSeguro: window.isSecureContext,
    temWebXr: true,
    sessoes,
    modosSuportados: sessoes
      .filter((leitura) => leitura.suporte === 'sim')
      .map((leitura) => leitura.modo),
  };
}

async function obterEspacos(sessao: XRSession): Promise<string[]> {
  const concedidos: string[] = [];
  for (const tipo of ESPACOS_TENTADOS) {
    try {
      await sessao.requestReferenceSpace(tipo);
      concedidos.push(tipo);
    } catch {
      // A rejeição é a resposta da consulta para este espaço específico.
    }
  }
  return concedidos;
}

function lerFontes(sessao: XRSession): FonteDeEntradaSondada[] {
  return [...sessao.inputSources].map((fonte) => ({
    lado: fonte.handedness,
    mira: fonte.targetRayMode,
    temPoseDePunho: fonte.gripSpace !== undefined,
    temMao: fonte.hand !== undefined,
    perfis: [...fonte.profiles],
  }));
}

async function prepararSuperficie(sessao: XRSession): Promise<void> {
  const canvas: HTMLCanvasElement = document.createElement('canvas');
  const atributos: WebGLContextAttributes = { alpha: true, xrCompatible: true };
  const gl2: WebGL2RenderingContext | null = canvas.getContext('webgl2', atributos);
  const gl1: WebGLRenderingContext | null =
    gl2 === null ? canvas.getContext('webgl', atributos) : null;
  const gl: WebGLRenderingContext | WebGL2RenderingContext | null = gl2 ?? gl1;

  if (gl === null) {
    throw new Error('O navegador não forneceu uma superfície WebGL compatível com WebXR.');
  }

  await gl.makeXRCompatible();
  sessao.updateRenderState({ baseLayer: new XRWebGLLayer(sessao, gl) });
}

function observarQuadros(
  sessao: XRSession,
  referencia: XRReferenceSpace,
): Promise<Estabilidade> {
  return new Promise((resolver) => {
    const contador: ContadorDeEstabilidade = new ContadorDeEstabilidade();
    let restantes: number = QUADROS_OBSERVADOS;

    const observar: XRFrameRequestCallback = (_tempo, quadro) => {
      const pose: XRViewerPose | undefined = quadro.getViewerPose(referencia);
      contador.registrar(pose !== undefined, sessao.visibilityState === 'visible');
      restantes -= 1;

      if (restantes > 0) {
        sessao.requestAnimationFrame(observar);
      } else {
        resolver(contador.resultado());
      }
    };

    sessao.requestAnimationFrame(observar);
  });
}

export function modoPreferido(
  modosSuportados: readonly string[],
): ModoSondavel | undefined {
  const ordem: readonly ModoSondavel[] = ['immersive-ar', 'immersive-vr'];
  return ordem.find((modo) => modosSuportados.includes(modo));
}

export async function sondarEmSessao(modo: ModoSondavel): Promise<SondaEmSessao> {
  const xr: XRSystem | undefined = navigator.xr;
  if (xr === undefined) {
    throw new Error('A API WebXR não está disponível neste navegador.');
  }

  const sessao: XRSession = await xr.requestSession(modo, {
    optionalFeatures: RECURSOS_CONSULTADOS.map((recurso) => recurso.nome),
  });

  try {
    await prepararSuperficie(sessao);
    const espacosConcedidos: string[] = await obterEspacos(sessao);
    const tipoDeReferencia: XRReferenceSpaceType = espacosConcedidos.includes('local-floor')
      ? 'local-floor'
      : 'viewer';
    const referencia: XRReferenceSpace = await sessao.requestReferenceSpace(tipoDeReferencia);
    const estabilidade: Estabilidade = await observarQuadros(sessao, referencia);
    const fontesDeEntrada: FonteDeEntradaSondada[] = lerFontes(sessao);
    const habilitados: readonly string[] | undefined = sessao.enabledFeatures;

    return {
      modo,
      recursos: RECURSOS_CONSULTADOS.map((recurso) => ({
        ...recurso,
        estado: classificarRecurso(recurso.nome, habilitados),
      })),
      espacosConcedidos,
      fontesDeEntrada,
      graus: inferirGraus(espacosConcedidos),
      composicao: sessao.environmentBlendMode,
      estabilidade,
      diagnostico: diagnosticarEstabilidade(estabilidade),
    };
  } finally {
    await sessao.end();
  }
}

export async function sondar(
  consultaExistente?: SondaSemSessao,
): Promise<ResultadoDaSonda> {
  const semSessao: SondaSemSessao = consultaExistente ?? (await sondarSemSessao());
  const modo: ModoSondavel | undefined = modoPreferido(semSessao.modosSuportados);

  if (modo === undefined) {
    const resultado: ResultadoDaSonda = {
      semSessao,
      emSessao: undefined,
      motivoSemSessao: semSessao.temWebXr
        ? 'O aparelho não declarou suporte a uma sessão imersiva.'
        : 'Não há API WebXR disponível; confira também o contexto seguro da página.',
      classe: classificarAparelho(
        semSessao.modosSuportados,
        'indeterminado',
        semSessao.temWebXr,
      ),
    };
    ultimoResultado = resultado;
    return resultado;
  }

  const emSessao: SondaEmSessao = await sondarEmSessao(modo);
  const resultado: ResultadoDaSonda = {
    semSessao,
    emSessao,
    motivoSemSessao: undefined,
    classe: classificarAparelho(
      semSessao.modosSuportados,
      emSessao.graus,
      semSessao.temWebXr,
    ),
  };
  ultimoResultado = resultado;
  return resultado;
}
