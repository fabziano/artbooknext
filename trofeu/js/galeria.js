class Card {
    constructor(data, index) {
        this.data = data;
        this.index = index;
    }

    render() {
        const cardLink = document.createElement('a');
        cardLink.className = 'card-link';
        cardLink.href = `trofeu.html?id=${this.index}`;
        const card = document.createElement('div');
        card.className = 'card';
        const cardImageWrapper = document.createElement('div');
        cardImageWrapper.className = 'card-image';
        const cardImage = document.createElement('img');
        cardImage.src = this.data.foto_thumb || 'https://via.placeholder.com/300x300.png?text=Sem+Foto';
        cardImageWrapper.appendChild(cardImage);
        const cardDetails = document.createElement('div');
        cardDetails.className = 'card-details';
        const posicao = document.createElement('p');
        posicao.className = 'posicao-destaque';
        posicao.textContent = this.data.posicao;
        const nomeTorneio = document.createElement('p');
        nomeTorneio.textContent = this.data.nome_torneio;
        const classe = document.createElement('p');
        classe.textContent = `Classe: ${this.data.classe}`;
        const local = document.createElement('p');
        local.textContent = this.data.local;
        cardDetails.appendChild(posicao);
        cardDetails.appendChild(nomeTorneio);
        cardDetails.appendChild(classe);
        cardDetails.appendChild(local);
        card.appendChild(cardImageWrapper);
        card.appendChild(cardDetails);
        cardLink.appendChild(card);
        return cardLink;
    }
}

class Galeria {
    constructor(containerId, titleId, dataUrl) {
        this.container = document.getElementById(containerId);
        this.title = document.getElementById(titleId);
        this.dataUrl = dataUrl;
    }

    async carregarDados() {
        try {
            const response = await fetch(this.dataUrl);
            if (!response.ok) {
                throw new Error('Erro ao carregar o arquivo JSON.');
            }
            const jsonData = await response.json();
            this.renderizar(jsonData);
        } catch (error) {
            console.error(error);
        }
    }

    renderizar(jsonData) {
        if (jsonData.length > 0) {
            this.title.textContent = jsonData[0].nome_tenista;
        }
        jsonData.forEach((item, index) => {
            const card = new Card(item, index);
            this.container.appendChild(card.render());
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const galeriaApp = new Galeria('cards-container', 'tenista-titulo', 'data.json');
    galeriaApp.carregarDados();
});