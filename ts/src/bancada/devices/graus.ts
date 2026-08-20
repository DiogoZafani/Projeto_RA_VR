export type GrausDeLiberdade = 'tres' | 'seis' | 'indeterminado';
export type ClasseDeAparelho =
  | 'sem-webxr'
  | 'somente-janela'
  | 'visor-orientacao'
  | 'visor-posicional'
  | 'aparelho-de-mao';

export function inferirGraus(espacos: readonly string[]): GrausDeLiberdade {
  const temReferenciaPosicional: boolean = [
    'local-floor',
    'bounded-floor',
    'unbounded',
  ].some((tipo) => espacos.includes(tipo));

  if (temReferenciaPosicional) {
    return 'seis';
  }
  if (espacos.length === 1 && espacos[0] === 'viewer') {
    return 'tres';
  }
  return 'indeterminado';
}

export function classificarAparelho(
  modosSuportados: readonly string[],
  graus: GrausDeLiberdade,
  temWebXr: boolean,
): ClasseDeAparelho {
  if (!temWebXr) {
    return 'sem-webxr';
  }

  const vr: boolean = modosSuportados.includes('immersive-vr');
  const ar: boolean = modosSuportados.includes('immersive-ar');
  if (!vr && !ar) {
    return 'somente-janela';
  }
  if (ar && !vr) {
    return 'aparelho-de-mao';
  }
  return graus === 'tres' ? 'visor-orientacao' : 'visor-posicional';
}

export function descreverClasse(classe: ClasseDeAparelho): string {
  switch (classe) {
    case 'sem-webxr':
      return 'O navegador não expôs WebXR; verifique também se a página usa um contexto seguro.';
    case 'somente-janela':
      return 'Este aparelho declarou apenas experiências apresentadas na janela do navegador.';
    case 'visor-orientacao':
      return 'Visor com evidência de rastreamento de orientação, sem posição demonstrada.';
    case 'visor-posicional':
      return 'Visor com rastreamento posicional ou com evidência ainda conservadoramente classificada.';
    case 'aparelho-de-mao':
      return 'Aparelho de mão capaz de compor conteúdo virtual sobre a câmera.';
  }
}

export function descreverGraus(graus: GrausDeLiberdade): string {
  switch (graus) {
    case 'tres':
      return 'Três graus de liberdade: há evidência apenas de orientação.';
    case 'seis':
      return 'Seis graus de liberdade: há evidência de orientação e deslocamento.';
    case 'indeterminado':
      return 'Indeterminado: os espaços concedidos não permitem uma conclusão segura.';
  }
}
