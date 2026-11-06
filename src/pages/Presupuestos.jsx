import { PresupuestosTemplate } from "../components/templates/PresupuestosTemplate";
import { useMovimientosStore } from "../store/MovimientosStore";
import {
  useCategoriasUsuario,
  useMovimientosRango,
  useUsuarioFinanzas,
} from "../hooks/useFinanzas";
import { useAccionesPresupuestos, usePresupuestosUsuario } from "../hooks/usePresupuestos";
import { rangoMes } from "../utils/finanzas";

export function Presupuestos() {
  const { anio, mes, mesAnterior, mesSiguiente, irAHoy } = useMovimientosStore();
  const { moneda } = useUsuarioFinanzas();
  const { desde, hasta } = rangoMes(anio, mes);
  const movs = useMovimientosRango(desde, hasta);
  const cats = useCategoriasUsuario();
  const pres = usePresupuestosUsuario();
  const { guardar, eliminar } = useAccionesPresupuestos();

  return (
    <PresupuestosTemplate
      anio={anio}
      mes={mes}
      onAnterior={mesAnterior}
      onSiguiente={mesSiguiente}
      onHoy={irAHoy}
      movimientos={movs.data ?? []}
      categorias={cats.data ?? []}
      presupuestos={pres.data ?? []}
      cargando={movs.isLoading || cats.isLoading || pres.isLoading}
      error={movs.error || cats.error || pres.error}
      moneda={moneda}
      guardar={guardar}
      eliminar={eliminar}
    />
  );
}
