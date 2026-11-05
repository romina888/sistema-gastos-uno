import { MovimientosTemplate } from "../components/templates/MovimientosTemplate";
import { useMovimientosStore } from "../store/MovimientosStore";
import {
  useAccionesMovimientos,
  useCategoriasUsuario,
  useCuentasUsuario,
  useMovimientosRango,
  useUsuarioFinanzas,
} from "../hooks/useFinanzas";
import { rangoMes } from "../utils/finanzas";

export function Movimientos() {
  const { anio, mes, mesAnterior, mesSiguiente, irAHoy } = useMovimientosStore();
  const { moneda } = useUsuarioFinanzas();
  const { desde, hasta } = rangoMes(anio, mes);
  const { data: movimientos = [], isLoading, error } = useMovimientosRango(desde, hasta);
  const { data: categorias = [] } = useCategoriasUsuario();
  const { data: cuentas = [] } = useCuentasUsuario();
  const { guardar, eliminar } = useAccionesMovimientos();

  return (
    <MovimientosTemplate
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
      idcuenta={cuentas[0]?.id}
      guardar={guardar}
      eliminar={eliminar}
    />
  );
}
