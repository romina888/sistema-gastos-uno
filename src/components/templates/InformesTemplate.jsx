import styled from "styled-components";
import { useMemo, useState } from "react";
import { v } from "../../styles/variables";
import { Header } from "../organismos/Header";
import { Segmentado } from "../moleculas/Segmentado";
import { SelectorPeriodo } from "../moleculas/SelectorPeriodo";
import { TarjetaResumen } from "../moleculas/TarjetaResumen";
import { ContenedorPagina } from "../atomos/ContenedorPagina";
import {
  GraficoBarras,
  GraficoDona,
  GraficoLinea,
} from "../organismos/graficos/Graficos";
import {
  MESES,
  agruparPorCategoria,
  esConfirmado,
  formatearMonto,
  resumen,
  serieDiaria,
} from "../../utils/finanzas";

const PESTANIAS = [
  { valor: "dona", texto: "Por categoría", icono: <v.iconopie /> },
  { valor: "linea", texto: "Evolución", icono: <v.iconolineal /> },
  { valor: "barras", texto: "Por día", icono: <v.iconobars /> },
];

const TIPOS = [
  { valor: "g", texto: "Gastos", color: v.colorGastos },
  { valor: "i", texto: "Ingresos", color: v.colorIngresos },
];

export function InformesTemplate({
  anio,
  mes,
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
  const [pestania, setPestania] = useState("dona");
  const [tipo, setTipo] = useState("g");

  // Los informes cuentan solo los movimientos confirmados (no los pendientes).
  const movimientos = useMemo(() => todos.filter(esConfirmado), [todos]);

  const { ingresos, gastos, balance } = resumen(movimientos);
  const porCategoria = useMemo(
    () => agruparPorCategoria(movimientos, tipo, categorias),
    [movimientos, tipo, categorias]
  );
  const diaria = useMemo(
    () => serieDiaria(movimientos, anio, mes),
    [movimientos, anio, mes]
  );

  const sinDatos = movimientos.length === 0;

  return (
    <ContenedorPagina onClick={() => setStateUser(false)}>
      <header className="cabecera">
        <Header
          stateConfig={{ state: stateUser, setState: () => setStateUser(!stateUser) }}
        />
      </header>

      <div className="titulo">
        <h1>Informes</h1>
        <p>Mirá en qué se va tu plata y cómo evoluciona durante el mes.</p>
      </div>

      <div className="barra">
        <SelectorPeriodo
          etiqueta={`${MESES[mes]} ${anio}`}
          onAnterior={onAnterior}
          onSiguiente={onSiguiente}
          onHoy={onHoy}
          textoHoy="Mes actual"
        />
      </div>

      <section className="tarjetas">
        <TarjetaResumen
          titulo="Ingresos"
          valor={formatearMonto(ingresos, moneda)}
          color={v.colorIngresos}
        />
        <TarjetaResumen
          titulo="Gastos"
          valor={formatearMonto(gastos, moneda)}
          color={v.colorGastos}
        />
        <TarjetaResumen
          titulo="Balance"
          valor={formatearMonto(balance, moneda)}
          color={balance >= 0 ? v.colorIngresos : v.colorGastos}
        />
      </section>

      <div className="barra">
        <Segmentado opciones={PESTANIAS} valor={pestania} onChange={setPestania} />
        {pestania === "dona" && (
          <Segmentado opciones={TIPOS} valor={tipo} onChange={setTipo} />
        )}
      </div>

      <section className="panel">
        {error ? (
          <p className="error">
            No se pudieron cargar los datos: {error.message}. Revisá que ya exista la
            tabla <b>movimientos</b> en Supabase (script <b>docs/movimientos.sql</b>).
          </p>
        ) : cargando ? (
          <p className="vacio">Cargando informe...</p>
        ) : sinDatos ? (
          <p className="vacio">
            No hay movimientos en {MESES[mes].toLowerCase()} de {anio}. Cargá algunos en
            la sección Movimientos para ver tus informes.
          </p>
        ) : pestania === "dona" ? (
          porCategoria.length === 0 ? (
            <p className="vacio">
              No hay {tipo === "g" ? "gastos" : "ingresos"} en este mes.
            </p>
          ) : (
            <Distribucion>
              <GraficoDona datos={porCategoria} moneda={moneda} />
              <ul className="detalle">
                {porCategoria.map((c) => (
                  <li key={c.id}>
                    <div className="fila">
                      <span className="nombre">
                        <i style={{ background: c.color }} />
                        {c.icono} {c.descripcion}
                      </span>
                      <strong>{formatearMonto(c.valor, moneda)}</strong>
                    </div>
                    <div className="barra-porcentaje">
                      <div
                        style={{ width: `${c.porcentaje}%`, background: c.color }}
                      />
                    </div>
                    <small>{c.porcentaje.toFixed(1).replace(".", ",")} %</small>
                  </li>
                ))}
              </ul>
            </Distribucion>
          )
        ) : pestania === "linea" ? (
          <>
            <h2>Balance acumulado día a día</h2>
            <GraficoLinea
              etiquetas={diaria.dias}
              valores={diaria.balanceAcumulado}
              moneda={moneda}
            />
          </>
        ) : (
          <>
            <h2>Ingresos y gastos por día</h2>
            <GraficoBarras
              etiquetas={diaria.dias}
              ingresos={diaria.ingresos}
              gastos={diaria.gastos}
              moneda={moneda}
            />
          </>
        )}
      </section>
    </ContenedorPagina>
  );
}

const Distribucion = styled.div`
  display: grid;
  gap: 24px;
  align-items: center;

  .detalle {
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

  .nombre {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;

    i {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      flex-shrink: 0;
    }
  }

  .barra-porcentaje {
    height: 8px;
    margin: 6px 0 2px;
    border-radius: 999px;
    background: ${({ theme }) => theme.bg4};
    overflow: hidden;

    div {
      height: 100%;
      border-radius: 999px;
    }
  }

  small {
    color: ${({ theme }) => theme.colorSubtitle};
  }

  @media (min-width: ${v.bpbart}) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }
`;
