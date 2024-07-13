const capaJogo = document.getElementById("capaJogo");
const logoJogo = document.getElementById("logoJogo");
const backgroundJogo = document.getElementById("backgroundJogo");

const colarCapa = document.getElementById("colarCapa");
const colarLogo = document.getElementById("colarLogo");
const colarBackground = document.getElementById("colarBackground");

function colarImagem(targetElement, minWidth, minHeight, maxWidth, maxHeight) {
    navigator.clipboard.read().then((clipboardItems) => {
        for (const item of clipboardItems) {
            if (item.types.includes("image/png") || item.types.includes("image/jpeg")) {
                item.getType("image/png").then((blob) => {
                    const reader = new FileReader();
                    reader.onload = function (event) {
                        const dataURL = event.target.result;
                        const img = new Image();
                        img.src = dataURL;
                        img.style.minWidth = minWidth;
                        img.style.minHeight = minHeight;
                        img.style.maxWidth = maxWidth;
                        img.style.maxHeight = maxHeight;
                        img.draggable = false;
                        img.id = "draggableImage";
                        img.style.position = "absolute";
                        targetElement.innerHTML = "";
                        targetElement.appendChild(img);
                        nomeFoto.focus();
                        const gradientOverlay = document.getElementById("gradientOverlay");
                        imagemArrastavel(img);

                        if (targetElement === capaJogo) {
                            capaJogo.style.backgroundColor = '#000';
                        }
                        if (targetElement === backgroundJogo) {
                            gradientOverlay.style.display = "block";
                            jogo.style.backgroundColor = "#202020"
                        }
                    };
                    reader.readAsDataURL(blob);
                });
                break;
            }
        }
    }).catch((error) => {
        console.error("Failed to read clipboard contents: ", error);
    });
}

colarCapa.addEventListener("click", () => {
    colarImagem(capaJogo, "auto", "480px", "auto", "480px");
});
colarLogo.addEventListener("click", () => {
    colarImagem(logoJogo, "150px", "auto", "150px", "auto");
});
colarBackground.addEventListener("click", () => {
    colarImagem(backgroundJogo, "auto", "480px", "auto", "480px");
});

function imagemArrastavel(img) {
    let isDragging = false;
    let initialX, initialY;
    let offsetX, offsetY;

    img.addEventListener('mousedown', (event) => {
        isDragging = true;
        initialX = event.clientX;
        initialY = event.clientY;
        offsetX = img.offsetLeft;
        offsetY = img.offsetTop;
        img.style.zIndex = 1000;

        document.addEventListener('mousemove', onMouseMove);
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            img.style.zIndex = 2;
            document.removeEventListener('mousemove', onMouseMove);
        }
    });

    function onMouseMove(event) {
        if (isDragging) {
            const currentX = event.clientX;
            const currentY = event.clientY;
            const dx = currentX - initialX;
            const dy = currentY - initialY;
            img.style.left = (offsetX + dx) + 'px';
            img.style.left = (offsetX + dx) + 'px';
            img.style.top = (offsetY + dy) + 'px';

        }
    }
}

const imgElements = [
    document.getElementById("logoJogo"),
    document.getElementById("capaJogo"),
    document.getElementById("backgroundJogo"),
];

const scaleImages = [1, 1, 1];

function setTransformImg(el, index) {
    if (index === 1) {
        el.style.transform = `scale(${scaleImages[index]}) skewX(6deg)`;
    } else {
        el.style.transform = `scale(${scaleImages[index]})`;
    }
}

imgElements.forEach((img, index) => {
    img.onwheel = function (e) {
        e.preventDefault();
        let delta = (e.wheelDelta ? e.wheelDelta : -e.deltaY);
        delta > 0 ? (scaleImages[index] *= 1.05) : (scaleImages[index] /= 1.05);
        setTransformImg(img.firstChild, index);
    };
});

const jogo = document.getElementById("jogo");
const nomeFoto = document.getElementById("nomeFoto");
const botaoConverterParaPNG = document.getElementById("converterParaPNG");
botaoConverterParaPNG.addEventListener("click", salvarComoPNG);

function salvarComoPNG() {
    const nomeArquivo = nomeFoto.value.trim() || "Imagem";
    const jogo = document.getElementById("jogo");
    const jogoHeight = jogo.offsetHeight; // Captura a altura atual do elemento #jogo

    domtoimage.toBlob(jogo, {
        width: jogo.offsetWidth,
        height: jogoHeight, // Utiliza a altura atual do elemento #jogo
        style: {
            transform: "scale(1)", // Manter a escala padrão
            left: 0, // Posição à esquerda do elemento
            top: 0 // Posição superior do elemento
        }
    })
        .then(blob => {
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `${nomeArquivo}.png`;
            link.click();
        })
        .catch(error => {
            console.error("Erro ao salvar como PNG: ", error);
        });
}


nomeFoto.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        salvarComoPNG();
    }
});