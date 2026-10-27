import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { alterarTarefa, criarTarefa, excluirTarefa, listarTarefas } from "../services/tarefaService";
import type { Tarefa } from "../types/Tarefa";
import { TarefasContext } from "./tarefasContextStore";

type NovaTarefa = Omit<Tarefa, "_id">;

type TarefasProviderProps = {
  children: ReactNode;
};

export function TarefasProvider({ children }: Readonly<TarefasProviderProps>) {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarTarefas() {
      try {
        setErro("");
        setTarefas(await listarTarefas());
      } catch {
        setErro("Não foi possível carregar as tarefas.");
      } finally {
        setCarregando(false);
      }
    }

    void carregarTarefas();
  }, []);

  async function adicionarTarefa(novaTarefa: NovaTarefa) {
    try {
      setErro("");
      const tarefaCriada = await criarTarefa(novaTarefa);
      setTarefas((tarefasAtuais) => [tarefaCriada, ...tarefasAtuais]);
    } catch (erroOperacao) {
      setErro("Não foi possível criar a tarefa.");
      throw erroOperacao;
    }
  }

  async function atualizarTarefa(id: string, tarefa: NovaTarefa) {
    try {
      setErro("");
      const tarefaAtualizada = await alterarTarefa(id, tarefa);
      setTarefas((tarefasAtuais) =>
        tarefasAtuais.map((tarefaAtual) => (tarefaAtual._id === id ? tarefaAtualizada : tarefaAtual)),
      );
    } catch (erroOperacao) {
      setErro("Não foi possível atualizar a tarefa.");
      throw erroOperacao;
    }
  }

  async function alternarConclusao(tarefa: Tarefa) {
    if (!tarefa._id) {
      setErro("Não é possível alterar uma tarefa sem identificador.");
      return;
    }

    const { _id, ...dadosTarefa } = tarefa;

    try {
      await atualizarTarefa(_id, { ...dadosTarefa, concluida: !tarefa.concluida });
    } catch {
      // atualizarTarefa já registra a mensagem de erro compartilhada.
    }
  }

  async function removerTarefa(id: string) {
    try {
      setErro("");
      await excluirTarefa(id);
      setTarefas((tarefasAtuais) => tarefasAtuais.filter((tarefa) => tarefa._id !== id));
    } catch {
      setErro("Não foi possível excluir a tarefa.");
    }
  }

  return (
    <TarefasContext.Provider
      value={{ tarefas, carregando, erro, adicionarTarefa, atualizarTarefa, alternarConclusao, removerTarefa }}
    >
      {children}
    </TarefasContext.Provider>
  );
}
