let codigoGerado = null;
const dataReferencia = new Date('2020-01-01T00:00:00Z'); // Data de referência fixa
const intervaloSegundos = 15; // Intervalo de 15 segundos

function gerarCodigo() {
    // Obtém o número de segundos desde a data de referência fixa
    const agora = Date.now();
    const segundosDesdeReferencia = Math.floor((agora - dataReferencia.getTime()) / 1000);
    
    // Divide os segundos pelo intervalo (15 segundos)
    const intervaloSequencial = Math.floor(segundosDesdeReferencia / intervaloSegundos);

    // Gera o código baseado no intervalo sequencial (usar módulo 10000 para garantir 4 dígitos)
    const codigo = intervaloSequencial % 10000;
    
    // Retorna o código com 4 dígitos, preenchendo com zero à esquerda se necessário
    return codigo.toString().padStart(4, '0');
}

function obterCodigoGerado() {
    if (codigoGerado === null) {
        codigoGerado = gerarCodigo();
    }
    return codigoGerado;
}

async function validarCodigo(codigoInputado) {
    const codigoGerado = obterCodigoGerado();
    return codigoInputado === codigoGerado;
}

const input = document.querySelector('input');
const button = document.querySelector('button');
const p = document.querySelector('p');

button.addEventListener('click', async () => {
    const codigoDigitado = input.value;
    const isValido = await validarCodigo(codigoDigitado);
    p.textContent = isValido ? 'Válido' : 'Inválido';
});

input.addEventListener('input', (event) => {
    event.target.value = event.target.value.replace(/\D/g, '');
    p.textContent = '';
});

// Atualiza o código a cada 15 segundos
setInterval(() => {
    codigoGerado = gerarCodigo();
    console.log(codigoGerado);  // Exibe o código gerado no console (a cada 15 segundos)
}, 15000);

console.log(obterCodigoGerado()); // Exibe o código gerado inicialmente no console
