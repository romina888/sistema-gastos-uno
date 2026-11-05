import { useState } from "react";
import { DashboardTemplate } from "../components/templates/DashboardTemplate";
import {
  useCategoriasUsuario,
  useMovimientosRango,
  useUsuarioFinanzas,
} from "../hooks/useFinanzas";
import { rangoAnio } from "../utils/finanzas";

export function Dashboard() {
  const [anio, setAnio] = useState(new Date().getFullYear());
  const { moneda } = useUsuarioFinanzas();
  const { desde, hasta } = rangoAnio(anio);
  const { data: movimientos = [], isLoading, error } = useMovimientosRango(desde, hasta);
  const { data: categorias = [] } = useCategoriasUsuario();

  return (
    <DashboardTemplate
      anio={anio}
      onAnterior={() => setAnio(anio - 1)}
      onSiguiente={() => setAnio(anio + 1)}
      onHoy={() => setAnio(new Date().getFullYear())}
      movimientos={movimientos}
      categorias={categorias}
      cargando={isLoading}
      error={error}
      moneda={moneda}
    />
  );
}
