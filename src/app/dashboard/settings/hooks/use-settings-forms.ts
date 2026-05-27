import { useExpedienteForm } from "./use-expediente-form";
import { useServicosForm } from "./use-servicos-form";
import { useVisualForm } from "./use-visual-form";

/**
 * Hook de composição que instancia os três formulários de settings
 * e expõe o estado de erro consolidado para a página.
 */
export function useSettingsForms() {
  const expedienteForm = useExpedienteForm();
  const servicosForm = useServicosForm();
  const visualForm = useVisualForm();

  const errorMsg =
    expedienteForm.errorMsg || servicosForm.errorMsg || visualForm.errorMsg;

  return {
    expedienteForm,
    servicosForm,
    visualForm,
    errorMsg,
  };
}
