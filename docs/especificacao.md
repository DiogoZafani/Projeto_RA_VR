Especificação do Projeto — Ambiente Mobiliado em Escala Real
1. Identificação do grupo e da cena

Grupo: Grupo Projeto 3
Integrantes: [Nome dos integrantes]
Cena escolhida: Ambiente mobiliado em escala real

Descrição da cena: Ambiente residencial em escala real no qual o usuário pode organizar e posicionar móveis e objetos em um espaço tridimensional.

A escolha dessa cena foi feita porque ela exige principalmente a manipulação de objetos tridimensionais e a percepção de escala. O principal custo está em fazer com que os móveis sejam posicionados de maneira consistente nos três regimes de uso: tela, visor e câmera do celular.

A principal armadilha é o tamanho da cena. Como o ambiente deve funcionar em escala real, será necessário controlar a quantidade e o nível de detalhe dos objetos para que o desempenho continue adequado nas máquinas disponíveis.

2. O que a pessoa faz ali

A pessoa entra em um ambiente vazio e encontra alguns móveis disponíveis para organizar o espaço. Ela pode pegar os móveis, movimentá-los e colocá-los em diferentes posições dentro do ambiente. A tarefa é concluída quando todos os móveis definidos para a atividade estão posicionados nos locais estabelecidos, respeitando as regras de espaço e orientação.

Com as mãos, a pessoa manipula os móveis, aproximando-os dos locais desejados e ajustando sua posição e orientação.

Com o visor, a pessoa consegue observar o ambiente em escala real e perceber melhor a distância e o tamanho dos móveis enquanto se movimenta pelo espaço.

Na câmera do celular, o ambiente virtual deve ser colocado sobre uma mesa ou outra superfície real e permanecer ancorado enquanto a pessoa movimenta o celular ao redor dele. Isso demonstra que a câmera está sendo utilizada para reconhecer a superfície e posicionar o ambiente virtual no espaço real.

3. Inventário de objetos
Objeto	Quantos	Origem	Move?	Observação
Piso	1	Construído pelo grupo	Não	Define a área do ambiente
Paredes	4	Construído pelo grupo	Não	Delimitam o ambiente
Porta	1	Modelo importado	Não	Elemento fixo
Janela	1	Modelo importado	Não	Elemento fixo
Sofá	1	Modelo importado	Sim	Móvel principal
Mesa	1	Modelo importado	Sim	Pode ser posicionada pelo usuário
Cadeira	4	Modelo importado	Sim	Podem ser organizadas ao redor da mesa
Estante	1	Modelo importado	Sim	Deve permanecer dentro da área permitida
Cama	1	Modelo importado	Sim	Móvel de maior tamanho
Armário	1	Modelo importado	Sim	Deve ficar encostado em uma parede
Luminária	2	Modelo importado	Sim	Objetos menores para composição
Tapete	1	Modelo importado	Sim	Pode ser colocado na área central
Objetos decorativos	5	Modelos importados	Sim	Elementos secundários

O inventário inicial possui 24 objetos considerando cada cadeira e objeto decorativo individualmente. Os objetos principais serão mantidos com modelos de baixa ou média complexidade para evitar excesso de processamento.

A cena combina objetos construídos pelo grupo, como piso e paredes, com modelos importados de terceiros, principalmente os móveis e objetos decorativos.

4. O espaço e as escalas

O ambiente terá aproximadamente 5 m de largura por 6 m de comprimento, com altura de 2,7 m.

O piso ficará apoiado no chão e as paredes formarão os limites do ambiente. Os móveis terão dimensões aproximadas às de móveis reais. Por exemplo, o sofá terá cerca de 2 m de largura, a mesa terá aproximadamente 1,4 m de comprimento e as cadeiras terão cerca de 0,5 m de largura.

A cena terá duas escalas legítimas:

Escala real: utilizada principalmente no computador e no visor, permitindo que o usuário caminhe e observe os móveis em tamanho próximo ao real.
Escala reduzida: utilizada pela câmera do celular, permitindo colocar uma representação do ambiente sobre uma mesa real e observar o modelo de diferentes ângulos.

Na escala reduzida, o ambiente terá aproximadamente 1 m de largura para facilitar a visualização e a manipulação pelo celular.

5. As ações do usuário
Ação	O que a pessoa faz	O que o sistema faz	Se não puder
Apontar	Direciona a visão para um móvel	O móvel recebe um contorno visual	Nenhum objeto é destacado
Selecionar	Interage com o móvel desejado	O móvel fica disponível para movimentação	O sistema informa que o objeto não pode ser selecionado
Apanhar	Aciona a interação sobre o móvel	O móvel passa a acompanhar o movimento da interação	O sistema informa que o objeto está bloqueado
Mover	Arrasta o móvel para outra posição	O móvel acompanha a posição indicada	O móvel retorna para a posição anterior se sair da área permitida
Girar	Altera a orientação do móvel	O móvel gira em torno do eixo vertical	A rotação é limitada para evitar posições inválidas
Soltar	Libera o móvel	O sistema verifica a posição e orientação	O móvel retorna à última posição válida
Encaixar	Aproxima o móvel do local definido	O sistema verifica as tolerâncias e aceita ou recusa a posição	Uma indicação informa o motivo da recusa

As ações principais são manipulações físicas dos objetos virtuais, e não ações de menu.

6. A tarefa e sua validação

O estado inicial apresenta o ambiente com os móveis disponíveis e posicionados em locais de referência. O usuário deve reorganizar os móveis de acordo com a configuração definida para a atividade.

A tarefa será considerada concluída quando todos os móveis obrigatórios estiverem dentro das áreas determinadas, com orientação correta e sem ocupar posições proibidas.

A ordem de posicionamento será livre. O usuário poderá organizar os móveis na ordem que preferir.

Para declarar sucesso, o sistema deverá verificar:

Todos os móveis obrigatórios estão posicionados.
Cada móvel está dentro de sua área permitida.
Os móveis estão com orientação aceitável.
Não existem sobreposições proibidas.
Os móveis não ultrapassam as paredes ou limites definidos para a cena.

Quando todas essas condições forem verdadeiras, o sistema exibirá a conclusão da tarefa.

7. Regras de encaixe e tolerâncias

Inicialmente serão utilizadas as seguintes tolerâncias:

Tipo de encaixe	Folga de posição	Folga de ângulo
Móvel encostado na parede	5 cm	10°
Cadeira na posição da mesa	10 cm	15°
Mesa na área definida	10 cm	10°
Cama na área definida	10 cm	10°
Estante na parede	5 cm	10°
Tapete na área central	15 cm	15°

Esses valores são provisórios e serão testados durante o desenvolvimento. A intenção é evitar tanto um encaixe automático demais quanto uma exigência de precisão que torne a tarefa difícil de executar.

Caso a tolerância de posição seja muito grande, o objeto poderá ser aceito mesmo estando visualmente fora do local desejado. Caso seja pequena demais, será difícil realizar o posicionamento usando o visor ou a câmera do celular.

Os valores finais serão definidos após testes nos três regimes.

8. Retorno ao usuário

Quando o usuário apontar para um objeto, ele será destacado com uma mudança de cor ou contorno.

Quando um móvel for selecionado e estiver sendo movimentado, ele terá uma indicação visual diferente para mostrar que está sob controle do usuário.

Quando o móvel estiver próximo de uma posição válida, a área de destino ficará destacada.

Quando o encaixe for aceito, o móvel apresentará uma confirmação visual e ficará estabilizado no local.

Quando o encaixe for recusado, a área de destino ficará vermelha e uma mensagem curta indicará o motivo, como:

"Posição inválida."
"Orientação incorreta."
"Área ocupada."
"Móvel fora do ambiente."

Quando a tarefa estiver concluída, todos os móveis válidos serão destacados por alguns segundos e será exibida uma confirmação de conclusão.

No visor, o retorno será principalmente visual e acompanhado, quando necessário, por sons curtos. Textos longos não serão utilizados durante a interação.

9. Os três regimes
Aspecto	Na tela	No visor	Pela câmera
Como se olha	Monitor e câmera virtual controlada pelo usuário	Movimento da cabeça e posição do usuário	Tela do celular e movimento do aparelho
Como se aponta e age	Mouse e teclado	Controle de movimento ou interação disponível	Toque na tela e movimentação do celular
Escala da cena	Escala real virtual	Escala real	Escala reduzida sobre uma superfície real
O que a cena faz de diferente	Permite desenvolver e testar sem equipamento adicional	Permite observar os móveis em escala real e caminhar ao redor deles	Permite visualizar o ambiente sobre uma superfície real e observar a ancoragem
O que não existe neste regime	Não existe percepção física direta do espaço	Não depende de uma tela tradicional para controlar a visão	Não utiliza o ambiente inteiro em escala real

O regime de tela será o modo base e deverá funcionar mesmo quando nenhum visor estiver disponível.

No visor, a principal diferença será a percepção espacial e de escala. O usuário poderá caminhar ao redor dos móveis e avaliar sua posição de forma mais natural.

Na câmera do celular, o ambiente será inicialmente colocado sobre uma mesa real. O sistema deverá identificar a superfície e manter o ambiente virtual ancorado nela enquanto o usuário movimenta o celular.

10. Orçamento e desempenho

A cena terá inicialmente 24 objetos no inventário.

A meta de desempenho é manter a interação visualmente fluida durante a movimentação do usuário. Como referência de projeto, será buscada uma taxa próxima de 60 quadros por segundo na tela e uma atualização suficientemente estável no visor para evitar desconforto durante o movimento.

Os móveis serão os objetos com maior nível de detalhe. Elementos repetidos, como as quatro cadeiras, utilizarão o mesmo modelo sempre que possível.

A ordem de degradação será:

Reduzir o nível de detalhe dos modelos.
Reduzir ou simplificar objetos decorativos.
Simplificar materiais e texturas.
Remover objetos decorativos secundários.
Simplificar paredes e elementos de cenário.
Reduzir a quantidade de móveis apenas como último recurso.

A interação dos móveis principais será preservada durante a degradação.

11. Erros, limites e degradação
Aparelho não suporta o regime solicitado

Caso o equipamento não tenha capacidade para utilizar o visor ou a câmera, o sistema deverá informar que o regime não está disponível e permitir que o usuário utilize o modo de tela.

Permissão de câmera negada

Se a permissão da câmera for negada, o sistema informará que ela é necessária para o modo de câmera e oferecerá a possibilidade de continuar utilizando o modo de tela.

Perda de rastreamento

Se o rastreamento da câmera for perdido, os objetos virtuais deverão permanecer na última posição conhecida enquanto o sistema informa que o rastreamento foi perdido.

O usuário deverá apontar novamente o celular para uma superfície com características suficientes para recuperar o rastreamento.

Usuário fora do espaço útil

Caso o usuário ultrapasse a área definida para a cena, o sistema deverá apresentar uma indicação visual de que ele está fora do espaço permitido.

Se um móvel for movimentado para fora dos limites do ambiente, a ação será recusada e o objeto retornará à última posição válida.

12. Ativos, formatos e licenças

Os modelos de móveis, texturas e sons serão obtidos de fontes que permitam uso no projeto, respeitando suas respectivas licenças.

Arquivo/Ativo	Origem	Licença	Endereço
Modelo do sofá	A definir	A verificar	A preencher
Modelo da mesa	A definir	A verificar	A preencher
Modelo das cadeiras	A definir	A verificar	A preencher
Modelo da cama	A definir	A verificar	A preencher
Modelo do armário	A definir	A verificar	A preencher
Modelo da estante	A definir	A verificar	A preencher
Objetos decorativos	A definir	A verificar	A preencher
Sons de interação	A definir	A verificar	A preencher

Nenhum ativo será incluído no projeto sem que sua origem e licença sejam registradas.

Os modelos importados serão utilizados como parte da composição da cena, mas a composição final do ambiente será feita pelo grupo.

13. Plano de construção por blocos
Bloco 1 — Ambiente básico

Ao final desta etapa, o ambiente deverá abrir na tela, contendo piso, paredes, porta e janela, com escala definida.

Bloco 2 — Móveis

Ao final desta etapa, os principais móveis deverão estar presentes e posicionados no ambiente.

Bloco 3 — Manipulação

Ao final desta etapa, o usuário deverá conseguir selecionar, pegar, mover, girar e soltar os móveis.

Bloco 4 — Regras de encaixe

Ao final desta etapa, o sistema deverá aceitar ou recusar posições com base nas tolerâncias definidas.

Bloco 5 — Feedback e validação

Ao final desta etapa, todas as interações principais deverão apresentar retorno visual e a tarefa deverá possuir uma condição de conclusão.

Bloco 6 — Regime de visor

Ao final desta etapa, a cena deverá funcionar no visor e permitir movimentação e observação em escala real.

Bloco 7 — Regime de câmera

Ao final desta etapa, o ambiente deverá ser colocado sobre uma superfície real e permanecer ancorado enquanto a câmera se movimenta.

Bloco 8 — Otimização e testes

Ao final desta etapa, o projeto deverá ser testado nas máquinas disponíveis e os modelos ou elementos mais pesados deverão ser simplificados quando necessário.

14. Riscos, decisões em aberto e declarações
Riscos
Risco	O que será feito	Quando
Modelos importados muito pesados	Substituir ou simplificar os modelos	Durante a montagem da cena
Dificuldade de manipulação no visor	Testar diferentes tamanhos e tolerâncias	Durante o bloco de manipulação
Rastreamento instável no celular	Testar diferentes superfícies e condições de iluminação	Durante o bloco de câmera
Ambiente grande demais para o espaço disponível	Ajustar a escala ou área utilizada	Antes dos testes com visor
Excesso de objetos	Remover elementos decorativos secundários	Durante a otimização
Encaixes difíceis de executar	Aumentar gradualmente as tolerâncias	Durante os testes
Decisões em aberto

Ainda será necessário definir os modelos finais dos móveis, as fontes dos ativos, os valores definitivos das tolerâncias e o limite de objetos decorativos que a máquina consegue executar mantendo desempenho adequado.

Essas decisões serão tomadas por meio de testes no equipamento disponível e comparação entre diferentes alternativas. Quando uma decisão for alterada, o motivo da alteração será registrado no histórico do projeto.

Declaração de uso de inteligência artificial

A inteligência artificial foi utilizada como apoio na organização e elaboração inicial desta especificação. O conteúdo será revisado pelo grupo, que ficará responsável por conferir as decisões, adaptar os valores às condições reais do projeto e garantir que todos os integrantes compreendam e consigam explicar as escolhas registradas neste documento.