const video = document.getElementById('video');
const canvasElement = document.getElementById('canvas');
const canvas = canvasElement.getContext('2d');
const resultadoElement = document.getElementById('resultado');
const btnIniciar = document.getElementById('btn-iniciar');
const btnDesligar = document.getElementById('btn-desligar');
const videoContainer = document.getElementById('video-container');
const iconeStatusDiv = document.getElementById('icone-status');
const detalhesCarroP = document.getElementById('detalhes-carro');

let STATUS_PAGAMENTO = {};
const svgPago = `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g><defs><style> .cls-1 { fill: #699f4c; fill-rule: evenodd; } </style></defs><path class="cls-1" d="M800,510a30,30,0,1,1,30-30A30,30,0,0,1,800,510Zm-16.986-23.235a3.484,3.484,0,0,1,0-4.9l1.766-1.756a3.185,3.185,0,0,1,4.574.051l3.12,3.237a1.592,1.592,0,0,0,2.311,0l15.9-16.39a3.187,3.187,0,0,1,4.6-.027L817,468.714a3.482,3.482,0,0,1,0,4.846l-21.109,21.451a3.185,3.185,0,0,1-4.552.03Z" transform="translate(-770 -450)"></path></g></svg>`;

const svgNaoPago = `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g><defs><style> .cls-1 { fill: #9f4c4c; fill-rule: evenodd; } </style></defs><path class="cls-1" d="M940,510a30,30,0,1,1,30-30A30,30,0,0,1,940,510Zm15-20.047A3.408,3.408,0,0,1,955,494.77l-0.221.22a3.42,3.42,0,0,1-4.833,0l-8.764-8.755a1.71,1.71,0,0,0-2.417,0l-8.741,8.747a3.419,3.419,0,0,1-4.836,0l-0.194-.193a3.408,3.408,0,0,1,.017-4.842l8.834-8.735a1.7,1.7,0,0,0,0-2.43l-8.831-8.725a3.409,3.409,0,0,1-.018-4.844l0.193-.193a3.413,3.413,0,0,1,2.418-1c0.944,0,3.255,1.835,3.872,2.455l7.286,7.287a1.708,1.708,0,0,0,2.417,0l8.764-8.748a3.419,3.419,0,0,1,4.832,0L955,465.243a3.408,3.408,0,0,1,0,4.818l-8.727,8.737a1.7,1.7,0,0,0,0,2.407Z" transform="translate(-910 -450)"></path></g></svg>`;

const svgNaoEncontrado = `<svg viewBox="0 -4.02 60.031 60.031" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g><defs><style> .cls-1 { fill: #bf873e; fill-rule: evenodd; } </style></defs><path class="cls-1" d="M214.413,746a4.455,4.455,0,0,1-3.84-2.166,4.249,4.249,0,0,1,0-4.334l25.572-43.331a4.483,4.483,0,0,1,7.679,0L269.4,739.5a4.249,4.249,0,0,1,0,4.334,4.452,4.452,0,0,1-3.84,2.166H214.413ZM240,706a4,4,0,0,0-4,4v16a4,4,0,0,0,8,0V710A4,4,0,0,0,240,706Zm0,36a4,4,0,1,0-4-4A4,4,0,0,0,240,742Z" transform="translate(-209.969 -694)"></path></g></svg>`;

let animationFrameId = null;
let isScanning = false;
let videoTrack = null;

function carregarDados() {
    const data = {
        "STATUS_PAGAMENTO": {
            "504756": { "pago": true, "nome": "Alessandro Rodrigues da Silva", "placa": "LIO-1A23", "modelo": "Chevrolet Onix", "cor": "Prata" },
            "505614": { "pago": false, "nome": "Allan Marcos Cardoso Garcia", "placa": "MDF-3B45", "modelo": "Fiat Mobi", "cor": "Vermelho" },
            "504964": { "pago": true, "nome": "Amira Hicham Sleiman", "placa": "NPG-5C67", "modelo": "VW Polo", "cor": "Preto" },
            "503908": { "pago": false, "nome": "Andre Gabriel Chang", "placa": "QRH-7D89", "modelo": "Hyundai HB20", "cor": "Branco" },
            "504650": { "pago": true, "nome": "Andre Mai Velasco", "placa": "STJ-9E01", "modelo": "Renault Kwid", "cor": "Azul" },
            "504040": { "pago": false, "nome": "Andrei Gregori Back", "placa": "UVW-1F23", "modelo": "Toyota Corolla", "cor": "Cinza" },
            "504220": { "pago": true, "nome": "Anthony Gabriel Kuhnen Rodrigues", "placa": "XYZ-3G45", "modelo": "Honda Civic", "cor": "Prata" },
            "504652": { "pago": false, "nome": "Arthur Henrique Vieira Busanello", "placa": "ABC-5H67", "modelo": "Jeep Renegade", "cor": "Vermelho" },
            "504800": { "pago": true, "nome": "Ary de Souza Oliveira Neto", "placa": "DEF-7I89", "modelo": "Ford Ka", "cor": "Verde" },
            "504381": { "pago": false, "nome": "Augusto Leão Soares", "placa": "GHI-9J01", "modelo": "BMW X1", "cor": "Preto" },
            "505233": { "pago": true, "nome": "Beatriz Schindler", "placa": "JKL-1K23", "modelo": "Nissan Kicks", "cor": "Azul" },
            "505727": { "pago": false, "nome": "Bianca Pastega Barros Reis", "placa": "MNO-3L45", "modelo": "VW T-Cross", "cor": "Branco" },
            "503879": { "pago": true, "nome": "Bouchra Assad Akl", "placa": "PQR-5M67", "modelo": "Mercedes C180", "cor": "Prata" },
            "504596": { "pago": false, "nome": "Bruno Vieira Nobre", "placa": "STU-7N89", "modelo": "Ford Focus", "cor": "Cinza" },
            "500658": { "pago": true, "nome": "Carlos de Mello Feliponi", "placa": "VWA-9O01", "modelo": "Fiat Argo", "cor": "Branco" },
            "505759": { "pago": false, "nome": "Carolina Aveiro dos Santos", "placa": "BCA-1P23", "modelo": "GM Corsa", "cor": "Azul" },
            "504771": { "pago": true, "nome": "Cássio Vagner dos Santos Diogo", "placa": "CDB-3Q45", "modelo": "VW Fusca", "cor": "Amarelo" },
            "504250": { "pago": false, "nome": "Cristovão Martins de Souza", "placa": "DEC-5R67", "modelo": "Peugeot 208", "cor": "Preto" },
            "505463": { "pago": true, "nome": "Davi Sobreira Pacheco", "placa": "EFD-7S89", "modelo": "Citroen C3", "cor": "Prata" },
            "504657": { "pago": false, "nome": "Diogo Braz Pappa Junior", "placa": "FGE-9T01", "modelo": "Audi A3", "cor": "Vermelho" },
            "502390": { "pago": true, "nome": "Diuary Cordeiro Machado", "placa": "GHI-1U23", "modelo": "Honda Fit", "cor": "Verde" },
            "505368": { "pago": false, "nome": "Eduardo Henrique Francisconi", "placa": "JKL-3V45", "modelo": "Toyota Yaris", "cor": "Branco" },
            "503596": { "pago": true, "nome": "Eduardo Ransolin Ferreira", "placa": "MNO-5W67", "modelo": "Ford Fiesta", "cor": "Preto" },
            "503880": { "pago": false, "nome": "Emílio Anastácio de Paula Correa", "placa": "PQR-7X89", "modelo": "VW Saveiro", "cor": "Azul" },
            "505213": { "pago": true, "nome": "Emilly Vitoria Maczevski de Souza", "placa": "STU-9Y01", "modelo": "Fiat Palio", "cor": "Amarelo" },
            "503743": { "pago": false, "nome": "Enzo Akira Inoue", "placa": "VWA-1Z23", "modelo": "Hyundai Creta", "cor": "Cinza" },
            "504228": { "pago": true, "nome": "Erick Rafael Nascimento Ojeda", "placa": "BCA-3A45", "modelo": "Chevrolet Tracker", "cor": "Prata" },
            "14660": { "pago": false, "nome": "Fabiano da Silva Santos", "placa": "CDB-5B67", "modelo": "Renault Sandero", "cor": "Branco" },
            "505487": { "pago": true, "nome": "Felipe Búrigo", "placa": "DEC-7C89", "modelo": "Nissan Versa", "cor": "Vermelho" },
            "505447": { "pago": false, "nome": "Felipe Carvalho Sena", "placa": "EFD-9D01", "modelo": "Kia Cerato", "cor": "Preto" },
            "505760": { "pago": true, "nome": "Felipe Jacinto Camilo", "placa": "FGE-1E23", "modelo": "VW Golf", "cor": "Azul" },
            "502447": { "pago": false, "nome": "Felipe Luiz Wlodkowski", "placa": "GHI-3F45", "modelo": "Audi Q3", "cor": "Prata" },
            "505245": { "pago": true, "nome": "Felipe Vidal Cominetti", "placa": "JKL-5G67", "modelo": "Mercedes CLA", "cor": "Branco" },
            "505591": { "pago": false, "nome": "Fernando Suerte Miranda da Silva Martins", "placa": "MNO-7H89", "modelo": "Land Rover Evoque", "cor": "Cinza" },
            "504496": { "pago": true, "nome": "Frederico Enzo Pinheiro Peiter", "placa": "PQR-9I01", "modelo": "Volvo XC40", "cor": "Verde" },
            "504506": { "pago": false, "nome": "Gabriel da Cruz Bogo", "placa": "STU-1J23", "modelo": "BMW Série 3", "cor": "Preto" },
            "503510": { "pago": true, "nome": "Gabriel Martins Nascimento", "placa": "VWA-3K45", "modelo": "Honda HR-V", "cor": "Prata" },
            "503982": { "pago": false, "nome": "Gabriel Sottomaior Albuquerque", "placa": "BCA-5L67", "modelo": "VW Virtus", "cor": "Vermelho" },
            "505383": { "pago": true, "nome": "Guilherme Angst Royer", "placa": "CDB-7M89", "modelo": "Chevrolet Cruze", "cor": "Azul" },
            "504110": { "pago": false, "nome": "Guilherme Narde da Lapa", "placa": "DEC-9N01", "modelo": "Fiat Toro", "cor": "Branco" },
            "505297": { "pago": true, "nome": "Gustavo Ariel Gamarra Rojas", "placa": "EFD-1O23", "modelo": "Ford Ranger", "cor": "Preto" },
            "503997": { "pago": false, "nome": "Gustavo Eduardo Müller Francisquina", "placa": "FGE-3P45", "modelo": "VW Amarok", "cor": "Cinza" },
            "504116": { "pago": true, "nome": "Hasan Cayed Essaad", "placa": "GHI-5Q67", "modelo": "Toyota Hilux", "cor": "Branco" },
            "504240": { "pago": false, "nome": "Hisham Esbier", "placa": "JKL-7R89", "modelo": "Chevrolet S10", "cor": "Vermelho" },
            "283710": { "pago": true, "nome": "Isabela Campos Migliorini", "placa": "MNO-9S01", "modelo": "Nissan March", "cor": "Prata" },
            "502961": { "pago": false, "nome": "Ivo Vinicius Cassol", "placa": "PQR-1T23", "modelo": "Fiat Cronos", "cor": "Azul" },
            "504765": { "pago": true, "nome": "Jean Carlos Liang Tan", "placa": "STU-3U45", "modelo": "Renault Captur", "cor": "Preto" },
            "503957": { "pago": false, "nome": "Jean Felipe Moschen Buss", "placa": "VWA-5V67", "modelo": "VW Nivus", "cor": "Branco" },
            "505514": { "pago": true, "nome": "Jhonatan Eduardo Oliveira", "placa": "BCA-7W89", "modelo": "Honda City", "cor": "Cinza" },
            "504093": { "pago": false, "nome": "João Francisco Deon Porazzi Visinoni", "placa": "CDB-9X01", "modelo": "Ford Edge", "cor": "Verde" },
            "505184": { "pago": true, "nome": "João Pedro Pereira dos Santos", "placa": "DEC-1Y23", "modelo": "Jeep Compass", "cor": "Preto" },
            "505171": { "pago": false, "nome": "João Pedro Toscan Albieri", "placa": "EFD-3Z45", "modelo": "Audi A4", "cor": "Prata" },
            "504346": { "pago": true, "nome": "João Victor Guillen", "placa": "FGE-5A67", "modelo": "BMW Série 1", "cor": "Branco" },
            "505613": { "pago": false, "nome": "Joshua Binotto", "placa": "GHI-7B89", "modelo": "Mercedes GLC", "cor": "Vermelho" },
            "504088": { "pago": true, "nome": "Josimar Henrique de Oliveira", "placa": "JKL-9C01", "modelo": "Volvo S60", "cor": "Azul" },
            "503890": { "pago": false, "nome": "Josué Antonio Gardasz Obadovski", "placa": "MNO-1D23", "modelo": "Chevrolet Spin", "cor": "Preto" },
            "505350": { "pago": true, "nome": "Júlia Moraes de Oliveira", "placa": "PQR-3E45", "modelo": "Renault Duster", "cor": "Prata" },
            "7190": { "pago": false, "nome": "Juliano Lisarte", "placa": "STU-5F67", "modelo": "Nissan Frontier", "cor": "Cinza" },
            "505381": { "pago": true, "nome": "Kauan Emanuel Vanceta Mendes", "placa": "VWA-7G89", "modelo": "Toyota SW4", "cor": "Branco" },
            "504185": { "pago": false, "nome": "Leonardo Ramos Calegario", "placa": "BCA-9H01", "modelo": "VW Saveiro", "cor": "Vermelho" },
            "505537": { "pago": true, "nome": "Lilian Ramires Lima Castanha", "placa": "CDB-1I23", "modelo": "Honda WR-V", "cor": "Azul" },
            "504493": { "pago": false, "nome": "Lucas Adriano Ferreira Gimenez", "placa": "DEC-3J45", "modelo": "Fiat Strada", "cor": "Preto" },
            "504157": { "pago": true, "nome": "Lucas Eduardo Alves de Quadros", "placa": "EFD-5K67", "modelo": "Ford Territory", "cor": "Prata" },
            "504838": { "pago": false, "nome": "Lucas Eduardo Schneider Wiggers", "placa": "FGE-7L89", "modelo": "Jeep Commander", "cor": "Branco" },
            "504033": { "pago": true, "nome": "Luis Eduardo Rodriguez Romero", "placa": "GHI-9M01", "modelo": "VW Jetta", "cor": "Cinza" },
            "503296": { "pago": false, "nome": "Luis Gustavo da Silva Balsamo", "placa": "JKL-1N23", "modelo": "Chevrolet Montana", "cor": "Verde" },
            "504758": { "pago": true, "nome": "Luiz Fernando de Azevedo Camozi", "placa": "MNO-3O45", "modelo": "Fiat Pulse", "cor": "Vermelho" },
            "502567": { "pago": false, "nome": "Marcelo Nicolas Lujan Villalba", "placa": "PQR-5P67", "modelo": "VW Virtus", "cor": "Preto" },
            "505176": { "pago": true, "nome": "Matheus Conrado Coutinho", "placa": "STU-7Q89", "modelo": "Honda Civic", "cor": "Prata" },
            "505529": { "pago": false, "nome": "Nicolas Andres Kurek Lopez", "placa": "VWA-9R01", "modelo": "Hyundai HB20S", "cor": "Azul" },
            "506926": { "pago": true, "nome": "Nicolas Gabriel Correa Martão", "placa": "BCA-1S23", "modelo": "Renault Logan", "cor": "Branco" },
            "504885": { "pago": false, "nome": "Octavio Augusto Rubio Blanco", "placa": "CDB-3T45", "modelo": "Nissan Sentra", "cor": "Cinza" },
            "504170": { "pago": true, "nome": "Pedro Bulla Lima", "placa": "DEC-5U67", "modelo": "Toyota Prius", "cor": "Verde" },
            "505745": { "pago": false, "nome": "Pedro Henrique Alves dos Santos", "placa": "EFD-7V89", "modelo": "Ford Focus", "cor": "Preto" },
            "504446": { "pago": true, "nome": "Pedro Henrique de Abreu Foletto", "placa": "FGE-9W01", "modelo": "VW UP!", "cor": "Prata" },
            "503871": { "pago": false, "nome": "Pedro Henrique de Andrade Salvaro", "placa": "GHI-1X23", "modelo": "Chevrolet Celta", "cor": "Vermelho" },
            "505041": { "pago": true, "nome": "Pedro Henrique Roratto Yassine", "placa": "JKL-3Y45", "modelo": "Fiat Siena", "cor": "Azul" },
            "505738": { "pago": false, "nome": "Pedro Henrique Soares Martinez", "placa": "MNO-5Z67", "modelo": "Honda Fit", "cor": "Branco" },
            "505761": { "pago": true, "nome": "Pedro Lucas de Oliveira Soares", "placa": "PQR-7A89", "modelo": "Jeep Renegade", "cor": "Preto" },
            "503419": { "pago": false, "nome": "Rafael Alves de Oliveira", "placa": "STU-9B01", "modelo": "VW Golf", "cor": "Cinza" },
            "504638": { "pago": true, "nome": "Rafael Cherman Traczinski", "placa": "VWA-1C23", "modelo": "BMW Série 3", "cor": "Prata" },
            "504244": { "pago": false, "nome": "Reginaldo Santos Gomes", "placa": "BCA-3D45", "modelo": "Audi A5", "cor": "Verde" },
            "504611": { "pago": true, "nome": "Roberto Vinicius Passos Moreira de Lima", "placa": "CDB-5E67", "modelo": "Mercedes GLA", "cor": "Branco" },
            "504944": { "pago": false, "nome": "Saler Cezário Lourenço", "placa": "DEC-7F89", "modelo": "Volvo V60", "cor": "Vermelho" },
            "503822": { "pago": true, "nome": "Samuel dos Santos Gonçalves da Silva", "placa": "EFD-9G01", "modelo": "Chevrolet Prisma", "cor": "Azul" },
            "504422": { "pago": false, "nome": "Scheligan Gabriele Monzon", "placa": "FGE-1H23", "modelo": "Fiat 500", "cor": "Preto" },
            "504423": { "pago": true, "nome": "Tailyne Bertoncelli", "placa": "GHI-3I45", "modelo": "Renault Clio", "cor": "Prata" },
            "505597": { "pago": false, "nome": "Thaina Emanoelly de Souza", "placa": "JKL-5J67", "modelo": "VW Voyage", "cor": "Branco" },
            "504567": { "pago": true, "nome": "Thiago Andre Simonetti", "placa": "MNO-7K89", "modelo": "Honda CG 160", "cor": "Vermelho" },
            "505508": { "pago": false, "nome": "Thiago Zanardi", "placa": "PQR-9L01", "modelo": "Yamaha FZ25", "cor": "Azul" },
            "503264": { "pago": true, "nome": "Vinícius Cezar Casseb", "placa": "STU-1M23", "modelo": "Chevrolet Onix", "cor": "Cinza" },
            "503835": { "pago": false, "nome": "Vinicius Gabriel Aquino Ferreira", "placa": "VWA-3N45", "modelo": "Fiat Palio", "cor": "Branco" },
            "505278": { "pago": true, "nome": "Wellington Alves Clemente", "placa": "BCA-5O67", "modelo": "Ford Ka", "cor": "Preto" },
            "504700": { "pago": false, "nome": "Willian Douglas Soares Baptista", "placa": "CDB-7P89", "modelo": "VW Gol", "cor": "Prata" }
        }
    };

    STATUS_PAGAMENTO = data.STATUS_PAGAMENTO;

    btnIniciar.textContent = 'Iniciar Leitura';
    btnIniciar.disabled = false;
    resultadoElement.textContent = 'Pronto para escanear.';
}

function verificarPagamento(codigoLido) {
    const status = STATUS_PAGAMENTO[codigoLido];

    detalhesCarroP.innerHTML = "";

    const corVerde = 'var(--cor-destaque-verde)';
    const corVermelha = 'var(--cor-destaque-vermelho)';
    const corAmarela = 'var(--cor-destaque-amarelo)';

    if (!status) {
        iconeStatusDiv.innerHTML = svgNaoEncontrado;
        resultadoElement.textContent = `Código '${codigoLido}' não encontrado na lista.`;
        resultadoElement.style.color = corAmarela;
    } else if (status.pago) {
        iconeStatusDiv.innerHTML = svgPago;
        resultadoElement.textContent = `Acesso Liberado!`;
        resultadoElement.style.color = corVerde;
        detalhesCarroP.innerHTML = `<p>Nome: ${status.nome}</p><p>Placa: ${status.placa}</p><p>Marca/Modelo: ${status.modelo}</p> <p>Cor: ${status.cor}</p>`;
    } else {
        iconeStatusDiv.innerHTML = svgNaoPago;
        resultadoElement.textContent = `PAGAMENTO PENDENTE!`;
        resultadoElement.style.color = corVermelha;
        detalhesCarroP.innerHTML = `<p>Nome: ${status.nome}</p><p>Placa: ${status.placa}</p><p>Marca/Modelo: ${status.modelo}</p> <p>Cor: ${status.cor}</p>`;
    }
}

function desenharBorda(localizacao, cor) {
    canvas.strokeStyle = cor;
    canvas.lineWidth = 4;
    canvas.beginPath();
    canvas.moveTo(localizacao.topLeftCorner.x, localizacao.topLeftCorner.y);
    canvas.lineTo(localizacao.topRightCorner.x, localizacao.topRightCorner.y);
    canvas.lineTo(localizacao.bottomRightCorner.x, localizacao.bottomRightCorner.y);
    canvas.lineTo(localizacao.bottomLeftCorner.x, localizacao.bottomLeftCorner.y);
    canvas.lineTo(localizacao.topLeftCorner.x, localizacao.topLeftCorner.y);
    canvas.stroke();
}

function toggleFlash(state) {
    if (!videoTrack) return;
    const capabilities = videoTrack.getCapabilities();
    if (!capabilities.torch) {
        return;
    }
    videoTrack.applyConstraints({
        advanced: [{ torch: state }]
    }).catch(err => {
        console.error('Erro ao controlar o Flash:', err);
    });
}

function tick() {
    if (!isScanning) return;
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvasElement.height = video.videoHeight;
        canvasElement.width = video.videoWidth;
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
        const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
        });

        if (code) {
            desenharBorda(code.location, "var(--cor-destaque-vermelho)");
            verificarPagamento(code.data);
            pararScanner(code.data);
            return;
        }
    }
    animationFrameId = requestAnimationFrame(tick);
}

function iniciarScanner() {
    if (isScanning || btnIniciar.disabled) return;

    iconeStatusDiv.innerHTML = "";
    detalhesCarroP.innerHTML = "";
    resultadoElement.textContent = 'Aguardando Permissão...';
    resultadoElement.style.color = 'var(--cor-texto-secundario)';
    btnIniciar.disabled = true;

    const constraints = {
        video: {
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 }
        }
    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
            videoTrack = stream.getVideoTracks()[0];
            video.srcObject = stream;
            video.setAttribute("playsinline", true);

            video.onloadedmetadata = function () {
                video.play();

                toggleFlash(true);

                videoContainer.style.display = 'block';
                btnIniciar.style.display = 'none';
                btnDesligar.style.display = 'inline-block';
                btnDesligar.disabled = false;
                resultadoElement.textContent = 'Aponte a câmera para o QR Code.';

                isScanning = true;
                animationFrameId = requestAnimationFrame(tick);
            };
        })
        .catch(function (err) {
            btnIniciar.textContent = 'Iniciar Leitura';
            btnIniciar.disabled = false;
            resultadoElement.style.color = 'var(--cor-destaque-vermelho)';

            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                resultadoElement.textContent = 'ERRO: Acesso à câmera negado. (Permissão de sistema)';
            } else {
                resultadoElement.textContent = 'ERRO: Falha ao iniciar câmera. Detalhe: ' + err.name;
            }
            console.error('Erro ao iniciar o scanner:', err);
        });
}

function pararScanner(codigoLido) {
    toggleFlash(false);

    isScanning = false;
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }

    if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
    }

    videoContainer.style.display = 'none';
    btnIniciar.style.display = 'inline-block';
    btnIniciar.textContent = 'Iniciar Nova Leitura';
    btnIniciar.disabled = false;
    btnDesligar.style.display = 'none';

    console.log('Leitura finalizada. Código: ' + codigoLido);
    videoTrack = null;
}

function pararScannerManual() {
    pararScanner('Manual');
    resultadoElement.textContent = 'Pronto para escanear.';
    resultadoElement.style.color = 'var(--cor-texto-principal)';
    iconeStatusDiv.innerHTML = '';
}

document.addEventListener('DOMContentLoaded', carregarDados);
