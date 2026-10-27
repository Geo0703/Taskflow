import { useOutletContext } from "react-router-dom";
import type { LayoutContext } from "../../components/Layout/Layout";
import { TaskList } from "../../components/TaskList/TaskList";
import { useTarefas } from "../../contexts/useTarefas";
import type { Tarefa } from "../../types/Tarefa";
import "./Tasks.css";

type VisaoTarefas = "tarefas" | "hoje" | "proximas" | "concluidas";

type TasksProps = {
  visao: VisaoTarefas;
};

const informacoesVisao: Record<VisaoTarefas, { titulo: string; descricao: string; eyebrow: string }> = {
  tarefas: {
    titulo: "Todas as tarefas",
    descricao: "Visualização completa das tarefas cadastradas.",
    eyebrow: "VISÃO GERAL",
  },
  hoje: {
    titulo: "Hoje",
    descricao: "Concentre-se no que precisa avançar agora.",
    eyebrow: "FOCO DO DIA",
  },
  proximas: {
    titulo: "Próximas",
    descricao: "Tarefas previstas para os próximos dias.",
    eyebrow: "PLANEJAMENTO",
  },
  concluidas: {
    titulo: "Concluídas",
    descricao: "Tarefas que já foram finalizadas.",
    eyebrow: "HISTÓRICO",
  },
};

function obterDataAtual() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

function filtrarTarefas(tarefas: Tarefa[], visao: VisaoTarefas) {
  const hoje = obterDataAtual();

  switch (visao) {
    case "tarefas":
      return tarefas.filter((tarefa) => !tarefa.concluida);
    case "hoje":
      return tarefas.filter((tarefa) => !tarefa.concluida && tarefa.data === hoje);
    case "proximas":
      return tarefas.filter((tarefa) => !tarefa.concluida && tarefa.data > hoje);
    case "concluidas":
      return tarefas.filter((tarefa) => tarefa.concluida);
  }
}

export function Tasks({ visao }: Readonly<TasksProps>) {
  const { abrirTaskModal, editarTarefa } = useOutletContext<LayoutContext>();
  const { tarefas, carregando, erro, removerTarefa, alternarConclusao } = useTarefas();
  const informacao = informacoesVisao[visao];
  const tarefasVisiveis = filtrarTarefas(tarefas, visao);

  return (
    <section className="tasks-page">
      <div className="tasks-page__heading">
        <div>
          <p className="page-eyebrow">{informacao.eyebrow}</p>
          <h1>{informacao.titulo}</h1>
          <p>{informacao.descricao}</p>
        </div>
        <button type="button" onClick={abrirTaskModal}>
          Nova tarefa
        </button>
      </div>
      {erro && <p className="tasks-page__error">{erro}</p>}
      {carregando ? (
        <p>Carregando tarefas...</p>
      ) : (
        <TaskList
          tarefas={tarefasVisiveis}
          aoExcluir={(id) => void removerTarefa(id)}
          aoEditar={editarTarefa}
          aoAlternarConclusao={(tarefa) => void alternarConclusao(tarefa)}
        />
      )}
    </section>
  );
}
