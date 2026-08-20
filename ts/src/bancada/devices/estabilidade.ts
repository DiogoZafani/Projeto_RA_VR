export interface Estabilidade {
  readonly quadros: number;
  readonly quadrosSemPose: number;
  readonly quadrosOcultos: number;
}

export class ContadorDeEstabilidade {
  private quadros: number = 0;
  private semPose: number = 0;
  private ocultos: number = 0;

  registrar(temPose: boolean, visivel: boolean): void {
    this.quadros += 1;
    if (!temPose) {
      this.semPose += 1;
    }
    if (!visivel) {
      this.ocultos += 1;
    }
  }

  resultado(): Estabilidade {
    return {
      quadros: this.quadros,
      quadrosSemPose: this.semPose,
      quadrosOcultos: this.ocultos,
    };
  }
}

export function diagnosticarEstabilidade(leitura: Estabilidade): string {
  if (leitura.quadros === 0) {
    return 'A sessão não entregou quadros suficientes para avaliar o rastreamento.';
  }
  if (leitura.quadrosSemPose === 0) {
    return 'A pose permaneceu disponível durante toda a janela observada.';
  }
  const percentual: number = Math.round(
    (leitura.quadrosSemPose / leitura.quadros) * 100,
  );
  return `A pose esteve ausente em ${percentual}% dos quadros observados.`;
}
