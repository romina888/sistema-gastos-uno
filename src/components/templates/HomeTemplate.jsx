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
import {
  MESES,
  esConfirmado,
  formatearFecha,
  formatearMonto,
  resumen,
} from "../../utils/finanzas";

// Pantalla de inicio: bienvenida, resumen del mes y últimos movimientos.
// Si la persona todavía no cargó nada, muestra una invitación a registrar el primero.
export function HomeTemplate({
  movimientosMes = [],
  ultimos = [],
  categorias = [],
  cargando = false,
  error = null,
  moneda = "$",
}) {
  const { user } = UserAuth();
  const { datausuarios } = useUsuariosStore();
  const navigate = useNavigate();
  const [stateUser, setStateUser] = useState(false);
  const nombre = datausuarios?.nombres || user?.full_name || user?.name || "";

  const confirmados = useMemo(
    () => movimientosMes.filter(esConfirmado),
    [movimientosMes]
  );
  const { ingresos, gastos, balance } = resumen(confirmados);
  const pendientes = movimientosMes.length - confirmados.length;
  const ahorro = ingresos > 0 ? (balance / ingresos) * 100 : null;
  const mesActual = MESES[new Date().getMonth()];

  const categoriaPorId = useMemo(
    () => new Map(categorias.map((c) => [c.id, c])),
    [categorias]
  );

  const esNuevo = !cargando && !error && ultimos.length === 0;

  function irANuevoMovimiento() {
    navigate("/movimientos", { state: { nuevo: true } });
  }

  return (
    <Container onClick={() => setStateUser(false)}>
      <header className="cabecera">
        <Header
          stateConfig={{ state: stateUser, setState: () => setStateUser(!stateUser) }}
        />
      </header>

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
              />
              <TarjetaResumen
                titulo="Gastos del mes"
                valor={formatearMonto(gastos, moneda)}
                color={v.colorGastos}
              />
              <TarjetaResumen
                titulo="Ahorro del mes"
                valor={
                  ahorro === null ? "—" : `${ahorro.toFixed(1).replace(".", ",")} %`
                }
                color={ahorro !== null && ahorro < 0 ? v.colorGastos : v.colorIngresos}
                detalle={
                  pendientes > 0
                    ? `${pendientes} ${pendientes === 1 ? "movimiento pendiente" : "movimientos pendientes"}`
                    : "De tus ingresos del mes"
                }
              />
            </div>
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
                        {!esConfirmado(m) && <em className="pendiente">
                            {esIngreso ? "Pendiente de cobro" : "Pendiente de pago"}
                          </em>}
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

