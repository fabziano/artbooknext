const equipes = JSON.parse(localStorage.getItem('equipes')) || []
var rodadas = [];
var rodadasRepescagem = [];
var equipesRepescagem = [];

function btnCriarChaves() {
    rodadas = [];
    rodadasRepescagem = [];
    equipesRepescagem = [];
    var chave = document.getElementById("chave");
    chave.innerHTML = "";
    var repescagem = document.getElementById("repescagem");
    repescagem.innerHTML = "";
    criarChaves();
}
function criarChaves() {
    var chavesTemp = [];
    var equipesTemp = [];
    if (rodadas.length == 0)
        equipesTemp = [...equipes];
    else {
        for (let r = 0; r < rodadas.length; r++) {
            rodadas[r].winners = [];
            for (let c = 0; c < rodadas[r].chaves.length; c++) {
                rodadas[r].winners.push(rodadas[r].chaves[c].vencedor);
            }
            if (rodadas.length == 1) {
                if (rodadasRepescagem[rodadasRepescagem.length - 1].chaves[0].equipe2 == undefined) {
                    rodadas[rodadas.length - 1].winners.push(rodadasRepescagem[rodadasRepescagem.length - 1].chaves[0].equipe1);
                }
            }
        }
        equipesTemp = [...rodadas[rodadas.length - 1].winners];
    }
    if (rodadas.length == 0 || equipesTemp.length % 2 != 0 && equipesTemp.length != 1) {
        for (let i = equipesTemp.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [equipesTemp[i], equipesTemp[j]] = [equipesTemp[j], equipesTemp[i]];
        }
    }
    if (equipesTemp.length % 2 != 0 && equipesTemp.length != 1) {
        var novaEquipePreenchimento = {
            nome: null,
            imagem: "",
            botao: undefined
        };
        equipesTemp.push(novaEquipePreenchimento);
    }
    for (let i = 0; i < equipesTemp.length; i += 2) {
        var novaChave = {
            equipe1: equipesTemp[i],
            equipe2: equipesTemp[i + 1],
            vencedor: undefined,
        };
        chavesTemp.push(novaChave);
    }
    var novaRodada = {
        chaves: [...chavesTemp],
        winners: []
    };
    rodadas.push(novaRodada);
    carregarChaves();
    carregarChavesRepescagem();
}
function carregarChaves() {
    var chaveDiv = document.getElementById("chave");
    chaveDiv.innerHTML = "";
    for (let r = 0; r < rodadas.length; r++) {
        var mainDiv = document.createElement("div");
        mainDiv.classList.add("rodada")
        for (let c = 0; c < rodadas[r].chaves.length; c++) {
            let chave = rodadas[r].chaves[c];
            var duplaDiv = document.createElement("div");
            duplaDiv.classList.add("dupla");
            if (rodadas[rodadas.length - 1].chaves[0].equipe2 != undefined) {
                if (rodadasRepescagem.length == 0 || rodadasRepescagem[rodadasRepescagem.length - 1].chaves[0].equipe2 == undefined && rodadas.length > 1) {
                    if (r == rodadas.length - 1) {
                        let desfazer = document.createElement('div')
                        desfazer.classList = 'desfazer'
                        var desfazerButton = document.createElement("i");
                        desfazerButton.classList = 'bi bi-arrow-counterclockwise'
                        desfazerButton.setAttribute('title', 'Desfazer')
                        desfazerButton.onclick = criarBotaoDesfazerHandler(chave);
                        desfazer.appendChild(desfazerButton)
                        duplaDiv.appendChild(desfazer)
                    }
                }
            }
            carregarElementosChaves(duplaDiv, chave);
            mainDiv.appendChild(duplaDiv);
        }
        chaveDiv.appendChild(mainDiv);
    }
}
function criarBotaoAvancarHandler(chave, winner) {
    return function () {
        if (!chave.vencedor) {
            chave.vencedor = winner ? chave.equipe1 : chave.equipe2;
            carregarChaves();
            carregarChavesRepescagem();
            verificarEAvancarRodada();
        }
    };
}
function criarBotaoDesfazerHandler(chave) {
    return function () {
        if (chave.vencedor && chave.equipe1.nome != null && chave.equipe2.nome != null) {
            const index = rodadas[rodadas.length - 1].winners.indexOf(chave.vencedor);
            rodadas[rodadas.length - 1].winners.splice(index, 1);
            const perdedor = chave.equipe1 === chave.vencedor ? chave.equipe2 : chave.equipe1;
            const perdedorIndex = equipesRepescagem.findIndex(equipe => equipe.nome === perdedor.nome);
            if (perdedorIndex !== -1) {
                equipesRepescagem.splice(perdedorIndex, 1);
            }
            chave.vencedor = undefined;
            if (chave.equipe1Botao) {
                chave.equipe1Botao.disabled = false;
                chave.equipe1Botao.style.backgroundColor = '';
            }
            if (chave.equipe2Botao) {
                chave.equipe2Botao.disabled = false;
                chave.equipe2Botao.style.backgroundColor = '';
            }
            carregarChaves();
            carregarChavesRepescagem();
        } else {
            alert("Não é possível retroceder essa equipe na atual chave");
        }
    };
}
function criarChavesRepescagem() {
    var chavesTemp = [];
    var equipesTemp = [];
    if (rodadasRepescagem.length == 0) {
        equipesRepescagem = [];
        for (let c = 0; c < rodadas[0].chaves.length; c++) {
            if (rodadas[0].chaves[c].vencedor == rodadas[0].chaves[c].equipe1) {
                if (rodadas[0].chaves[c].equipe2.nome) {
                    equipesRepescagem.push(rodadas[0].chaves[c].equipe2);
                }
            }
            else if (rodadas[0].chaves[c].vencedor == rodadas[0].chaves[c].equipe2) {
                if (rodadas[0].chaves[c].equipe1.nome) {
                    equipesRepescagem.push(rodadas[0].chaves[c].equipe1);
                }
            }
        }
        equipesTemp = [...equipesRepescagem];
    } else {
        for (let r = 0; r < rodadasRepescagem.length; r++) {
            rodadasRepescagem[r].winners = [];
            for (let c = 0; c < rodadasRepescagem[r].chaves.length; c++) {
                rodadasRepescagem[r].winners.push(rodadasRepescagem[r].chaves[c].vencedor);
            }
        }
        equipesTemp = [...rodadasRepescagem[rodadasRepescagem.length - 1].winners];
    }
    if (rodadasRepescagem.length == 0 || equipesTemp.length % 2 != 0 && equipesTemp.length != 1) {
        for (let i = equipesTemp.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [equipesTemp[i], equipesTemp[j]] = [equipesTemp[j], equipesTemp[i]];
        }
    }
    if (equipesTemp.length % 2 != 0 && equipesTemp.length != 1) {
        var novaEquipePreenchimento = {
            nome: null,
            imagem: "",
            botao: undefined
        };
        equipesTemp.push(novaEquipePreenchimento);
    }
    for (let i = 0; i < equipesTemp.length; i += 2) {
        var novaChave = {
            equipe1: equipesTemp[i],
            equipe2: equipesTemp[i + 1],
            vencedor: undefined,
        };
        chavesTemp.push(novaChave);
    }
    var novaRodada = {
        chaves: [...chavesTemp],
        winners: []
    };
    rodadasRepescagem.push(novaRodada);
    carregarChavesRepescagem();
    carregarChaves();
}
function carregarChavesRepescagem() {
    var chaveDiv = document.getElementById("repescagem");
    chaveDiv.innerHTML = "";
    for (let r = 0; r < rodadasRepescagem.length; r++) {
        var mainDiv = document.createElement("div");
        mainDiv.classList.add("rodada")
        for (let c = 0; c < rodadasRepescagem[r].chaves.length; c++) {
            let chave = rodadasRepescagem[r].chaves[c];
            var duplaDiv = document.createElement("div");
            duplaDiv.classList.add("dupla");
            if (rodadasRepescagem[rodadasRepescagem.length - 1].chaves[0].equipe2 != undefined) {
                if (r == rodadasRepescagem.length - 1 && rodadas.length == 1) {
                    let desfazer = document.createElement('div')
                    desfazer.classList = 'desfazer'
                    var desfazerButton = document.createElement("i");
                    desfazerButton.classList = 'bi bi-arrow-counterclockwise'
                    desfazerButton.setAttribute('title', 'Desfazer')
                    desfazerButton.onclick = criarBotaoDesfazerHandler(chave);
                    desfazer.appendChild(desfazerButton)
                    duplaDiv.appendChild(desfazer)
                }
            }
            carregarElementosChaves(duplaDiv, chave);
            mainDiv.appendChild(duplaDiv);
        }
        chaveDiv.appendChild(mainDiv);
    }
}
function voltarChaves() {
    if (rodadas.length == 1 && rodadasRepescagem.length == 0) {
        alert("Não é possivel retroceder na primeira chave");
    } else if (rodadas.length > 0) {
        if (confirm("Tem certeza que deseja retroceder a chave atual? \n(Essa ação apagará qualquer vencedor na chave atual\n(Se retrocedido na primeira rodada ou se houver equipe de descanso as equipes serão sorteadas denovo quando as chaves forem avançadas)")) {
            if (rodadas.length == 2 && rodadasRepescagem[rodadasRepescagem.length - 1].chaves[0].equipe2 == undefined) {
                rodadas.pop();
                rodadasRepescagem.pop();
                carregarChaves();
                carregarChavesRepescagem();
            } else if (rodadas.length == 1 && rodadasRepescagem[rodadasRepescagem.length - 1].chaves[0].equipe2 != undefined) {
                rodadasRepescagem.pop();
                carregarChavesRepescagem();
            } else {
                rodadas.pop();
                carregarChaves();
            }
            carregarChaves();
        }
    } else {
        alert("É necessario ter chaves geradas antes de retrocede-las");
    }
}
function carregarElementosChaves(duplaDiv, chave) {
    var equipe1Imagem = document.createElement("img");
    equipe1Imagem.src = chave.equipe1.imagem;
    var equipe1Nome = document.createElement("p");
    equipe1Nome.textContent = chave.equipe1.nome;
    var equipe1MainContainer = document.createElement("div");
    equipe1MainContainer.classList = 'equipe1'
    var equipe1Botao = document.createElement("i");
    equipe1Botao.classList = 'bi bi-arrow-right-circle'
    equipe1Botao.onclick = criarBotaoAvancarHandler(chave, true);
    chave.equipe1Botao = equipe1Botao;
    if (chave.equipe1.imagem) {
        equipe1MainContainer.appendChild(equipe1Imagem);
    }
    equipe1MainContainer.appendChild(equipe1Nome);
    equipe1MainContainer.appendChild(equipe1Botao);
    duplaDiv.appendChild(equipe1MainContainer);
    if (chave.equipe2 && chave.equipe2.nome !== null) {
        var equipe2Imagem = document.createElement("img");
        equipe2Imagem.src = chave.equipe2.imagem;
        var equipe2Nome = document.createElement("p");
        equipe2Nome.textContent = chave.equipe2.nome;
        var equipe2MainContainer = document.createElement("div");
        equipe2MainContainer.classList = 'equipe2'
        var equipe2Botao = document.createElement("i");
        equipe2Botao.classList = 'bi bi-arrow-right-circle'
        equipe2Botao.onclick = criarBotaoAvancarHandler(chave, false);
        chave.equipe2Botao = equipe2Botao;
        if (chave.equipe2.imagem) {
            equipe2MainContainer.appendChild(equipe2Imagem);
        }
        equipe2MainContainer.appendChild(equipe2Nome);
        equipe2MainContainer.appendChild(equipe2Botao);
        duplaDiv.appendChild(equipe2MainContainer);
    } else {
        if (!chave.vencedor) {
            if (chave.equipe1.nome === null) {
                chave.vencedor = chave.equipe2;
            } else {
                chave.vencedor = chave.equipe1;
            }
        }
        equipe1Botao.onclick = null;
        equipe1Botao.style.opacity = '0';
        equipe1Botao.style.cursor = 'default';
    }
    if (chave.vencedor) {
        if (chave.vencedor == chave.equipe1) {
            if (chave.equipe2 && chave.equipe2.nome !== null) {
                equipe1Botao.classList = 'bi bi-arrow-right-circle-fill'
                equipe1Botao.style.display = 'block';
                const equipe2Imagem = duplaDiv.querySelector('.equipe2 img');
                const equipe2Botao = duplaDiv.querySelector('.equipe2 i');
                const equipe2MainContainer = duplaDiv.querySelector('.equipe2');
                if (equipe2Imagem) {
                    equipe2Imagem.style.filter = "grayscale(100%)"
                }
                equipe2Botao.style.opacity = '0'
                equipe2Botao.style.cursor = 'default';
                equipe2MainContainer.style.backgroundColor = '#24272a';
            }
        } else if (chave.vencedor == chave.equipe2) {
            if (chave.equipe1.nome !== null) {
                const equipe1Imagem = duplaDiv.querySelector('.equipe1 img');
                const equipe1Botao = duplaDiv.querySelector('.equipe1 i');
                const equipe1MainContainer = duplaDiv.querySelector('.equipe1');
                if (equipe1Imagem) {
                    equipe1Imagem.style.filter = "grayscale(100%)"
                }
                equipe1Botao.style.opacity = '0'
                equipe1Botao.style.cursor = 'default';
                equipe1MainContainer.style.backgroundColor = '#24272a';
            }
            const equipe2Botao = duplaDiv.querySelector('.equipe2 i');
            equipe2Botao.classList = 'bi bi-arrow-right-circle-fill'
            equipe2Botao.style.display = 'block'
        }
        equipe1Botao.onclick = null;
        if (chave.equipe2 && chave.equipe2.nome !== null) {
            const equipe2Botao = duplaDiv.querySelector('.equipe2 i');
            equipe2Botao.onclick = null;
        }
    }
}
function verificarEAvancarRodada() {
    if (rodadas.length > 0) {
        let rodadaAtual = rodadas[rodadas.length - 1];
        if (rodadaAtual.chaves.every(chave => chave.vencedor)) {
            if (rodadas.length === 1) {
                if (rodadasRepescagem.length === 0) {
                    criarChavesRepescagem();
                } else if (rodadasRepescagem[rodadasRepescagem.length - 1].chaves[0].equipe2 === undefined) {
                    criarChaves();
                } else if (rodadasRepescagem[rodadasRepescagem.length - 1].chaves.every(chave => chave.vencedor)) {
                    criarChavesRepescagem();
                    if (rodadasRepescagem[rodadasRepescagem.length - 1].chaves[0].equipe2 === undefined) {
                        criarChaves();
                    }
                }
            } else {
                criarChaves();
            }
        }
    }
    if (rodadasRepescagem.length > 0) {
        let rodadaRepescagemAtual = rodadasRepescagem[rodadasRepescagem.length - 1];
        if (rodadaRepescagemAtual.chaves.every(chave => chave.vencedor)) {
            if (rodadas.length === 1 && rodadaRepescagemAtual.chaves[0].equipe2 !== undefined) {
                criarChavesRepescagem();
                if (rodadasRepescagem[rodadasRepescagem.length - 1].chaves[0].equipe2 === undefined) {
                    criarChaves();
                }
            }
        }
    }
}
carregarEquipes();