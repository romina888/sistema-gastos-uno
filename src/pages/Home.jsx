import { HomeTemplate } from "../components/templates/HomeTemplate";
import {
  useCategoriasUsuario,
  useMovimientosRango,
  useUltimosMovimientos,
  useUsuarioFinanzas,
} from "../hooks/useFinanzas";
import { rangoMes } from "../utils/finanzas";

export function Home() {
  const { moneda } = useUsuarioFinanzas();
  const hoy = new Date();
  const { desde, hasta } = rangoMes(hoy.getFullYear(), hoy.getMonth());
  const mes = useMovimientosRango(desde, hasta);
  const ultimos = useUltimosMovimientos(4);
  const { data: categorias = [] } = useCategoriasUsuario();

  return (
    <HomeTemplate
      movimientosMes={mes.data ?? []}
      ultimos={ultimos.data ?? []}
      categorias={categorias}
      cargando={mes.isLoading || ultimos.isLoading}
      error={mes.error || ultimos.error}
      moneda={moneda}
    />
  );
}
