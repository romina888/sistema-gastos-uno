import styled from "styled-components";
import { useEffect, useMemo, useState } from "react";
import { v } from "../../styles/variables";
import { Header } from "../organismos/Header";
import { Btnsave } from "../moleculas/Btnsave";
import { Segmentado } from "../moleculas/Segmentado";
import { SelectorPeriodo } from "../moleculas/SelectorPeriodo";
import { TarjetaResumen } from "../moleculas/TarjetaResumen";
import { ContenedorPagina } from "../atomos/ContenedorPagina";
import { ContentAccionesTabla } from "../organismos/tablas/ContentAccionesTabla";
import { Paginacion } from "../organismos/tablas/Paginacion";
import { RegistrarMovimientos } from "../organismos/formularios/RegistrarMovimientos";
import {
  MESES,
  formatearFecha,
  esConfirmado,
  formatearMonto,
  hoyISO,
  resumen,
} from "../../utils/finanzas";

const POR_PAGINA = 8;

const FILTROS = [
  { valor: "t", texto: "Todos" },
  { valor: "g", texto: "Gastos", color: v.colorGastos },
  { valor: "i", texto: "Ingresos", color: v.colorIngresos },
];

export function MovimientosTemplate({
  anio,
  mes,
  onAnterior,
  onSiguiente,
  onHoy,
  movimientos,
  categorias,
  cargando,
  error,
  moneda,
  idcuenta,
  guardar,
  eliminar,
}) {
  const [stateUser, setStateUser] = useState(false);
  const [filtro, setFiltro] = useState("t");
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const [openRegistro, setOpenRegistro] = useState(false);
  const [accion, setAccion] = useState("Nuevo");
  const [dataSelect, setDataSelect] = useState({});

  const categoriaPorId = useMemo(
    () => new Map(categorias.map((c) => [c.id, c])),
    [categorias]
  );

  const { ingresos, gastos, balance } = resumen(movimientos.filter(esConfirmado));
  const pendientes = movimientos.filter((m) => !esConfirmado(m)).length;

  const visibles = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return movimientos.filter((m) => {
      if (filtro !== "t" && m.tipo !== filtro) return false;
      if (!texto) return true;
      const nombreCategoria = categoriaPorId.get(m.idcategoria)?.descripcion ?? "";
      return `${m.descripcion ?? ""} ${nombreCategoria}`.toLowerCase().includes(texto);
    });
  }, [movimientos, filtro, busqueda, categoriaPorId]);

  const maximo = Math.max(1, Math.ceil(visibles.length / POR_PAGINA));

  useEffect(() => {
    setPagina(1);
  }, [filtro, busqueda, anio, mes]);

  useEffect(() => {
    if (pagina > maximo) setPagina(maximo);
  }, [pagina, maximo]);

  const hoy = hoyISO();
  const hoyEsDelPeriodo = hoy.startsWith(`${anio}-${String(mes + 1).padStart(2, "0")}`);
  const fechaInicial = hoyEsDelPeriodo
    ? hoy
    : `${anio}-${String(mes + 1).padStart(2, "0")}-01`;

  function nuevo() {
    setAccion("Nuevo");
    setDataSelect({});
    setOpenRegistro(true);
  }
  function editar(m) {
    setAccion("Editar");
    setDataSelect(m);
    setOpenRegistro(true);
  }

  const pagActual = visibles.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  return (
    <ContenedorPagina onClick={() => setStateUser(false)}>
      {openRegistro && (
        <RegistrarMovimientos
          key={`${accion}-${dataSelect.id ?? "nuevo"}`}
          accion={accion}
          dataSelect={dataSelect}
          categorias={categorias}
          moneda={moneda}
          fechaInicial={fechaInicial}
          idcuenta={idcuenta}
          guardar={guardar}
          onClose={() => setOpenRegistro(false)}
        />
      )}

      <header className="cabecera">
        <Header
          stateConfig={{ state: stateUser, setState: () => setStateUser(!stateUser) }}
        />
      </header>

      <div className="titulo">
        <h1>Movimientos</h1>
        <p>Registrá tus ingresos y gastos del mes.</p>
      </div>

      <div className="barra">
        <SelectorPeriodo
          etiqueta={`${MESES[mes]} ${anio}`}
          onAnterior={onAnterior}
          onSiguiente={onSiguiente}
          onHoy={onHoy}
          textoHoy="Mes actual"
        />
        <Btnsave
          funcion={nuevo}
          titulo="Nuevo movimiento"
          icono={<v.agregar />}
          bgcolor="#DAC1FF"
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
          titulo="Balance del mes"
          valor={formatearMonto(balance, moneda)}
          color={balance >= 0 ? v.colorIngresos : v.colorGastos}
        />
        {pendientes > 0 && (
          <TarjetaResumen
            titulo="Pendientes"
            valor={String(pendientes)}
            color="#9E9E9E"
            detalle="No se suman a los totales hasta confirmarlos"
          />
        )}
      </section>

      <div className="barra">
        <Segmentado opciones={FILTROS} valor={filtro} onChange={setFiltro} />
        <Buscador
          type="search"
          placeholder="Buscar por descripción o categoría"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <section className="panel">
        {error ? (
          <p className="error">
            No se pudieron cargar los movimientos: {error.message}. Si es la primera
            vez, revisá que se haya ejecutado el script <b>docs/movimientos.sql</b> en
            Supabase.
          </p>
        ) : cargando ? (
          <p className="vacio">Cargando movimientos...</p>
        ) : visibles.length === 0 ? (
          <p className="vacio">
            {movimientos.length === 0
              ? "No hay movimientos en este mes. Tocá “Nuevo movimiento” para agregar el primero."
              : "No hay movimientos que coincidan con el filtro."}
          </p>
        ) : (
          <>
            <Lista>
              {pagActual.map((m) => {
                const cat = categoriaPorId.get(m.idcategoria);
                const esIngreso = m.tipo === "i";
                return (
                  <li key={m.id}>
                    <span
                      className="icono"
                      style={{ background: `${cat?.color ?? "#9E9E9E"}33` }}
                    >
                      {cat?.icono ?? "❔"}
                    </span>
                    <div className="texto">
                      <strong>{m.descripcion || cat?.descripcion || "Sin descripción"}</strong>
                      <small>
                        {cat?.descripcion ?? "Sin categoría"} · {formatearFecha(m.fecha)}
                        {!esConfirmado(m) && <em className="pendiente">Pendiente</em>}
                      </small>
                    </div>
                    <span className={`monto ${esIngreso ? "ingreso" : "gasto"}`}>
                      {esIngreso ? "+" : "-"} {formatearMonto(m.valor, moneda)}
                    </span>
                    <ContentAccionesTabla
                      funcionEditar={() => editar(m)}
                      funcionEliminar={() => eliminar(m)}
                    />
                  </li>
                );
              })}
            </Lista>
            <Paginacion pagina={pagina} setPagina={setPagina} maximo={maximo} />
          </>
        )}
      </section>
    </ContenedorPagina>
  );
}

const Buscador = styled.input`
  flex: 1;
  min-width: 200px;
  max-width: 360px;
  padding: 10px 14px;
  font-size: 15px;
  border: 1px solid ${({ theme }) => theme.bg4};
  border-radius: 999px;
  background: ${({ theme }) => theme.bg2};
  color: ${({ theme }) => theme.text};
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.primary};
  }
`;

const Lista = styled.ul`
  list-style: none;
  margin: 0 0 16px;
  padding: 0;
  display: flex;
  flex-direction: column;

  li {
    display: grid;
    grid-template-columns: 44px 1fr auto;
    grid-template-areas:
      "icono texto monto"
      "icono texto acciones";
    align-items: center;
    column-gap: 12px;
    padding: 12px 4px;
    border-bottom: 1px solid ${({ theme }) => theme.bg4};
  }

  .icono {
    grid-area: icono;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    font-size: 22px;
  }

  .texto {
    grid-area: texto;
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
    .pendiente {
      margin-left: 8px;
      padding: 1px 8px;
      border-radius: 999px;
      font-style: normal;
      font-size: 0.8em;
      background: ${({ theme }) => theme.bg4};
    }
  }

  .monto {
    grid-area: monto;
    justify-self: end;
    font-weight: 700;
    white-space: nowrap;
  }
  .ingreso {
    color: ${v.colorIngresos};
  }
  .gasto {
    color: ${v.colorGastos};
  }

  li > div:last-child {
    grid-area: acciones;
    justify-self: end;
  }

  @media (min-width: ${v.bpbart}) {
    li {
      grid-template-columns: 44px 1fr 180px 100px;
      grid-template-areas: "icono texto monto acciones";
    }
    .monto {
      justify-self: end;
    }
  }
`;
