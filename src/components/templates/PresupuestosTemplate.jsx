import styled from "styled-components";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { v } from "../../styles/variables";
import { Header } from "../organismos/Header";
import { SelectorPeriodo } from "../moleculas/SelectorPeriodo";
import { TarjetaResumen } from "../moleculas/TarjetaResumen";
import { ContenedorPagina } from "../atomos/ContenedorPagina";
import { MESES, esConfirmado, formatearMonto } from "../../utils/finanzas";

const COLOR_AVISO = "#F5A623";

// Verde hasta el 80 %, amarillo hasta el límite y rojo si se pasó.
function colorSegunUso(porcentaje) {
  if (porcentaje > 100) return v.colorGastos;
  if (porcentaje >= 80) return COLOR_AVISO;
  return v.colorIngresos;
}

export function PresupuestosTemplate({
  anio,
  mes,
  onAnterior,
  onSiguiente,
  onHoy,
  movimientos,
  categorias,
  presupuestos,
  cargando,
  error,
  moneda,
  guardar,
  eliminar,
}) {
  const [stateUser, setStateUser] = useState(false);
  const navigate = useNavigate();

  const filas = useMemo(() => {
    const gastado = new Map();
    for (const m of movimientos) {
      if (m.tipo !== "g" || !esConfirmado(m)) continue;
      gastado.set(m.idcategoria, (gastado.get(m.idcategoria) || 0) + Number(m.valor));
    }
    const limites = new Map(presupuestos.map((p) => [p.idcategoria, p]));

    return categorias
      .filter((c) => c.tipo === "g")
      .map((categoria) => {
        const presupuesto = limites.get(categoria.id);
        const usado = gastado.get(categoria.id) || 0;
        const limite = presupuesto ? Number(presupuesto.monto) : null;
        return {
          categoria,
          presupuesto,
          limite,
          usado,
          porcentaje: limite ? (usado / limite) * 100 : null,
        };
      })
      .sort((a, b) => {
        if (a.limite && !b.limite) return -1;
        if (!a.limite && b.limite) return 1;
        if (a.limite && b.limite) return b.porcentaje - a.porcentaje;
        return a.categoria.descripcion.localeCompare(b.categoria.descripcion);
      });
  }, [movimientos, categorias, presupuestos]);

  const conLimite = filas.filter((f) => f.limite);
  const totalLimite = conLimite.reduce((s, f) => s + f.limite, 0);
  const totalUsado = conLimite.reduce((s, f) => s + f.usado, 0);
  const disponible = totalLimite - totalUsado;
  const excedidas = conLimite.filter((f) => f.porcentaje > 100).length;

  async function definirLimite(fila) {
    const { isConfirmed, value } = await Swal.fire({
      title: `Límite mensual para ${fila.categoria.descripcion}`,
      input: "number",
      inputLabel: `Monto máximo a gastar por mes (${moneda})`,
      inputValue: fila.limite ?? "",
      inputAttributes: { min: "1", step: "0.01" },
      showCancelButton: true,
      confirmButtonText: "Guardar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#BF83FF",
      inputValidator: (valor) =>
        !valor || Number(valor) <= 0 ? "Ingresá un monto mayor a 0" : undefined,
    });
    if (!isConfirmed) return;
    await guardar({ idcategoria: fila.categoria.id, monto: Number(value) });
  }

  return (
    <ContenedorPagina onClick={() => setStateUser(false)}>
      <header className="cabecera">
        <Header
          stateConfig={{ state: stateUser, setState: () => setStateUser(!stateUser) }}
        />
      </header>

      <div className="titulo">
        <h1>Presupuestos</h1>
        <p>
          Poné un límite mensual a cada categoría de gastos y mirá cuánto llevás
          gastado. La barra se pone roja si te pasás.
        </p>
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

      {error ? (
        <p className="error">
          No se pudieron cargar los presupuestos: {error.message}. Si es la primera vez,
          revisá que se haya ejecutado el script <b>docs/presupuestos.sql</b> en Supabase.
        </p>
      ) : cargando ? (
        <p className="vacio">Cargando presupuestos...</p>
      ) : filas.length === 0 ? (
        <section className="panel">
          <p className="vacio">
            Todavía no tenés categorías de gastos. Creá algunas para poder ponerles un
            límite.
          </p>
          <Centrado>
            <button type="button" onClick={() => navigate("/categorias")}>
              Ir a Categorías
            </button>
          </Centrado>
        </section>
      ) : (
        <>
          {conLimite.length > 0 && (
            <section className="tarjetas">
              <TarjetaResumen
                titulo="Presupuesto total"
                valor={formatearMonto(totalLimite, moneda)}
              />
              <TarjetaResumen
                titulo="Gastado en esas categorías"
                valor={formatearMonto(totalUsado, moneda)}
                color={v.colorGastos}
              />
              <TarjetaResumen
                titulo="Disponible"
                valor={formatearMonto(disponible, moneda)}
                color={disponible >= 0 ? v.colorIngresos : v.colorGastos}
              />
              <TarjetaResumen
                titulo="Categorías excedidas"
                valor={String(excedidas)}
                color={excedidas > 0 ? v.colorGastos : v.colorIngresos}
              />
            </section>
          )}

          <Lista>
            {filas.map((f) => {
              const color = f.porcentaje === null ? undefined : colorSegunUso(f.porcentaje);
              const restante = f.limite ? f.limite - f.usado : 0;
              return (
                <li key={f.categoria.id} className="panel">
                  <div className="encabezado">
                    <span className="nombre">
                      <span
                        className="icono"
                        style={{ background: `${f.categoria.color ?? "#9E9E9E"}33` }}
                      >
                        {f.categoria.icono}
                      </span>
                      <strong>{f.categoria.descripcion}</strong>
                    </span>
                    <span className="acciones">
                      <button type="button" onClick={() => definirLimite(f)}>
                        {f.limite ? "Editar límite" : "Definir límite"}
                      </button>
                      {f.presupuesto && (
                        <button
                          type="button"
                          className="peligro"
                          onClick={() =>
                            eliminar({
                              id: f.presupuesto.id,
                              descripcion: f.categoria.descripcion,
                            })
                          }
                        >
                          Quitar
                        </button>
                      )}
                    </span>
                  </div>

                  {f.limite ? (
                    <>
                      <div
                        className="barra-progreso"
                        role="progressbar"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.min(100, Math.round(f.porcentaje))}
                      >
                        <div
                          style={{
                            width: `${Math.min(100, f.porcentaje)}%`,
                            background: color,
                          }}
                        />
                      </div>
                      <div className="detalle">
                        <span>
                          Gastaste <b>{formatearMonto(f.usado, moneda)}</b> de{" "}
                          {formatearMonto(f.limite, moneda)} (
                          {f.porcentaje.toFixed(0)} %)
                        </span>
                        <span style={{ color }}>
                          {restante >= 0
                            ? `Te quedan ${formatearMonto(restante, moneda)}`
                            : `Te pasaste por ${formatearMonto(-restante, moneda)}`}
                        </span>
                      </div>
                    </>
                  ) : (
                    <p className="sin-limite">
                      Sin límite. Este mes gastaste {formatearMonto(f.usado, moneda)}.
                    </p>
                  )}
                </li>
              );
            })}
          </Lista>
        </>
      )}
    </ContenedorPagina>
  );
}

const Centrado = styled.div`
  display: flex;
  justify-content: center;

  button {
    padding: 10px 18px;
    border: none;
    border-radius: 10px;
    background: ${({ theme }) => theme.primary};
    color: #18121f;
    font-weight: 600;
    cursor: pointer;
  }
`;

const Lista = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;

  .encabezado {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .nombre {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }

  .icono {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 20px;
  }

  .acciones {
    display: flex;
    gap: 8px;

    button {
      padding: 6px 12px;
      border: 1px solid ${({ theme }) => theme.primary};
      border-radius: 8px;
      background: transparent;
      color: ${({ theme }) => theme.primary};
      cursor: pointer;

      &:hover {
        background: ${({ theme }) => theme.primary};
        color: #18121f;
      }
    }

    .peligro {
      border-color: #f76e8e;
      color: #f76e8e;

      &:hover {
        background: #f76e8e;
        color: #18121f;
      }
    }
  }

  .barra-progreso {
    height: 12px;
    margin: 14px 0 8px;
    border-radius: 999px;
    background: ${({ theme }) => theme.bg4};
    overflow: hidden;

    div {
      height: 100%;
      border-radius: 999px;
      transition: width 0.4s ease;
    }
  }

  .detalle {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 6px 16px;
    font-size: 0.9em;
  }

  .sin-limite {
    margin-top: 8px;
    color: ${({ theme }) => theme.colorSubtitle};
    font-size: 0.9em;
  }
`;
