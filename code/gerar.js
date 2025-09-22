async function buscarCodigoGerado() {
    try {
        const resposta = await fetch('https://aisenseapi.com/services/v1/timestamp');
        const dados = await resposta.json();
        const timestamp = dados.timestamp;
        const aleatorio = Math.floor(Math.random() * 10000);
        const codigo = (timestamp + aleatorio) % 10000;
        return codigo.toString().padStart(4, '0');
    } catch (erro) {
        console.error('Falha ao buscar o código gerado:', erro);
        return null;
    }
}

let codigoGerado;

async function iniciarGeracaoPeriodica() {
    codigoGerado = await buscarCodigoGerado();
    setInterval(async () => {
        codigoGerado = await buscarCodigoGerado();
    }, 15000);
}

iniciarGeracaoPeriodica();

export { codigoGerado };