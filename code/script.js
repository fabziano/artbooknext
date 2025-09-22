let codigoGerado = null;
let cepSequencial = 10000; // Valor inicial do CEP sequencial

async function buscarCodigoGerado() {
    try {
        const resposta = await fetch(`https://viacep.com.br/ws/01001000/json/`);
        const dados = await resposta.json();
        const cep = parseInt(dados.cep.replace('-', ''), 10); // Remove o hífen e converte para número
        const aleatorio = Math.floor(Math.random() * 10000);
        const codigo = (cep + cepSequencial + aleatorio) % 10000;
        cepSequencial++; // Incrementa o CEP sequencial para o próximo valor
        return codigo.toString().padStart(4, '0');
    } catch (erro) {
        console.error('Falha ao buscar o código gerado:', erro);
        return null;
    }
}

async function iniciarGeracaoPeriodica() {
    codigoGerado = await buscarCodigoGerado();
    console.log(codigoGerado);  // Agora o código será impresso após a geração inicial

    setInterval(async () => {
        codigoGerado = await buscarCodigoGerado();
    }, 15000);
}

function obterCodigoGerado() {
    return codigoGerado;
}

async function validarCodigo(codigoInputado) {
    const codigoGerado = await obterCodigoGerado();
    if (codigoGerado === null) {
        return false;
    }
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

iniciarGeracaoPeriodica();
