class Trofeu {
    constructor(containerId, dataUrl) {
        this.container = document.getElementById(containerId);
        this.dataUrl = dataUrl;
    }

    async carregarTrofeu() {
        const params = new URLSearchParams(window.location.search);
        const itemId = params.get('id');
        if (itemId === null) {
            this.renderizarErro('Troféu não encontrado.');
            return;
        }
        try {
            const response = await fetch(this.dataUrl);
            if (!response.ok) {
                throw new Error('Erro ao carregar o arquivo JSON.');
            }
            const jsonData = await response.json();
            const item = jsonData[itemId];
            if (!item) {
                this.renderizarErro('Troféu não encontrado.');
                return;
            }
            this.renderizarTrofeu(item);
        } catch (error) {
            console.error(error);
            this.renderizarErro('Ocorreu um erro ao carregar os dados.');
        }
    }

    renderizarTrofeu(item) {
        this.container.innerHTML = `
            <h1>${item.nome_torneio}</h1>
            <img src="${item.foto_full || 'https://via.placeholder.com/900x900.png?text=Sem+Foto+Full'}" alt="Foto completa do troféu">
            <div class="trofeu-info">
                <p class="posicao-destaque"><strong>${item.posicao}</strong></p>
                <p><strong>Tenista:</strong> ${item.nome_tenista}</p>
                <p><strong>Classe:</strong> ${item.classe}</p>
                <p><strong>Local:</strong> ${item.local}</p>
            </div>
            <a href="index.html" class="back-button">Galeria de ${item.nome_tenista}</a>
        `;
    }

    renderizarErro(message) {
        this.container.innerHTML = `<h1>${message}</h1><a href="index.html" class="back-button">Voltar para a Galeria</a>`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const trofeuApp = new Trofeu('trofeu-container', 'data.json');
    trofeuApp.carregarTrofeu();
});