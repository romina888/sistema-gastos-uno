import styled from "styled-components";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v } from "../../styles/variables";
import { Header } from "../organismos/Header";
import { Btnsave } from "../moleculas/Btnsave";
import { SelectorPeriodo } from "../moleculas/SelectorPeriodo";
import { TarjetaResumen } from "../moleculas/TarjetaResumen";
import { ContenedorPagina } from "../atomos/ContenedorPagina";
import { GraficoBarras } from "../organismos/graficos/Graficos";
import {
  MESES,
  agruparPorCategoria,
  esConfirmado,
  formatearFecha,
  formatearMonto,
  resumen,
  serieMensual,
} from "../../utils/finanzas";

export function DashboardTemplate({
  anio,
  onAnterior,
  onSiguiente,
  onHoy,
  movimientos: todos,
  categorias,
  cargando,
  error,
  moneda,
}) {
  const [stateUser, setStateUser] = useState(false);
  const navigate = useNavigate();

  // Solo se cuentan los movimientos confirmados (no los pendientes).
  const movimientos = useMemo(() => todos.filter(esConfirmado), [todos]);

  const { ingresos, gastos, balance } = resumen(movimientos);
  const mensual = useMemo(() => serieMensual(movimientos), [movimientos]);
  const topGastos = useMemo(
    () => agruparPorCategoria(movimientos, "g", categorias).slice(0, 5),
    [movimientos, categorias]
  );
  const categoriaPorId = useMemo(
    () => new Map(categorias.map((c) => [c.id, c])),
    [categorias]
  );
  const ultimos = movimientos.slice(0, 5); // ya vienen ordenados del más nuevo al más viejo

  // Para el promedio mensual: si es el año en curso, contamos hasta el mes actual.
  const ahora = new Date();
  const mesesTranscurridos = anio === ahora.getFullYear() ? ahora.getMonth() + 1 : 12;
  const promedioGasto = gastos / mesesTranscurridos;
  const ahorro = ingresos > 0 ? (balance / ingresos) * 100 : null;

  return (
    <ContenedorPagina onClick={() => setStateUser(false)}>
      <header className="cabecera">
        <Header
          stateConfig={{ state: stateUser, setState: () => setStateUser(!stateUser) }}
        />
      </header>

      <div className="titulo">
        <h1>Dashboard</h1>
        <p>Un resumen de todo el año para ver cómo venís.</p>
      </div>

      <div className="barra">
        <SelectorPeriodo
          etiqueta={String(anio)}
          onAnterior={onAnterior}
          onSiguiente={onSiguiente}
          onHoy={onHoy}
          textoHoy="Año actual"
        />
      </div>

      {error ? (
        <p className="error">
          No se pudieron cargar los datos: {error.message}. Revisá que ya exista la
          tabla <b>movimientos</b> en Supabase (script <b>docs/movimientos.sql</b>).
        </p>
      ) : cargando ? (
        <p className="vacio">Cargando dashboard...</p>
      ) : movimientos.length === 0 ? (
        <section className="panel">
          <p className="vacio">No hay movimientos en {anio}.</p>
          <Centrado>
            <Btnsave
              funcion={() => navigate("/movimientos")}
              titulo="Ir a Movimientos"
              icono={<v.iconomovimientos />}
              bgcolor="#DAC1FF"
            />
          </Centrado>
        </section>
      ) : (
        <>
          <section className="tarjetas">
            <TarjetaResumen
              titulo={`Ingresos de ${anio}`}
              valor={formatearMonto(ingresos, moneda)}
              color={v.colorIngresos}
            />
            <TarjetaResumen
              titulo={`Gastos de ${anio}`}
              valor={formatearMonto(gastos, moneda)}
              color={v.colorGastos}
            />
            <TarjetaResumen
              titulo="Balance"
              valor={formatearMonto(balance, moneda)}
              color={balance >= 0 ? v.colorIngresos : v.colorGastos}
              detalle={
                ahorro === null
                  ? undefined
                  : `Ahorraste el ${ahorro.toFixed(1).replace(".", ",")} % de tus ingresos`
              }
            />
            <TarjetaResumen
              titulo="Gasto promedio por mes"
              valor={formatearMonto(promedioGasto, moneda)}
            />
          </section>

          <section className="panel">
            <h2>Ingresos y gastos mes a mes</h2>
            <GraficoBarras
              etiquetas={MESES.map((m) => m.slice(0, 3))}
              ingresos={mensual.ingresos}
              gastos={mensual.gastos}
              moneda={moneda}
            />
          </section>

          <Doble>
            <section className="panel">
              <h2>En qué gastás más</h2>
              {topGastos.length === 0 ? (
                <p className="vacio">Todavía no registraste gastos este año.</p>
              ) : (
                <ul className="top">
                  {topGastos.map((c) => (
                    <li key={c.id}>
                      <div className="fila">
                        <span>
                          {c.icono} {c.descripcion}
                        </span>
                        <strong>{formatearMonto(c.valor, moneda)}</strong>
                      </div>
                      <div className="barra-porcentaje">
                        <div style={{ width: `${c.porcentaje}%`, background: c.color }} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="panel">
              <h2>Últimos movimientos</h2>
              <ul className="ultimos">
                {ultimos.map((m) => {
                  const cat = categoriaPorId.get(m.idcategoria);
                  const esIngreso = m.tipo === "i";
                  return (
                    <li key={m.id}>
                      <span className="icono">{cat?.icono ?? "❔"}</span>
                      <div className="texto">
                        <strong>{m.descripcion || cat?.descripcion || "Sin descripción"}</strong>
                        <small>{formatearFecha(m.fecha)}</small>
                      </div>
                      <span className={esIngreso ? "ingreso" : "gasto"}>
                        {esIngreso ? "+" : "-"} {formatearMonto(m.valor, moneda)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>
          </Doble>
        </>
      )}
    </ContenedorPagina>
  );
}

const Centrado = styled.div`
  display: flex;
  justify-content: center;
`;

const Doble = styled.div`
  display: grid;
  gap: 18px;

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .fila {
    display: flex;
    justify-content: space-between;
    gap: 12px;
  }

  .barra-porcentaje {
    height: 8px;
    margin-top: 6px;
    border-radius: 999px;
    background: ${({ theme }) => theme.bg4};
    overflow: hidden;

    div {
      height: 100%;
      border-radius: 999px;
    }
  }

  .ultimos li {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .ultimos .icono {
    font-size: 22px;
  }
  .ultimos .texto {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;

    strong {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    small {
      color: ${({ theme }) => theme.colorSubtitle};
    }
  }
  .ingreso {
    color: ${v.colorIngresos};
    font-weight: 700;
    white-space: nowrap;
  }
  .gasto {
    color: ${v.colorGastos};
    font-weight: 700;
    white-space: nowrap;
  }

  @media (min-width: ${v.bpmarge}) {
    grid-template-columns: 1fr 1fr;
  }
`;
