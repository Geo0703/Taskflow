import axios from "axios";
import { useState } from "react";
import type { Prioridade, Tarefa } from "../../types/Tarefa";
import "./TaskForm.css";
type NovaTarefa = Omit<Tarefa, "_id">;
type TaskFormProps = {
  tarefaInicial?: NovaTarefa;
  modoEdicao: boolean;
  salvando: boolean;
  aoSalvar: (tarefa: NovaTarefa) => Promise<void>;
  aoCancelar: () => void;
};
const estadoVazio: NovaTarefa = {
  titulo: "",
  descricao: "",
  data: "",
  prioridade: "medium",
  projeto: "",
  concluida: false,
};
export function TaskForm({
  tarefaInicial,
  modoEdicao,
  salvando,
  aoSalvar,
  aoCancelar,
}: Readonly<TaskFormProps>) {
  const [formulario, setFormulario] = useState<NovaTarefa>(tarefaInicial ?? estadoVazio);
  const [erroSalvamento, setErroSalvamento] = useState("");

  function alterarCampo(campo: keyof NovaTarefa, valor: string | boolean) {
    setFormulario((estadoAtual) => ({
      ...estadoAtual,
      [campo]: valor,
    }));
  }
  async function enviarFormulario(evento: React.FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErroSalvamento("");
    try {
      await aoSalvar(formulario);
    } catch (erro) {
      if (axios.isAxiosError(erro)) {
        if (!erro.response) {
          setErroSalvamento(
            "A API não respondeu. Verifique sua conexão, a URL configurada e se o serviço permite requisições do navegador (CORS).",
          );
        } else if (erro.response.status === 404) {
          setErroSalvamento(
            "A API retornou 404. Confira se o endereço configurado ainda está ativo e se o recurso /tarefas existe.",
          );
        } else {
          setErroSalvamento(`A API recusou o salvamento (HTTP ${erro.response.status}). Tente novamente.`);
        }
      } else {
        setErroSalvamento("Ocorreu um erro inesperado ao salvar a tarefa. Tente novamente.");
      }
    }
  }

  return (
    <form className="task-form" onSubmit={enviarFormulario}>
      <h2>{modoEdicao ? "Editar tarefa" : "Nova tarefa"}</h2>
      {erroSalvamento && (
        <p className="task-form__error" role="alert">
          {erroSalvamento}
        </p>
      )}
      <label>
        <span>Título</span>
        <input
          required
          maxLength={100}
          value={formulario.titulo}
          onChange={(evento) => alterarCampo("titulo", evento.target.value)}
          placeholder="Ex.: Revisar proposta comercial"
        />
      </label>
      <label>
        <span>Descrição</span>
        <textarea
          rows={3}
          maxLength={400}
          value={formulario.descricao}
          onChange={(evento) => alterarCampo("descricao", evento.target.value)}
          placeholder="Adicione contexto ou observações"
        />
      </label>
      <label>
        <span>Prazo</span>
        <input type="date" value={formulario.data} onChange={(evento) => alterarCampo("data", evento.target.value)} />
      </label>
      <label>
        <span>Prioridade</span>
        <select
          value={formulario.prioridade}
          onChange={(evento) => alterarCampo("prioridade", evento.target.value as Prioridade)}
        >
          <option value="high">Alta</option>
          <option value="medium">Média</option>
          <option value="low">Baixa</option>
        </select>
      </label>
      <label>
        <span>Projeto</span>
        <input
          value={formulario.projeto}
          onChange={(evento) => alterarCampo("projeto", evento.target.value)}
          placeholder="Ex.: Projeto Atlas"
        />
      </label>
      <div className="task-form__actions">
        <button type="button" onClick={aoCancelar} disabled={salvando}>
          Cancelar
        </button>
        <button type="submit" disabled={salvando}>
          {salvando ? "Salvando..." : modoEdicao ? "Salvar alterações" : "Criar tarefa"}
        </button>
      </div>
    </form>
  );
}
