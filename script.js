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
const statusControle = document.querySelector('#status-controle');
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
let controlesBloqueados = false;

imagemBtComecar.setAttribute('src', './imagens/play_arrow.png');
musica.loop = true;

function atualizarEstadosDeInteracao() {
  const estaRodando = intervaloId !== null;

  focoBt.disabled = controlesBloqueados;
  curtoBt.disabled = controlesBloqueados;
  longoBt.disabled = controlesBloqueados;
  botaoMusica.disabled = controlesBloqueados;

  if (estaRodando) {
    statusControle.textContent = 'Timer ativo: controles bloqueados';
  } else if (controlesBloqueados) {
    statusControle.textContent = 'Timer pausado: reinicie para trocar o tempo';
  } else {
    statusControle.textContent = 'Pronto para começar';
  }

  statusControle.classList.toggle('is-running', estaRodando);
  statusControle.classList.toggle(
    'is-paused',
    !estaRodando && controlesBloqueados,
  );
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
  controlesBloqueados = false;
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
  if (controlesBloqueados) return;

  contextoAtual = 'foco';
  tempoDecorridoEmSegundos = temposPorContexto[contextoAtual];
  alteraContexto('foco');
  atualizarBotoesAtivos(contextoAtual);
});

curtoBt.addEventListener('click', () => {
  if (controlesBloqueados) return;

  contextoAtual = 'descanso-curto';
  tempoDecorridoEmSegundos = temposPorContexto[contextoAtual];
  alteraContexto('descanso-curto');
  atualizarBotoesAtivos(contextoAtual);
});

longoBt.addEventListener('click', () => {
  if (controlesBloqueados) return;

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
    const focoAtivo = html.getAttribute('data-contexto') === 'foco';
    if (focoAtivo) {
      const evento = new CustomEvent('focoFinalizado', {
        detail: { contexto: 'foco' },
      });
      document.dispatchEvent(evento);
    }
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
  controlesBloqueados = true;
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
