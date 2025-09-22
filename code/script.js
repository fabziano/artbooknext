async function timestamp() {
  const api = 'http://www.horalegalbrasil.mct.on.br/RelogioServidor.php';
  const url = `https://corsproxy.io/?${encodeURIComponent(api)}`;
  try {

    const response = await fetch(url);
    const html = await response.text();

    const conteudo = document.getElementById('id');
    conteudo.innerHTML = html;

  } catch (e) {
    console.error(e);
  }
}
timestamp();

