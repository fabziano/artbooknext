class GerenciadorDOM {
    constructor() {
        this.areaPrincipal = document.querySelector("main");
        this.imagemContainer = document.querySelector(".imagem");
        this.botaoAplicarGrid = document.getElementById("aplicarGrid");
        this.botaoColarImagem = document.getElementById("colarImagem");
        this.botaoBaixarPNG = document.getElementById("baixarImagem");
    }
}

class Arrastavel {
    constructor(elemento) {
        this.elemento = elemento;
        this.isDragging = false;
        this.initialX = 0;
        this.initialY = 0;
        this.offsetX = 0;
        this.offsetY = 0;
        this.setupListeners();
    }

    onMouseDown(event) {
        this.isDragging = true;
        this.initialX = event.clientX;
        this.initialY = event.clientY;
        this.offsetX = this.elemento.offsetLeft;
        this.offsetY = this.elemento.offsetTop;
        this.elemento.style.zIndex = 1000;
        document.addEventListener('mousemove', this.onMouseMoveBound);
    }

    onMouseUp() {
        if (this.isDragging) {
            this.isDragging = false;
            this.elemento.style.zIndex = 2;
            document.removeEventListener('mousemove', this.onMouseMoveBound);
        }
    }

    onMouseMove(event) {
        if (this.isDragging) {
            const currentX = event.clientX;
            const currentY = event.clientY;
            const dx = currentX - this.initialX;
            const dy = currentY - this.initialY;
            this.elemento.style.left = (this.offsetX + dx) + 'px';
            this.elemento.style.top = (this.offsetY + dy) + 'px';
        }
    }

    setupListeners() {
        this.onMouseMoveBound = this.onMouseMove.bind(this);
        this.elemento.addEventListener('mousedown', this.onMouseDown.bind(this));
        document.addEventListener('mouseup', this.onMouseUp.bind(this));
    }
}

class ManipuladorImagem {
    constructor(imagemContainer) {
        this.imagemContainer = imagemContainer;
        this.scaleImagem = 1;
        this.minWidth = "auto";
        this.minHeight = "480px";
        this.maxWidth = "auto";
        this.maxHeight = "480px";
        this.setupZoom();
    }

    colarImagem() {
        navigator.clipboard.read().then((clipboardItems) => {
            for (const item of clipboardItems) {
                if (item.types.includes("image/png") || item.types.includes("image/jpeg")) {
                    item.getType("image/png").then((blob) => {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            const dataURL = event.target.result;
                            const imgElemento = new Image();
                            imgElemento.src = dataURL;
                            imgElemento.style.minWidth = this.minWidth;
                            imgElemento.style.minHeight = this.minHeight;
                            imgElemento.style.maxWidth = this.maxWidth;
                            imgElemento.style.maxHeight = this.maxHeight;
                            imgElemento.draggable = false;
                            imgElemento.id = "draggableImage";
                            imgElemento.style.position = "absolute";
                            this.imagemContainer.innerHTML = "";
                            this.imagemContainer.appendChild(imgElemento);
                            new Arrastavel(imgElemento);
                        };
                        reader.readAsDataURL(blob);
                    });
                    break;
                }
            }
        }).catch((error) => {
            console.error("Falha ao colar imagem: ", error);
        });
    }

    setTransformImg(el) {
        el.style.transform = `scale(${this.scaleImagem})`;
    }

    handleZoom(e) {
        e.preventDefault();
        const imgElemento = this.imagemContainer.firstChild;
        if (imgElemento && imgElemento.tagName === 'IMG') {
            let delta = (e.wheelDelta ? e.wheelDelta : -e.deltaY);
            delta > 0 ? (this.scaleImagem *= 1.05) : (this.scaleImagem /= 1.05);
            this.setTransformImg(imgElemento);
        }
    }

    setupZoom() {
        this.imagemContainer.onwheel = this.handleZoom.bind(this);
    }
}

class GerenciadorGrid {
    constructor(areaPrincipal) {
        this.areaPrincipal = areaPrincipal;
        this.gridPresente = false;
    }

    adicionarGrid() {
        if (!this.gridPresente) {
            const gridOverlay = document.createElement('div');
            gridOverlay.classList.add('grid');
            gridOverlay.style.display = "block";
            this.areaPrincipal.appendChild(gridOverlay);
            this.gridPresente = true;
        } else {
            const gridOverlay = this.areaPrincipal.querySelector('.grid');
            if (gridOverlay) {
                gridOverlay.remove();
            }
            this.gridPresente = false;
        }
    }
}

class ExportadorPNG {
    constructor(areaPrincipal) {
        this.areaPrincipal = areaPrincipal;
    }

    salvarComoPNG() {
        const rect = this.areaPrincipal.getBoundingClientRect();
        
        const outlineOriginal = this.areaPrincipal.style.outline;
        
        this.areaPrincipal.style.outline = 'none';

        domtoimage.toBlob(this.areaPrincipal, {
            width: rect.width,
            height: rect.height,
            left: rect.left,
            top: rect.top
        })
        .then(blob => {
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'imagem.png';
            link.click();
        })
        .catch(error => {
            console.error("Erro ao salvar como PNG: ", error);
        })
        .finally(() => {
            this.areaPrincipal.style.outline = outlineOriginal;
        });
    }
}

class App {
    constructor() {
        this.dom = new GerenciadorDOM();
        this.manipuladorImagem = new ManipuladorImagem(this.dom.imagemContainer);
        this.gerenciadorGrid = new GerenciadorGrid(this.dom.areaPrincipal);
        this.exportadorPNG = new ExportadorPNG(this.dom.areaPrincipal);
        this.setupEventos();
    }

    setupEventos() {
        this.dom.botaoColarImagem.addEventListener("click", () => this.manipuladorImagem.colarImagem());
        this.dom.botaoBaixarPNG.addEventListener("click", () => this.exportadorPNG.salvarComoPNG());

        this.dom.botaoAplicarGrid.addEventListener("click", (event) => {
            event.preventDefault();
            this.gerenciadorGrid.adicionarGrid();
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});