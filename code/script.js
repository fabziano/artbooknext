import { obterCodigoGerado } from './gerar.js';

async function validarCodigo(codigoInputado, obterCodigoGerado) {
    if (obterCodigoGerado === null) {
        return false;
    }
    return codigoInputado === obterCodigoGerado;
}
const input = document.querySelector('input');
const button = document.querySelector('button');
const p = document.querySelector('p');

button.addEventListener('click', async () => {
    const codigoDigitado = input.value;
    const isValido = await validarCodigo(codigoDigitado, obterCodigoGerado);
    if (isValido) {
        p.textContent = 'Válido';
    } else {
        p.textContent = 'Inválido';
    }
});

input.addEventListener('input', (event) => {
    event.target.value = event.target.value.replace(/\D/g, '');
    p.textContent = '';
});