import './style.css';

import * as THREE from 'three';
import { ARButton } from 'three/addons/webxr/ARButton.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { setupARHitTest } from './ar';
import {
  sondar,
  sondarSemSessao,
  type ResultadoDaSonda,
  type SondaSemSessao,
} from './bancada/devices/sonda';
import { descreverClasse, descreverGraus } from './bancada/devices/graus';
import { setupControllers } from './controllers';
import { XRScene } from './scene';

function exigirElemento<T extends HTMLElement>(
  id: string,
  construtor: new () => T,
): T {
  const elemento: HTMLElement | null = document.getElementById(id);
  if (!(elemento instanceof construtor)) {
    throw new Error(`O elemento #${id} não existe ou tem o tipo incorreto.`);
  }
  return elemento;
}

// --- Renderer e cena originais ---
const container: HTMLDivElement = exigirElemento('app', HTMLDivElement);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
container.appendChild(renderer.domElement);

const xr = new XRScene();
const orbit = new OrbitControls(xr.camera, renderer.domElement);
orbit.target.set(0, 1.2, -1);
orbit.update();

const controllers = setupControllers(renderer, xr.scene, xr.interactive);
const arHitTest = setupARHitTest(renderer, xr.scene);

document.body.appendChild(VRButton.createButton(renderer));
document.body.appendChild(
  ARButton.createButton(renderer, {
    requiredFeatures: [],
    optionalFeatures: ['hit-test', 'local-floor', 'bounded-floor', 'dom-overlay'],
    domOverlay: { root: document.body },
  }),
);

const clock = new THREE.Clock();
renderer.setAnimationLoop((_timestamp, frame) => {
  const delta: number = clock.getDelta();
  xr.update(delta);
  controllers.update();
  if (frame !== undefined) {
    arHitTest.update(frame);
  }
  renderer.render(xr.scene, xr.camera);
});

window.addEventListener('resize', () => {
  xr.camera.aspect = window.innerWidth / window.innerHeight;
  xr.camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Relatório no terminal lateral ---
const saida: HTMLPreElement = exigirElemento('terminal-saida', HTMLPreElement);
const botaoSondar: HTMLButtonElement = exigirElemento(
  'sondar-terminal',
  HTMLButtonElement,
);
let consultaInicial: SondaSemSessao | undefined;

function simOuNao(valor: boolean): string {
  return valor ? 'sim' : 'não';
}

function estadoDaSessao(suporte: string): string {
  switch (suporte) {
    case 'sim':
      return 'suportado';
    case 'nao':
      return 'não suportado';
    default:
      return 'sem resposta';
  }
}

function escrever(linhas: readonly string[]): void {
  saida.textContent = `${linhas.join('\n')}\n`;
  saida.scrollTop = saida.scrollHeight;
}

function relatorioInicial(leitura: SondaSemSessao): string[] {
  const linhas: string[] = [
    '$ xr-probe --sessions',
    '',
    `contexto-seguro : ${simOuNao(leitura.contextoSeguro)}`,
    `api-webxr        : ${simOuNao(leitura.temWebXr)}`,
    '',
    '[sessões]',
  ];

  for (const sessao of leitura.sessoes) {
    linhas.push(`  ${sessao.modo.padEnd(13)} ${estadoDaSessao(sessao.suporte)}`);
  }

  linhas.push('', '> use EXECUTAR SONDA para consultar a sessão');
  return linhas;
}

function relatorioCompleto(resultado: ResultadoDaSonda): string[] {
  const linhas: string[] = [
    '$ xr-probe --full',
    '',
    `[aparelho]`,
    `  ${descreverClasse(resultado.classe)}`,
  ];

  const sessao = resultado.emSessao;
  if (sessao === undefined) {
    linhas.push('', '[sessão]', `  ${resultado.motivoSemSessao ?? 'não aberta'}`);
    return linhas;
  }

  linhas.push('', `[recursos / ${sessao.modo}]`);
  for (const recurso of sessao.recursos) {
    linhas.push(`  ${recurso.estado.padEnd(13)} ${recurso.nome}`);
  }

  linhas.push(
    '',
    '[rastreamento]',
    `  espaços : ${sessao.espacosConcedidos.join(', ') || 'nenhum'}`,
    `  graus   : ${descreverGraus(sessao.graus)}`,
    `  fundo   : ${sessao.composicao}`,
    '',
    '[fontes de entrada]',
  );

  if (sessao.fontesDeEntrada.length === 0) {
    linhas.push('  nenhuma fonte declarada');
  } else {
    sessao.fontesDeEntrada.forEach((fonte, indice) => {
      linhas.push(
        `  #${indice + 1} lado=${fonte.lado} mira=${fonte.mira}`,
        `     punho=${simOuNao(fonte.temPoseDePunho)} mão=${simOuNao(fonte.temMao)}`,
        `     perfis=${fonte.perfis.join(', ') || 'nenhum'}`,
      );
    });
  }

  linhas.push(
    '',
    '[estabilidade]',
    `  quadros     : ${sessao.estabilidade.quadros}`,
    `  sem pose    : ${sessao.estabilidade.quadrosSemPose}`,
    `  não visíveis: ${sessao.estabilidade.quadrosOcultos}`,
    `  diagnóstico : ${sessao.diagnostico}`,
    '',
    '> sessão encerrada',
  );
  return linhas;
}

function explicarErro(erro: unknown): string {
  if (erro instanceof DOMException) {
    return `${erro.name}: ${erro.message}`;
  }
  return erro instanceof Error ? erro.message : 'erro não descrito pelo navegador';
}

async function prepararSonda(): Promise<void> {
  try {
    consultaInicial = await sondarSemSessao();
    escrever(relatorioInicial(consultaInicial));
    botaoSondar.disabled = false;
  } catch (erro: unknown) {
    escrever(['$ xr-probe --sessions', '', `[erro] ${explicarErro(erro)}`]);
  }
}

botaoSondar.addEventListener('click', () => {
  if (consultaInicial === undefined) {
    return;
  }

  botaoSondar.disabled = true;
  escrever(['$ xr-probe --full', '', 'abrindo sessão...', 'aguarde 90 quadros...']);

  void sondar(consultaInicial)
    .then((resultado) => {
      escrever(relatorioCompleto(resultado));
    })
    .catch((erro: unknown) => {
      escrever(['$ xr-probe --full', '', `[erro] ${explicarErro(erro)}`]);
    })
    .finally(() => {
      botaoSondar.disabled = false;
    });
});

void prepararSonda();
