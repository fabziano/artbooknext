import { codigoGerado } from './gerar.js';

async function validarCodigo(codigoInputado, codigoGerado) {
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
    const isValido = await validarCodigo(codigoDigitado, codigoGerado);
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