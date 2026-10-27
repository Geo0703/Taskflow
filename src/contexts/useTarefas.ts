import { useContext } from "react";
import { TarefasContext } from "./tarefasContextStore";

export function useTarefas() {
  const contexto = useContext(TarefasContext);

  if (!contexto) {
    throw new Error("useTarefas deve ser utilizado dentro de TarefasProvider.");
  }

  return contexto;
}
