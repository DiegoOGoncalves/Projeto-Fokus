const btnAdicionarTarefa = document.querySelector('.app__button--add-task');
const inputTarefa = document.querySelector('.app__form-add-task');
const textAreaTarefa = document.querySelector('.app__form-textarea');

const tarefas = [];

btnAdicionarTarefa.addEventListener('click', () => {
  inputTarefa.classList.toggle('hidden');
});

inputTarefa.addEventListener('submit', (evento) => {
  evento.preventDefault(); // previne o envio do formulário, comportamento padrão do submit
  const tarefa = {
    descricao: textAreaTarefa.value,
  };
  tarefas.push(tarefa);
  localStorage.setItem('tarefas', JSON.stringify(tarefas)); //localStorage salva as tarefas no navegador, para que não se percam ao atualizar a página
});
