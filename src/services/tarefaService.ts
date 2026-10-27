import axios from "axios";
import type { Tarefa } from "../types/Tarefa";

const baseURL = import.meta.env.DEV ? "/crudcrud-api" : import.meta.env.VITE_API_URL;
const api = axios.create({ baseURL });
const RECURSO = "/tarefas";

export async function listarTarefas() {
  const resposta = await api.get<Tarefa[]>(RECURSO);
  return resposta.data;
}

export async function criarTarefa(tarefa: Omit<Tarefa, "_id">) {
  const resposta = await api.post<Tarefa>(RECURSO, tarefa);
  return resposta.data;
}

export async function alterarTarefa(id: string, tarefa: Omit<Tarefa, "_id">) {
  await api.put(`${RECURSO}/${id}`, tarefa);
  return { ...tarefa, _id: id };
}

export async function excluirTarefa(id: string) {
  await api.delete(`${RECURSO}/${id}`);
}
