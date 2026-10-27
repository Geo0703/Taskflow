import { createContext } from "react";
import type { Tarefa } from "../types/Tarefa";

type NovaTarefa = Omit<Tarefa, "_id">;

export type TarefasContextType = {
  tarefas: Tarefa[];
  carregando: boolean;
  erro: string;
  adicionarTarefa: (tarefa: NovaTarefa) => Promise<void>;
  atualizarTarefa: (id: string, tarefa: NovaTarefa) => Promise<void>;
  alternarConclusao: (tarefa: Tarefa) => Promise<void>;
  removerTarefa: (id: string) => Promise<void>;
};

export const TarefasContext = createContext<TarefasContextType | null>(null);
