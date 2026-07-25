const btnAdicionarTarefa = document.querySelector('.app__button--add-task');
const inputTarefa = document.querySelector('.app__form-add-task');
const textAreaTarefa = document.querySelector('.app__form-textarea');
const ulTarefas = document.querySelector('.app__section-task-list');
const botaoSalvarTarefa = document.querySelector(
  '.app__form-footer__button--confirm',
);

const btnCancelar = document.querySelector('.app__form-footer__button--cancel');

const limparFormulario = () => {
  textAreaTarefa.value = ''; // Limpe o conteúdo do textarea
  inputTarefa.classList.add('hidden'); // Adicione a classe 'hidden' ao formulário para escondê-lo
};

btnCancelar.addEventListener('click', limparFormulario);

const tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
let tarefaEditando = null;

function atualizarTextoBotaoSalvar(texto) {
  botaoSalvarTarefa.innerHTML = `
    <img src="./imagens/save.png" alt="" /> ${texto}
  `;
}

function criarElementoTarefa(tarefa, indice) {
  const li = document.createElement('li');
  li.classList.add('app__section-task-list-item');
  li.dataset.indice = indice;
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

  return li;
}

function renderizarTarefas() {
  ulTarefas.innerHTML = '';

  tarefas.forEach((tarefa, indice) => {
    const elementoTarefa = criarElementoTarefa(tarefa, indice);
    ulTarefas.append(elementoTarefa);
  });
}

function abrirFormulario(tarefa = null, indice = null) {
  tarefaEditando = indice;
  textAreaTarefa.value = tarefa ? tarefa.descricao : '';
  inputTarefa.classList.remove('hidden');
  inputTarefa.setAttribute('aria-hidden', 'false');
  textAreaTarefa.focus();
  inputTarefa.scrollIntoView({ behavior: 'smooth', block: 'start' });
  atualizarTextoBotaoSalvar(tarefa ? 'Salvar alterações' : 'Salvar');
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
    tarefas.push(tarefa);
  } else {
    tarefas[tarefaEditando] = tarefa;
  }

  localStorage.setItem('tarefas', JSON.stringify(tarefas)); //localStorage salva as tarefas no navegador, para que não se percam ao atualizar a página
  textAreaTarefa.value = ''; // limpa o campo de texto após adicionar a tarefa
  inputTarefa.classList.add('hidden'); // esconde o formulário após adicionar a tarefa
  inputTarefa.setAttribute('aria-hidden', 'true');
  tarefaEditando = null;
  atualizarTextoBotaoSalvar('Salvar');
  renderizarTarefas();
});

ulTarefas.addEventListener('click', (evento) => {
  const botaoEditar = evento.target.closest('.app_button-edit');

  if (!botaoEditar) {
    return;
  }

  const itemTarefa = botaoEditar.closest('.app__section-task-list-item');
  const indice = Number(itemTarefa.dataset.indice);

  abrirFormulario(tarefas[indice], indice);
});

atualizarTextoBotaoSalvar('Salvar');
renderizarTarefas();
