import { useState } from "react";
import { X } from "lucide-react";
import { useTarefas } from "../../contexts/useTarefas";
import type { Tarefa } from "../../types/Tarefa";
import { TaskForm } from "../TaskForm/TaskForm";
import "./TaskModal.css";

type NovaTarefa = Omit<Tarefa, "_id">;

type TaskModalProps = {
  aberto: boolean;
  tarefa?: Tarefa;
  aoFechar: () => void;
};

export function TaskModal({ aberto, tarefa, aoFechar }: Readonly<TaskModalProps>) {
  const { adicionarTarefa, atualizarTarefa } = useTarefas();
  const [salvando, setSalvando] = useState(false);

  if (!aberto) {
    return null;
  }

  async function salvarTarefa(novaTarefa: NovaTarefa) {
    setSalvando(true);
    try {
      if (tarefa) {
        if (!tarefa._id) {
          throw new Error("Não é possível editar uma tarefa sem identificador.");
        }
        await atualizarTarefa(tarefa._id, novaTarefa);
      } else {
        await adicionarTarefa(novaTarefa);
      }
      aoFechar();
    } finally {
      setSalvando(false);
    }
  }

  const tarefaInicial: NovaTarefa | undefined = tarefa
    ? {
        titulo: tarefa.titulo,
        descricao: tarefa.descricao,
        data: tarefa.data,
        prioridade: tarefa.prioridade,
        projeto: tarefa.projeto,
        concluida: tarefa.concluida,
      }
    : undefined;

  return (
    <div className="task-modal">
      <div
        className="task-modal__content"
        role="dialog"
        aria-modal="true"
        aria-label={tarefa ? "Editar tarefa" : "Nova tarefa"}
      >
        <button
          className="task-modal__close"
          type="button"
          aria-label="Fechar"
          onClick={aoFechar}
          disabled={salvando}
        >
          <X size={20} />
        </button>
        <TaskForm
          key={tarefa?._id ?? "nova"}
          tarefaInicial={tarefaInicial}
          modoEdicao={Boolean(tarefa)}
          salvando={salvando}
          aoSalvar={salvarTarefa}
          aoCancelar={aoFechar}
        />
      </div>
    </div>
  );
}
