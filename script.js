const html = document.querySelector('html');
const focoBt = document.querySelector('.app__card-button--foco');
const curtoBt = document.querySelector('.app__card-button--curto');
const longoBt = document.querySelector('.app__card-button--longo');
const banner = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title');
const startPauseBt = document.querySelector('#start-pause');
const musicaFocoInput = document.querySelector('#alternar-musica');
const iniciarOuPausarBt = document.querySelector('#start-pause span');
const imagemBtComecar = document.querySelector('.app__card-primary-butto-icon');
const tempoNaTela = document.querySelector('#timer');
const botaoMusica = document.querySelector('.toggle-checkbox');
const resetBt = document.querySelector('#reset');

const musica = new Audio('./sons/luna-rise-part-one.mp3');
const audioPlay = new Audio('./sons/play.wav');
const audioPause = new Audio('./sons/pause.mp3');
const audioTimeFinish = new Audio('./sons/beep.mp3');

const temposPorContexto = {
  foco: 1500,
  'descanso-curto': 300,
  'descanso-longo': 900,
};

let contextoAtual = 'foco';
let tempoDecorridoEmSegundos = temposPorContexto[contextoAtual];
let intervaloId = null;

imagemBtComecar.setAttribute('src', './imagens/play_arrow.png');
musica.loop = true;

function atualizarEstadosDeInteracao() {
  const estaRodando = intervaloId !== null;

  focoBt.disabled = estaRodando;
  curtoBt.disabled = estaRodando;
  longoBt.disabled = estaRodando;
  botaoMusica.disabled = estaRodando;
}

function atualizarBotoesAtivos(contexto) {
  focoBt.classList.toggle('active', contexto === 'foco');
  curtoBt.classList.toggle('active', contexto === 'descanso-curto');
  longoBt.classList.toggle('active', contexto === 'descanso-longo');
}

function pararTimer(textoBotao) {
  clearInterval(intervaloId);
  intervaloId = null;
  iniciarOuPausarBt.textContent = textoBotao;
  imagemBtComecar.setAttribute('src', './imagens/play_arrow.png');
  atualizarEstadosDeInteracao();
}

function reiniciarTimer() {
  pararTimer('Começar');
}

function pararMusica() {
  musica.pause();
  musicaFocoInput.checked = false;
}
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
  if (intervaloId) return;

  contextoAtual = 'foco';
  tempoDecorridoEmSegundos = temposPorContexto[contextoAtual];
  alteraContexto('foco');
  atualizarBotoesAtivos(contextoAtual);
});

curtoBt.addEventListener('click', () => {
  if (intervaloId) return;

  contextoAtual = 'descanso-curto';
  tempoDecorridoEmSegundos = temposPorContexto[contextoAtual];
  alteraContexto('descanso-curto');
  atualizarBotoesAtivos(contextoAtual);
});

longoBt.addEventListener('click', () => {
  if (intervaloId) return;

  contextoAtual = 'descanso-longo';
  tempoDecorridoEmSegundos = temposPorContexto[contextoAtual];
  alteraContexto('descanso-longo');
  atualizarBotoesAtivos(contextoAtual);
});

resetBt.addEventListener('click', () => {
  tempoDecorridoEmSegundos = temposPorContexto[contextoAtual];
  reiniciarTimer();
  pararMusica();
  atualizarTempoNaTela();
});
//alterando os textos da página e a imagem de acordo com o contexto via função

function alteraContexto(contexto) {
  atualizarTempoNaTela();
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

const contagemRegressiva = () => {
  if (tempoDecorridoEmSegundos <= 0) {
    audioTimeFinish.play();
    alert('Tempo Finalizado!');
    pararMusica();
    reiniciarTimer();
    return;
  }
  tempoDecorridoEmSegundos--;
  atualizarTempoNaTela();
};

startPauseBt.addEventListener('click', iniciarOuPausar);

function iniciarOuPausar() {
  if (intervaloId) {
    audioPause.play();
    pararTimer('Retomar');
    return;
  }
  if (!musica.paused) {
    pararMusica();
  }
  audioPlay.play();
  intervaloId = setInterval(contagemRegressiva, 1000);
  iniciarOuPausarBt.textContent = 'Pausar';
  imagemBtComecar.setAttribute('src', './imagens/pause.png');
  atualizarEstadosDeInteracao();
}

function atualizarTempoNaTela() {
  const tempo = new Date(tempoDecorridoEmSegundos * 1000);
  const tempoFormatado = tempo.toLocaleTimeString('pt-BR', {
    minute: '2-digit',
    second: '2-digit',
  });
  tempoNaTela.innerHTML = `${tempoFormatado}`;
}

atualizarBotoesAtivos(contextoAtual);
atualizarEstadosDeInteracao();
atualizarTempoNaTela();
