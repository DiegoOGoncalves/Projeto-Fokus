const html = document.querySelector('html');
const focoBt = document.querySelector('.app__card-button--foco');
const curtoBt = document.querySelector('.app__card-button--curto');
const longoBt = document.querySelector('.app__card-button--longo');
const banner = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title');
const musicaFocoInput = document.querySelector('#alternar-musica');
const musica = new Audio('./sons/luna-rise-part-one.mp3');
musica.loop = true;
// adicionando evento de click no input para tocar ou pausar a música
musicaFocoInput.addEventListener('change', () => {
  if (musica.paused) {
    musica.play();
  } else {
    musica.pause();
  }
});

// alterando imagem e contexto do app ao clicar nos botões
focoBt.addEventListener('click', () => {
  alteraContexto('foco');
  focoBt.classList.add('active');
  curtoBt.classList.remove('active');
  longoBt.classList.remove('active');
});

curtoBt.addEventListener('click', () => {
  alteraContexto('descanso-curto');
  focoBt.classList.remove('active');
  curtoBt.classList.add('active');
  longoBt.classList.remove('active');
});

longoBt.addEventListener('click', () => {
  alteraContexto('descanso-longo');
  focoBt.classList.remove('active');
  curtoBt.classList.remove('active');
  longoBt.classList.add('active');
});
//alterando os textos da página e a imagem de acordo com o contexto via função

function alteraContexto(contexto) {
  html.setAttribute('data-contexto', contexto);
  banner.setAttribute('src', `./imagens/${contexto}.png`);
  switch (contexto) {
    case 'foco':
      titulo.innerHTML = `Otimize sua produtividade,<br />
          <strong class="app__title-strong">mergulhe no que importa.</strong>`;
      break;
    case 'descanso-curto':
      titulo.innerHTML = `
        Que tal dar uma respirada? <strong class="app__title-strong">Faça uma pausa curta!</strong>
        `;
      break;
    case 'descanso-longo':
      titulo.innerHTML = `
        Hora de voltar à superfície <strong class="app__title-strong">Faça uma pausa longa!</strong>
        `;
      break;
    default:
      break;
  }
}
