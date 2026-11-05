import { InformesTemplate } from "../components/templates/InformesTemplate";
import { useMovimientosStore } from "../store/MovimientosStore";
import {
  useCategoriasUsuario,
  useMovimientosRango,
  useUsuarioFinanzas,
} from "../hooks/useFinanzas";
import { rangoMes } from "../utils/finanzas";

export function Informes() {
  const { anio, mes, mesAnterior, mesSiguiente, irAHoy } = useMovimientosStore();
  const { moneda } = useUsuarioFinanzas();
  const { desde, hasta } = rangoMes(anio, mes);
  const { data: movimientos = [], isLoading, error } = useMovimientosRango(desde, hasta);
  const { data: categorias = [] } = useCategoriasUsuario();

  return (
    <InformesTemplate
      anio={anio}
      mes={mes}
      onAnterior={mesAnterior}
      onSiguiente={mesSiguiente}
      onHoy={irAHoy}
      movimientos={movimientos}
      categorias={categorias}
      cargando={isLoading}
      error={error}
      moneda={moneda}
    />
  );
}
