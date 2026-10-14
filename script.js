const StatusTarefa = {
    PENDENTE: 'PENDENTE',
    EM_ANDAMENTO: 'EM_ANDAMENTO',
    CONCLUIDA: 'CONCLUIDA'
};

class Tarefa {
    constructor(id, titulo, descricao, prazo) {
        if (!titulo || titulo.trim() === "") {
            throw new Error("O título é obrigatório."); 
        }
        this.id = id;
        this.titulo = titulo;
        this.descricao = descricao;
        this.dataCriacao = new Date();
        this.prazo = prazo;
        this.status = StatusTarefa.PENDENTE; 
    }

    concluir() {
        this.status = StatusTarefa.CONCLUIDA; 
    }
}

class GerenciadorTarefas {
    constructor() {
        this.tarefas = [];
        this.contadorId = 1;
        this.filtroAtual = 'TODAS';
        this.iniciarEventos();
    }

    iniciarEventos() {
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            document.getElementById('login-screen').style.display = 'none';
            document.getElementById('task-screen').style.display = 'block';
            this.renderizarTarefas();
        });

        document.getElementById('btn-logout').addEventListener('click', () => {
            document.getElementById('task-screen').style.display = 'none';
            document.getElementById('login-screen').style.display = 'block';
        });

        document.getElementById('task-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const titulo = document.getElementById('task-titulo').value;
            const descricao = document.getElementById('task-descricao').value;
            const prazo = document.getElementById('task-prazo').value;

            try {
                const novaTarefa = new Tarefa(this.contadorId++, titulo, descricao, prazo);
                this.tarefas.push(novaTarefa);
                document.getElementById('task-form').reset();
                this.renderizarTarefas();
            } catch (erro) {
                alert(erro.message);
            }
        });
    }

    filtrarTarefas(status) {
        this.filtroAtual = status;
        this.renderizarTarefas(); 
    }

    concluirTarefa(id) {
        const tarefa = this.tarefas.find(t => t.id === id);
        if (tarefa) {
            tarefa.concluir(); 
            this.renderizarTarefas();
        }
    }

    excluirTarefa(id) {
        this.tarefas = this.tarefas.filter(t => t.id !== id); 
        this.renderizarTarefas();
    }

    renderizarTarefas() {
        const lista = document.getElementById('task-list');
        lista.innerHTML = '';

        const tarefasFiltradas = this.filtroAtual === 'TODAS' 
            ? this.tarefas 
            : this.tarefas.filter(t => t.status === this.filtroAtual);

        tarefasFiltradas.forEach(tarefa => {
            const li = document.createElement('li');
            li.className = `task-item ${tarefa.status}`;
            
            li.innerHTML = `
                <div>
                    <strong>${tarefa.titulo}</strong> <br>
                    <small>${tarefa.descricao} | Prazo: ${tarefa.prazo || 'Sem prazo'}</small>
                </div>
                <div class="task-actions">
                    ${tarefa.status !== StatusTarefa.CONCLUIDA ? 
                        `<button class="btn-concluir" onclick="app.concluirTarefa(${tarefa.id})">✔</button>` : ''}
                    <button class="btn-excluir" onclick="app.excluirTarefa(${tarefa.id})">✖</button>
                </div>
            `;
            lista.appendChild(li);
        });
    }
}

const app = new GerenciadorTarefas();