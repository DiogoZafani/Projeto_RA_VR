export type EstadoDeRecurso = 'concedido' | 'negado' | 'indeterminado';

export interface RecursoOpcional {
  readonly nome: string;
  readonly finalidade: string;
}

// Somente capacidades usadas nas etapas seguintes da Bancada. Recursos que
// exigem configuração adicional, como depth-sensing, não pertencem a esta sonda.
export const RECURSOS_CONSULTADOS: readonly RecursoOpcional[] = [
  {
    nome: 'local-floor',
    finalidade: 'estabelecer uma origem alinhada ao chão do espaço físico',
  },
  {
    nome: 'bounded-floor',
    finalidade: 'informar o chão e os limites da área segura',
  },
  {
    nome: 'unbounded',
    finalidade: 'acompanhar percursos sem uma fronteira declarada',
  },
  {
    nome: 'hit-test',
    finalidade: 'consultar superfícies reais atingidas por um raio',
  },
  {
    nome: 'anchors',
    finalidade: 'manter objetos virtuais associados a pontos do ambiente',
  },
  {
    nome: 'plane-detection',
    finalidade: 'receber planos reconhecidos pelo aparelho',
  },
  {
    nome: 'hand-tracking',
    finalidade: 'acompanhar mãos articuladas sem controles físicos',
  },
] as const;

export function classificarRecurso(
  nome: string,
  habilitados: readonly string[] | undefined,
): EstadoDeRecurso {
  if (habilitados === undefined) {
    return 'indeterminado';
  }
  return habilitados.includes(nome) ? 'concedido' : 'negado';
}
