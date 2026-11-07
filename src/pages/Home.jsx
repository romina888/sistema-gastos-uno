import { HomeTemplate } from "../components/templates/HomeTemplate";
import {
  useAccionesMovimientos,
  useCategoriasUsuario,
  useMovimientosRango,
  useUltimosMovimientos,
  useUsuarioFinanzas,
} from "../hooks/useFinanzas";
import { usePresupuestosUsuario } from "../hooks/usePresupuestos";
import { rangoMes } from "../utils/finanzas";

export function Home() {
  const { moneda } = useUsuarioFinanzas();
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mesActual = hoy.getMonth();
  const { desde, hasta } = rangoMes(anio, mesActual);
  // Mes anterior, para comparar (si es enero, es diciembre del año pasado).
  const anterior = rangoMes(mesActual === 0 ? anio - 1 : anio, (mesActual + 11) % 12);

  const mes = useMovimientosRango(desde, hasta);
  const mesPasado = useMovimientosRango(anterior.desde, anterior.hasta);
  const ultimos = useUltimosMovimientos(4);
  const { data: categorias = [] } = useCategoriasUsuario();
  const { data: presupuestos = [] } = usePresupuestosUsuario();
  const { guardar } = useAccionesMovimientos();

  return (
    <HomeTemplate
      movimientosMes={mes.data ?? []}
      movimientosMesAnterior={mesPasado.data ?? []}
      ultimos={ultimos.data ?? []}
      categorias={categorias}
      presupuestos={presupuestos}
      cargando={mes.isLoading || mesPasado.isLoading || ultimos.isLoading}
      error={mes.error || mesPasado.error || ultimos.error}
      moneda={moneda}
      guardar={guardar}
    />
  );
}
