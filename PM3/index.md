## Por que decidir com dados 

Em produtos digitais, decidir apenas por intuição é caro. Dados reduzem incerteza e dão 
lastro a escolhas sobre valor, usabilidade e eficiência. A pergunta operacional é sempre 
a mesma: “o efeito que observei é real ou pode ser acaso?”.

 A Estatística Inferencial responde a isso comparando evidências observadas com um 
cenário de referência. Quando o dado sustenta a hipótese, avançamos com segurança; 
quando não sustenta, iteramos o design.

## Variáveis e escalas: o que exatamente estamos medindo

Antes de testar qualquer hipótese, é preciso classificar as variáveis. Isso determina o teste e o gráfico.

Qualitativas (categóricas).
Nominal: rótulos sem ordem (ex.: tipo de transporte).
Ordinal: categorias com ordem, mas sem distância uniforme (ex.: escalas Likert de satisfação de 0 a 10).
A nota 8 “é maior” que 6, mas a diferença entre 8 e 9 pode não representar o mesmo salto que entre 6 e 7.

Quantitativas.

Intervalar: diferenças fazem sentido, mas o zero é arbitrário (ex.: temperatura em °C).

De razão: possui zero absoluto e permite comparações proporcionais (ex.: tempo, distância, peso).

Discretização (ou binning).

Transforma uma variável contínua em faixas (ex.: 18-25 anos, 26-35 anos, 36-50 anos).

Essa transformação facilita análises, capta relações não lineares e torna os resultados mais comunicáveis.

## Medidas descritivas (e quando cada uma falha)

Média (Ma): resume o centro de forma eficiente, mas é sensível a outliers.

Mediana (Md): posição central (percentil 50), robusta contra valores extremos.

Desvio padrão (s): quantifica a dispersão média dos dados em torno da média, na mesma unidade da 
variável.

Quando há assimetria à direita (ex.: tempos ou rendas com cauda longa), a mediana representa melhor o valor típico.

Exemplo prático: tempos de resposta de servidores com alguns valores muito altos.

A mediana descreve o comportamento típico da maioria dos usuários, enquanto a média seria puxada pelos valores extremos.