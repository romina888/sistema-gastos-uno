import styled from "styled-components";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaWallet } from "react-icons/fa";
import { UserAuth } from "../../context/AuthContent";
import { useUsuariosStore } from "../../store/UsuariosStore";
import { v } from "../../styles/variables";
import { Header } from "../organismos/Header";
import { Btnsave } from "../moleculas/Btnsave";
import { Carousel } from "../moleculas/Carousel";
import { TarjetaResumen } from "../moleculas/TarjetaResumen";
import { GraficoDona } from "../organismos/graficos/Graficos";
import {
  ESTADO_CONFIRMADO,
  MESES,
  agruparPorCategoria,
  esConfirmado,
  formatearFecha,
  formatearMonto,
  resumen,
} from "../../utils/finanzas";

const COLOR_AVISO = "#F5A623";
const UMBRAL_AVISO = 80;
const MAX_PENDIENTES = 3;
const MAX_LIMITES = 4;
const MAX_CATEGORIAS = 4;

// Verde hasta el 80 %, amarillo hasta el límite y rojo si se pasó.
function colorSegunUso(porcentaje) {
  if (porcentaje > 100) return v.colorGastos;
  if (porcentaje >= UMBRAL_AVISO) return COLOR_AVISO;
  return v.colorIngresos;
}

// Texto de comparación con el mes anterior: "▲ 12 % vs. octubre".
function textoVariacion(actual, anterior, nombreMes) {
  if (!anterior) return `Sin datos de ${nombreMes}`;
  const porcentaje = ((actual - anterior) / Math.abs(anterior)) * 100;
  const flecha = porcentaje > 0 ? "▲" : porcentaje < 0 ? "▼" : "=";
  return `${flecha} ${Math.abs(porcentaje).toFixed(0)} % vs. ${nombreMes}`;
}

// Pantalla de inicio: resumen del mes, límites, pendientes y últimos movimientos.
// Si la persona todavía no cargó nada, muestra la bienvenida con una invitación
// a registrar el primero.
export function HomeTemplate({
  movimientosMes = [],
  movimientosMesAnterior = [],
  ultimos = [],
  categorias = [],
  presupuestos = [],
  cargando = false,
  error = null,
  moneda = "$",
  guardar,
}) {
  const { user } = UserAuth();
  const { datausuarios } = useUsuariosStore();
  const navigate = useNavigate();
  const [stateUser, setStateUser] = useState(false);
  const [marcandoId, setMarcandoId] = useState(null);
  const nombre = datausuarios?.nombres || user?.full_name || user?.name || "";

  const hoy = new Date();
  const mesActual = MESES[hoy.getMonth()];
  const mesAnterior = MESES[(hoy.getMonth() + 11) % 12].toLowerCase();

  const confirmados = useMemo(
    () => movimientosMes.filter(esConfirmado),
    [movimientosMes]
  );
  const { ingresos, gastos, balance } = resumen(confirmados);
  const anterior = useMemo(
    () => resumen(movimientosMesAnterior.filter(esConfirmado)),
    [movimientosMesAnterior]
  );
  const ahorro = ingresos > 0 ? (balance / ingresos) * 100 : null;

  const categoriaPorId = useMemo(
    () => new Map(categorias.map((c) => [c.id, c])),
    [categorias]
  );

  // Límites: lo gastado este mes en cada categoría que tiene límite.
  const limites = useMemo(() => {
    const gastado = new Map();
    for (const m of confirmados) {
      if (m.tipo !== "g") continue;
      gastado.set(m.idcategoria, (gastado.get(m.idcategoria) || 0) + Number(m.valor));
    }
    return presupuestos
      .map((p) => {
        const categoria = categoriaPorId.get(p.idcategoria);
        const limite = Number(p.monto);
        const usado = gastado.get(p.idcategoria) || 0;
        return { categoria, limite, usado, porcentaje: (usado / limite) * 100 };
      })
      .filter((f) => f.categoria && f.limite > 0);
  }, [confirmados, presupuestos, categoriaPorId]);
  const limitesEnAlerta = limites
    .filter((f) => f.porcentaje >= UMBRAL_AVISO)
    .sort((a, b) => b.porcentaje - a.porcentaje);

  // Pendientes del mes, los más antiguos primero.
  const pendientes = useMemo(
    () =>
      movimientosMes
        .filter((m) => !esConfirmado(m))
        .sort((a, b) => String(a.fecha).localeCompare(String(b.fecha))),
    [movimientosMes]
  );
  const sumar = (lista) => lista.reduce((suma, m) => suma + Number(m.valor), 0);
  const pendGastos = pendientes.filter((m) => m.tipo === "g");
  const pendIngresos = pendientes.filter((m) => m.tipo === "i");

  const porCategoria = useMemo(
    () => agruparPorCategoria(confirmados, "g", categorias),
    [confirmados, categorias]
  );

  const esNuevo = !cargando && !error && ultimos.length === 0;

  function irANuevoMovimiento() {
    navigate("/movimientos", { state: { nuevo: true } });
  }

  // Pasa un pendiente a pagado / cobrado sin salir del Home.
  async function confirmar(m) {
    if (marcandoId || !guardar) return;
    setMarcandoId(m.id);
    await guardar(
      {
        id: m.id,
        idcuenta: m.idcuenta,
        tipo: m.tipo,
        valor: Number(m.valor),
        fecha: String(m.fecha).slice(0, 10),
        idcategoria: m.idcategoria,
        descripcion: m.descripcion ?? "",
        estado: ESTADO_CONFIRMADO,
      },
      true
    );
    setMarcandoId(null);
  }

  return (
    <Container onClick={() => setStateUser(false)}>
      <header className="cabecera">
        <Header
          stateConfig={{ state: stateUser, setState: () => setStateUser(!stateUser) }}
        />
      </header>

      {esNuevo ? (
        <section className="hero">
          <div className="presentacion">
            <h1>Bienvenido {nombre}</h1>
            <p>
              Gastos - UNO te ayuda a organizar tus gastos e ingresos en un solo
              lugar. Deslizá las tarjetas para descubrir más.
            </p>
            <div className="botones">
              <Btnsave
                titulo="Nuevo movimiento"
                icono={<v.agregar />}
                bgcolor="#DAC1FF"
                funcion={irANuevoMovimiento}
              />
              <Btnsave
                titulo="Configuración"
                icono={<v.iconoSettings />}
                bgcolor={v.colorSecundario}
                funcion={() => navigate("/configurar")}
              />
            </div>
          </div>

          <div className="tarjetas-swiper">
            <Carousel />
          </div>
        </section>
      ) : (
        <section className="saludo">
          <div className="presentacion">
            <h1>Bienvenido {nombre}</h1>
            <p>Este es el resumen de {mesActual.toLowerCase()}.</p>
          </div>
          <div className="botones">
            <Btnsave
              titulo="Nuevo movimiento"
              icono={<v.agregar />}
              bgcolor="#DAC1FF"
              funcion={irANuevoMovimiento}
            />
            <Btnsave
              titulo="Configuración"
              icono={<v.iconoSettings />}
              bgcolor={v.colorSecundario}
              funcion={() => navigate("/configurar")}
            />
          </div>
        </section>
      )}

      {error && (
        <p className="aviso-error">
          No se pudo cargar tu resumen: {error.message}
        </p>
      )}

      {cargando && <p className="cargando">Cargando tu resumen...</p>}

      {esNuevo && (
        <section className="vacio">
          <span className="icono-vacio">
            <FaWallet />
          </span>
          <h2>¡Hola {nombre}! Tu cuenta está lista.</h2>
          <p>
            Todavía no tenés movimientos registrados. Cargá el primero y empezá a
            ver tus informes y tu dashboard.
          </p>
          <div className="cta">
            <Btnsave
              titulo="Registrar mi primer movimiento"
              icono={<v.agregar />}
              bgcolor={v.colorPrincipal}
              funcion={irANuevoMovimiento}
            />
          </div>
        </section>
      )}

      {!cargando && !error && !esNuevo && (
        <>
          <section className="resumen">
            <h2>Resumen de {mesActual.toLowerCase()}</h2>
            <div className="tarjetas">
              <TarjetaResumen
                titulo="Balance del mes"
                valor={formatearMonto(balance, moneda)}
                color={balance >= 0 ? v.colorIngresos : v.colorGastos}
                detalle={textoVariacion(balance, anterior.balance, mesAnterior)}
              />
              <TarjetaResumen
                titulo="Ingresos del mes"
                valor={formatearMonto(ingresos, moneda)}
                color={v.colorIngresos}
                detalle={textoVariacion(ingresos, anterior.ingresos, mesAnterior)}
              />
              <TarjetaResumen
                titulo="Gastos del mes"
                valor={formatearMonto(gastos, moneda)}
                color={v.colorGastos}
                detalle={textoVariacion(gastos, anterior.gastos, mesAnterior)}
              />
              <TarjetaResumen
                titulo="Ahorro del mes"
                valor={
                  ahorro === null ? "—" : `${ahorro.toFixed(1).replace(".", ",")} %`
                }
                color={ahorro !== null && ahorro < 0 ? v.colorGastos : v.colorIngresos}
                detalle="De tus ingresos del mes"
              />
            </div>
          </section>

          <div className="paneles">
            <section className="panel">
              <div className="titulo-lista">
                <h2>Tus límites</h2>
                <button type="button" onClick={() => navigate("/presupuestos")}>
                  Ver presupuestos
                </button>
              </div>
              {limites.length === 0 ? (
                <p className="nota">
                  Todavía no definiste límites mensuales. Poné uno a tus categorías
                  de gastos y te avisamos cuando te acerques.
                </p>
              ) : limitesEnAlerta.length === 0 ? (
                <p className="nota">
                  Todo en orden: ninguna de tus {limites.length}{" "}
                  {limites.length === 1 ? "categoría con límite llegó" : "categorías con límite llegaron"}{" "}
                  al {UMBRAL_AVISO} %.
                </p>
              ) : (
                <ul className="lista-limites">
                  {limitesEnAlerta.slice(0, MAX_LIMITES).map((f) => {
                    const color = colorSegunUso(f.porcentaje);
                    return (
                      <li key={f.categoria.id}>
                        <div className="fila">
                          <span className="nombre">
                            <span
                              className="icono-mini"
                              style={{ background: `${f.categoria.color ?? "#9E9E9E"}33` }}
                            >
                              {f.categoria.icono}
                            </span>
                            <strong>{f.categoria.descripcion}</strong>
                          </span>
                          <span className="etiqueta" style={{ color }}>
                            {f.porcentaje > 100 ? "Superado" : "Cerca del límite"}
                          </span>
                        </div>
                        <div className="barra-progreso">
                          <div
                            style={{
                              width: `${Math.min(100, f.porcentaje)}%`,
                              background: color,
                            }}
                          />
                        </div>
                        <small>
                          {formatearMonto(f.usado, moneda)} de{" "}
                          {formatearMonto(f.limite, moneda)} ({f.porcentaje.toFixed(0)} %)
                        </small>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>

            <section className="panel">
              <div className="titulo-lista">
                <h2>Pendientes</h2>
                {pendientes.length > 0 && (
                  <button
                    type="button"
                    onClick={() => navigate("/movimientos", { state: { filtro: "p" } })}
                  >
                    Ver pendientes
                  </button>
                )}
              </div>
              {pendientes.length === 0 ? (
                <p className="nota">No tenés movimientos pendientes este mes. ✓</p>
              ) : (
                <>
                  <ul className="resumen-pendientes">
                    {pendGastos.length > 0 && (
                      <li>
                        <span>
                          A pagar · {pendGastos.length}{" "}
                          {pendGastos.length === 1 ? "gasto" : "gastos"}
                        </span>
                        <strong style={{ color: v.colorGastos }}>
                          - {formatearMonto(sumar(pendGastos), moneda)}
                        </strong>
                      </li>
                    )}
                    {pendIngresos.length > 0 && (
                      <li>
                        <span>
                          A cobrar · {pendIngresos.length}{" "}
                          {pendIngresos.length === 1 ? "ingreso" : "ingresos"}
                        </span>
                        <strong style={{ color: v.colorIngresos }}>
                          + {formatearMonto(sumar(pendIngresos), moneda)}
                        </strong>
                      </li>
                    )}
                  </ul>
                  <ul className="lista-pendientes">
                    {pendientes.slice(0, MAX_PENDIENTES).map((m) => {
                      const cat = categoriaPorId.get(m.idcategoria);
                      const esIngreso = m.tipo === "i";
                      return (
                        <li key={m.id}>
                          <div className="texto">
                            <strong>
                              {m.descripcion || cat?.descripcion || "Sin descripción"}
                            </strong>
                            <small>
                              {cat?.descripcion ?? "Sin categoría"} · {formatearFecha(m.fecha)}
                            </small>
                          </div>
                          <span className={esIngreso ? "ingreso" : "gasto"}>
                            {esIngreso ? "+" : "-"} {formatearMonto(m.valor, moneda)}
                          </span>
                          <button
                            type="button"
                            className="mini"
                            disabled={marcandoId === m.id}
                            onClick={() => confirmar(m)}
                          >
                            {marcandoId === m.id
                              ? "..."
                              : esIngreso
                              ? "✓ Cobrado"
                              : "✓ Pagado"}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  {pendientes.length > MAX_PENDIENTES && (
                    <small className="mas">
                      y {pendientes.length - MAX_PENDIENTES} más
                    </small>
                  )}
                </>
              )}
            </section>

            <section className="panel">
              <h2>Gastos por categoría</h2>
              {porCategoria.length === 0 ? (
                <p className="nota">Todavía no hay gastos confirmados este mes.</p>
              ) : (
                <div className="por-categoria">
                  <GraficoDona datos={porCategoria} moneda={moneda} />
                  <ul className="top-categorias">
                    {porCategoria.slice(0, MAX_CATEGORIAS).map((c) => (
                      <li key={c.id}>
                        <span className="nombre">
                          <i style={{ background: c.color }} />
                          {c.icono} {c.descripcion}
                        </span>
                        <span className="valores">
                          <strong>{formatearMonto(c.valor, moneda)}</strong>
                          <small>{c.porcentaje.toFixed(0)} %</small>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            <section className="ultimos panel">
              <div className="titulo-lista">
                <h2>Últimos movimientos</h2>
                <button type="button" onClick={() => navigate("/movimientos")}>
                  Ver todos
                </button>
              </div>
              <ul>
                {ultimos.map((m) => {
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
                        <strong>
                          {m.descripcion || cat?.descripcion || "Sin descripción"}
                        </strong>
                        <small>
                          {cat?.descripcion ?? "Sin categoría"} · {formatearFecha(m.fecha)}
                          {!esConfirmado(m) && (
                            <em className="pendiente">
                              {esIngreso ? "Pendiente de cobro" : "Pendiente de pago"}
                            </em>
                          )}
                        </small>
                      </div>
                      <span className={esIngreso ? "ingreso" : "gasto"}>
                        {esIngreso ? "+" : "-"} {formatearMonto(m.valor, moneda)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>
        </>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  width: 100%;
  min-width: 0;
  color: ${({ theme }) => theme.text};

  .cabecera {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    min-width: 0;
  }

  .hero {
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    gap: 28px;
  }

  .presentacion {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 480px;
    text-align: center;

    h1 {
      font-size: 2rem;
      line-height: 1.2;
    }
    p {
      color: ${({ theme }) => theme.colorSubtitle};
      line-height: 1.6;
    }
  }

  .botones {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
  }

  .tarjetas-swiper {
    display: flex;
    justify-content: center;
    flex: 0 0 auto;
  }

  h2 {
    font-size: 1.15em;
  }

  .resumen {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .tarjetas {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
  }

  .panel {
    padding: 16px;
    border-radius: 16px;
    border: 1px solid ${({ theme }) => theme.bg4};
    background: ${({ theme }) => theme.bg2};
  }

  .titulo-lista {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;

    button {
      border: none;
      background: transparent;
      color: ${({ theme }) => theme.primary};
      text-decoration: underline;
      cursor: pointer;
    }
  }

  .ultimos ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .ultimos li {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid ${({ theme }) => theme.bg4};

    &:last-child {
      border-bottom: none;
    }
  }

  .icono {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    flex-shrink: 0;
    border-radius: 50%;
    font-size: 22px;
  }

  .texto {
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

  .pendiente {
    margin-left: 8px;
    padding: 1px 8px;
    border-radius: 999px;
    font-style: normal;
    font-size: 0.8em;
    background: ${({ theme }) => theme.bg4};
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

  .vacio {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    padding: 36px 20px;
    text-align: center;
    border-radius: 20px;
    border: 2px dashed ${({ theme }) => theme.bg4};

    p {
      max-width: 460px;
      color: ${({ theme }) => theme.colorSubtitle};
      line-height: 1.6;
    }
  }

  .icono-vacio {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 96px;
    height: 96px;
    border-radius: 50%;
    font-size: 44px;
    color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.bg3};
  }

  .cta button {
    padding: 16px 34px;
    font-size: 1.05em;
  }

  .cargando {
    text-align: center;
    color: ${({ theme }) => theme.colorSubtitle};
  }

  .aviso-error {
    padding: 14px 16px;
    border-radius: 12px;
    border: 1px solid #f54e41;
    color: #f54e41;
  }

  .saludo {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 16px;

    h1 {
      font-size: 1.8rem;
      line-height: 1.2;
    }
    p {
      color: ${({ theme }) => theme.colorSubtitle};
    }
  }

  .paneles {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
    gap: 16px;
    align-items: start;
  }

  .nota {
    color: ${({ theme }) => theme.colorSubtitle};
    line-height: 1.5;
  }

  .lista-limites {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;

    .fila {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .nombre {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
    }
    .icono-mini {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      flex-shrink: 0;
      border-radius: 50%;
    }
    .etiqueta {
      font-size: 0.8em;
      font-weight: 600;
      white-space: nowrap;
    }
    .barra-progreso {
      height: 10px;
      margin: 8px 0 4px;
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
  }

  .resumen-pendientes {
    list-style: none;
    margin: 0 0 12px;
    padding: 0 0 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;
    border-bottom: 1px solid ${({ theme }) => theme.bg4};

    li {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      justify-content: space-between;
      gap: 2px 12px;
    }
    span {
      color: ${({ theme }) => theme.colorSubtitle};
      font-size: 0.9em;
    }
  }

  .lista-pendientes {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;

    li {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 6px 12px;
      padding: 10px 0;
      border-bottom: 1px solid ${({ theme }) => theme.bg4};

      &:last-child {
        border-bottom: none;
      }
    }
    .texto {
      flex: 1 1 140px;
    }
  }

  .mas {
    display: block;
    margin-top: 6px;
    color: ${({ theme }) => theme.colorSubtitle};
  }

  .mini {
    padding: 4px 12px;
    font-size: 0.8em;
    border: 1px solid ${({ theme }) => theme.primary};
    border-radius: 999px;
    background: transparent;
    color: ${({ theme }) => theme.primary};
    cursor: pointer;
    white-space: nowrap;
    transition: 0.2s;

    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.primary};
      color: #18121f;
    }
    &:disabled {
      opacity: 0.5;
      cursor: wait;
    }
  }

  .por-categoria {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .top-categorias {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;

    li {
      display: flex;
      align-items: center;
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
    .valores {
      display: flex;
      align-items: baseline;
      gap: 8px;
      white-space: nowrap;

      small {
        color: ${({ theme }) => theme.colorSubtitle};
      }
    }
  }

  @media (min-width: 48em) {
    .hero {
      flex-direction: row;
      justify-content: space-between;
      gap: 40px;
    }
    .presentacion {
      flex: 1;
      max-width: none;
      text-align: left;
    }
    .botones {
      justify-content: flex-start;
    }
    .tarjetas-swiper {
      flex-basis: 40%;
    }
  }
`;
