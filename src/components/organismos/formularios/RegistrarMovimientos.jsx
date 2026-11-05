import styled from "styled-components";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { v } from "../../../styles/variables";
import { Btnsave } from "../../moleculas/Btnsave";
import { Segmentado } from "../../moleculas/Segmentado";
import { ESTADO_CONFIRMADO, ESTADO_PENDIENTE } from "../../../utils/finanzas";

const OPCIONES_TIPO = [
  { valor: "g", texto: "Gasto", color: v.colorGastos },
  { valor: "i", texto: "Ingreso", color: v.colorIngresos },
];

// Ventana para crear o editar un movimiento.
export function RegistrarMovimientos({
  onClose,
  accion,
  dataSelect,
  categorias,
  moneda,
  fechaInicial,
  idcuenta,
  guardar,
}) {
  const esEdicion = accion === "Editar";
  const navigate = useNavigate();
  const [guardando, setGuardando] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tipo: esEdicion ? dataSelect.tipo : "g",
      valor: esEdicion ? dataSelect.valor : "",
      fecha: esEdicion ? String(dataSelect.fecha).slice(0, 10) : fechaInicial,
      idcategoria: esEdicion ? String(dataSelect.idcategoria ?? "") : "",
      descripcion: esEdicion ? dataSelect.descripcion ?? "" : "",
      estado: esEdicion ? String(dataSelect.estado ?? ESTADO_CONFIRMADO) : ESTADO_CONFIRMADO,
    },
  });

  const tipo = watch("tipo");
  const estado = watch("estado");
  const opcionesEstado = [
    { valor: ESTADO_CONFIRMADO, texto: tipo === "g" ? "Pagado" : "Cobrado" },
    { valor: ESTADO_PENDIENTE, texto: "Pendiente" },
  ];
  const categoriasDelTipo = categorias.filter((c) => c.tipo === tipo);

  function cambiarTipo(nuevo) {
    setValue("tipo", nuevo);
    setValue("idcategoria", "");
  }

  async function enviar(data) {
    const categoria = categorias.find(
      (c) => String(c.id) === String(data.idcategoria)
    );
    const p = {
      tipo: data.tipo,
      valor: Number(data.valor),
      fecha: data.fecha,
      idcategoria: categoria ? categoria.id : null,
      descripcion: data.descripcion.trim(),
      estado: String(data.estado),
      idcuenta,
    };
    if (esEdicion) p.id = dataSelect.id;

    setGuardando(true);
    const ok = await guardar(p, esEdicion);
    setGuardando(false);
    if (ok) onClose();
  }

  return (
    <Container>
      <div className="sub-contenedor">
        <div className="headers">
          <h1>{esEdicion ? "Editar movimiento" : "Nuevo movimiento"}</h1>
          <span onClick={onClose} role="button" aria-label="Cerrar">
            x
          </span>
        </div>

        <form className="formulario" onSubmit={handleSubmit(enviar)}>
          <Segmentado opciones={OPCIONES_TIPO} valor={tipo} onChange={cambiarTipo} />

          <label>
            <span>Monto ({moneda})</span>
            <input
              type="number"
              step="0.01"
              min="0"
              inputMode="decimal"
              placeholder="0,00"
              {...register("valor", {
                required: "Ingresá un monto",
                validate: (x) => Number(x) > 0 || "El monto debe ser mayor a 0",
              })}
            />
            {errors.valor && <p>{errors.valor.message}</p>}
          </label>

          <label>
            <span>Fecha</span>
            <input
              type="date"
              min="2000-01-01"
              max="2100-12-31"
              {...register("fecha", { required: "Elegí una fecha" })}
            />
            {errors.fecha && <p>{errors.fecha.message}</p>}
          </label>

          <label>
            <span>Categoría</span>
            <select
              {...register("idcategoria", { required: "Elegí una categoría" })}
            >
              <option value="">Elegí una categoría</option>
              {categoriasDelTipo.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icono} {c.descripcion}
                </option>
              ))}
            </select>
            {errors.idcategoria && <p>{errors.idcategoria.message}</p>}
            {categoriasDelTipo.length === 0 && (
              <p className="aviso">
                Todavía no tenés categorías de {tipo === "g" ? "gastos" : "ingresos"}.{" "}
                <button type="button" onClick={() => navigate("/categorias")}>
                  Crear una
                </button>
              </p>
            )}
          </label>

          <label>
            <span>Estado</span>
            <Segmentado
              opciones={opcionesEstado}
              valor={estado}
              onChange={(e) => setValue("estado", e)}
            />
          </label>

          <label>
            <span>Descripción (opcional)</span>
            <input
              type="text"
              maxLength={120}
              placeholder="Ej: Supermercado"
              {...register("descripcion")}
            />
          </label>

          <div className="guardar">
            <Btnsave
              icono={<v.iconoguardar />}
              titulo={guardando ? "Guardando..." : "Guardar"}
              bgcolor="#DAC1FF"
            />
          </div>
        </form>
      </div>
    </Container>
  );
}

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(10, 9, 9, 0.5);
  z-index: 1000;

  .sub-contenedor {
    width: 480px;
    max-width: 92%;
    max-height: 92vh;
    overflow-y: auto;
    padding: 16px 28px 24px;
    border-radius: 20px;
    background: ${({ theme }) => theme.bgtotal};
    color: ${({ theme }) => theme.text};
    box-shadow: -10px 15px 30px rgba(10, 9, 9, 0.4);
  }

  .headers {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;

    h1 {
      font-size: 20px;
      font-weight: 500;
    }
    span {
      font-size: 20px;
      cursor: pointer;
    }
  }

  .formulario {
    display: flex;
    flex-direction: column;
    gap: 16px;

    label {
      display: flex;
      flex-direction: column;
      gap: 6px;

      > span {
        font-size: 0.85em;
        color: ${({ theme }) => theme.colorSubtitle};
      }
    }

    input,
    select {
      width: 100%;
      padding: 10px;
      font-size: 16px;
      border: 1px solid ${({ theme }) => theme.bg4};
      border-radius: 10px;
      background: ${({ theme }) => theme.bg2};
      color: ${({ theme }) => theme.text};
      outline: none;

      &:focus {
        border-color: ${({ theme }) => theme.primary};
      }
    }

    p {
      font-size: 12px;
      color: #ff6d00;
    }

    .aviso button {
      border: none;
      background: transparent;
      color: ${({ theme }) => theme.primary};
      text-decoration: underline;
      cursor: pointer;
    }

    .guardar {
      display: flex;
      justify-content: center;
    }
  }
`;
