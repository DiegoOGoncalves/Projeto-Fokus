const btnAdicionarTarefa = document.querySelector('.app__button--add-task');
const inputTarefa = document.querySelector('.app__form-add-task');
const textAreaTarefa = document.querySelector('.app__form-textarea');
const ulTarefas = document.querySelector('.app__section-task-list');
const tarefaEmAndamento = document.querySelector(
  '.app__section-active-task-description',
);

const botaoSalvarTarefa = document.querySelector(
  '.app__form-footer__button--confirm',
);

const botaoDeletarTarefa = document.querySelector(
  '.app__form-footer__button--delete',
);

const btnCancelar = document.querySelector('.app__form-footer__button--cancel');
const btnRemoverConcluidas = document.querySelector('#btn-remover-concluidas');
const btnRemoverTodas = document.querySelector('#btn-remover-todas');

const tarefasSalvas = JSON.parse(localStorage.getItem('tarefas')) || [];
const tarefas = tarefasSalvas.map((tarefa) => {
  if (typeof tarefa === 'string') {
    return {
      id: crypto.randomUUID(),
      descricao: tarefa,
      completa: false,
    };
  }

  return {
    id: tarefa.id ?? crypto.randomUUID(),
    descricao: tarefa.descricao ?? '',
    completa: Boolean(tarefa.completa),
  };
});

let tarefaEditando = null;
let idTarefaAtiva = null;

function atualizarTextoBotaoSalvar(texto) {
  botaoSalvarTarefa.innerHTML = `
    <img src="./imagens/save.png" alt="" /> ${texto}
  `;
}

function atualizarBotaoDeletar(visivel) {
  botaoDeletarTarefa.disabled = !visivel;
}

function salvarTarefas() {
  localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function obterTarefaPorId(id) {
  return tarefas.find((tarefa) => tarefa.id === id) || null;
}

function criarElementoTarefa(tarefa, indice) {
  const li = document.createElement('li');
  li.classList.add('app__section-task-list-item');
  li.dataset.id = tarefa.id;
  li.innerHTML = `
    <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
      <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
    </svg>

    <p class="app__section-task-list-item-description">${tarefa.descricao}</p>

    <button class="app_button-edit" type="button" aria-label="Editar tarefa">
      <img src="./imagens/edit.png" alt="" />
    </button>
  `;

  if (tarefa.completa) {
    li.classList.add('app__section-task-list-item-complete');
    li.querySelector('.app_button-edit').disabled = true;
  }

  if (tarefa.id === idTarefaAtiva && !tarefa.completa) {
    li.classList.add('app__section-task-list-item-active');
  }

  return li;
}

function renderizarTarefas() {
  ulTarefas.innerHTML = '';

  tarefas.forEach((tarefa, indice) => {
    const elementoTarefa = criarElementoTarefa(tarefa, indice);

    ulTarefas.append(elementoTarefa);
  });
}

function atualizarTarefaEmAndamento(id) {
  const tarefaSelecionada = obterTarefaPorId(id);

  if (!tarefaSelecionada || tarefaSelecionada.completa) {
    idTarefaAtiva = null;
    tarefaEmAndamento.textContent = '';
    renderizarTarefas();
    return;
  }

  idTarefaAtiva = idTarefaAtiva === id ? null : id;
  tarefaEmAndamento.textContent = idTarefaAtiva ? tarefaSelecionada.descricao : '';
  renderizarTarefas();
}

function abrirFormulario(tarefa = null, indice = null) {
  tarefaEditando = indice;
  textAreaTarefa.value = tarefa ? tarefa.descricao : '';
  inputTarefa.classList.remove('hidden');
  inputTarefa.setAttribute('aria-hidden', 'false');
  textAreaTarefa.focus();
  inputTarefa.scrollIntoView({ behavior: 'smooth', block: 'start' });
  atualizarTextoBotaoSalvar(tarefa ? 'Salvar alterações' : 'Salvar');
  atualizarBotaoDeletar(Boolean(tarefa));
}

function fecharFormulario() {
  tarefaEditando = null;
  textAreaTarefa.value = '';
  inputTarefa.classList.add('hidden');
  inputTarefa.setAttribute('aria-hidden', 'true');
  atualizarTextoBotaoSalvar('Salvar');
  atualizarBotaoDeletar(false);
}

btnAdicionarTarefa.addEventListener('click', () => {
  abrirFormulario();
});

inputTarefa.addEventListener('submit', (evento) => {
  evento.preventDefault(); // previne o envio do formulário, comportamento padrão do submit
  const textoTarefa = textAreaTarefa.value.trim();

  if (!textoTarefa) {
    return;
  }

  const tarefa = {
    descricao: textoTarefa,
  };

  if (tarefaEditando === null) {
    tarefas.push({
      id: crypto.randomUUID(),
      ...tarefa,
      completa: false,
    });
  } else {
    tarefas[tarefaEditando] = {
      ...tarefas[tarefaEditando],
      ...tarefa,
    };
  }

  salvarTarefas();
  const tarefaAtualizada = tarefas[tarefaEditando ?? tarefas.length - 1];
  fecharFormulario();

  if (tarefaAtualizada && tarefaAtualizada.id === idTarefaAtiva) {
    tarefaEmAndamento.textContent = tarefaAtualizada.descricao;
  }

  renderizarTarefas();
});

botaoDeletarTarefa.addEventListener('click', () => {
  if (tarefaEditando === null) {
    fecharFormulario();
    return;
  }

  const tarefaParaRemover = tarefas[tarefaEditando];
  tarefas.splice(tarefaEditando, 1);

  if (tarefaParaRemover?.id === idTarefaAtiva) {
    idTarefaAtiva = null;
    tarefaEmAndamento.textContent = '';
  }

  salvarTarefas();
  fecharFormulario();
  renderizarTarefas();
});

btnCancelar.addEventListener('click', fecharFormulario);

btnRemoverConcluidas.addEventListener('click', () => {
  for (let indice = tarefas.length - 1; indice >= 0; indice -= 1) {
    if (tarefas[indice].completa) {
      if (tarefas[indice].id === idTarefaAtiva) {
        idTarefaAtiva = null;
        tarefaEmAndamento.textContent = '';
      }

      tarefas.splice(indice, 1);
    }
  }

  salvarTarefas();
  renderizarTarefas();
});

btnRemoverTodas.addEventListener('click', () => {
  tarefas.length = 0;
  idTarefaAtiva = null;
  tarefaEmAndamento.textContent = '';
  salvarTarefas();
  renderizarTarefas();
});

ulTarefas.addEventListener('click', (evento) => {
  const botaoEditar = evento.target.closest('.app_button-edit');
  const iconStatus = evento.target.closest('.app__section-task-icon-status');

  if (iconStatus) {
    const itemTarefa = iconStatus.closest('.app__section-task-list-item');
    const tarefaSelecionada = obterTarefaPorId(itemTarefa.dataset.id);

    if (!tarefaSelecionada) {
      return;
    }

    tarefaSelecionada.completa = !tarefaSelecionada.completa;

    if (tarefaSelecionada.completa && tarefaSelecionada.id === idTarefaAtiva) {
      idTarefaAtiva = null;
      tarefaEmAndamento.textContent = '';
    }

    salvarTarefas();
    renderizarTarefas();
    return;
  }

  if (!botaoEditar) {
    const itemTarefa = evento.target.closest('.app__section-task-list-item');

    if (!itemTarefa) {
      return;
    }

    const tarefaSelecionada = obterTarefaPorId(itemTarefa.dataset.id);

    if (!tarefaSelecionada || tarefaSelecionada.completa) {
      return;
    }

    atualizarTarefaEmAndamento(tarefaSelecionada.id);
    return;
  }

  const itemTarefa = botaoEditar.closest('.app__section-task-list-item');
  const tarefaSelecionada = obterTarefaPorId(itemTarefa.dataset.id);

  if (!tarefaSelecionada || tarefaSelecionada.completa) {
    return;
  }

  abrirFormulario(tarefaSelecionada, tarefas.findIndex((tarefa) => tarefa.id === tarefaSelecionada.id));
});

document.addEventListener('focoFinalizado', () => {
  const tarefaAtiva = obterTarefaPorId(idTarefaAtiva);

  if (!tarefaAtiva) {
    return;
  }

  tarefaAtiva.completa = true;
  idTarefaAtiva = null;
  tarefaEmAndamento.textContent = '';
  salvarTarefas();
  renderizarTarefas();
});

atualizarTextoBotaoSalvar('Salvar');
atualizarBotaoDeletar(false);
renderizarTarefas();
