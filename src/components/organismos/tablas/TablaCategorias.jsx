import styled from "styled-components";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";
import { v } from "../../../styles/variables";
import { useCategoriasStore } from "../../../store/CategoriasStore";
import { formatearMonto } from "../../../utils/finanzas";
import { ContentAccionesTabla } from "./ContentAccionesTabla";
import { Paginacion } from "./Paginacion";

const POR_PAGINA = 8;

export function TablaCategorias({
  data,
  tipo,
  moneda,
  presupuestoPorCategoria,
  onEditar,
}) {
  const [pagina, setPagina] = useState(1);
  const { eliminarCategoria } = useCategoriasStore();
  const queryClient = useQueryClient();

  const maximo = Math.max(1, Math.ceil(data.length / POR_PAGINA));

  useEffect(() => {
    if (pagina > maximo) setPagina(maximo);
  }, [pagina, maximo]);

  useEffect(() => {
    setPagina(1);
  }, [tipo]);

  function eliminar(p) {
    Swal.fire({
      title: `¿Estás seguro de eliminar "${p.descripcion}"?`,
      text: "Una vez eliminada, no podrás recuperar esta categoría.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#BF83FF",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        await eliminarCategoria({ id: p.id, idusuario: p.idusuario });
        // Si tenía límite, se borra junto con la categoría: refrescamos la lista.
        queryClient.invalidateQueries({ queryKey: ["presupuestos"] });
        queryClient.invalidateQueries({ queryKey: ["categorias-usuario"] });
        Swal.fire({
          icon: "success",
          title: "Categoría eliminada",
          showConfirmButton: false,
          timer: 1500,
        });
      } catch {
        Swal.fire({
          icon: "error",
          title: "No se pudo eliminar",
          text: "Ocurrió un error al eliminar la categoría.",
        });
      }
    });
  }

  if (data.length === 0) {
    return (
      <p className="vacio">
        Todavía no tenés categorías de {tipo === "g" ? "gastos" : "ingresos"}. Tocá
        “Nueva categoría” para crear la primera.
      </p>
    );
  }

  const pagActual = data.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  return (
    <>
      <Lista>
        {pagActual.map((item) => {
          const presupuesto = presupuestoPorCategoria.get(item.id);
          return (
            <li key={item.id}>
              <span
                className="icono"
                style={{ background: `${item.color ?? "#9E9E9E"}33` }}
              >
                {item.icono}
              </span>
              <div className="texto">
                <strong>{item.descripcion}</strong>
                {tipo === "g" && (
                  <small>
                    {presupuesto
                      ? `Límite mensual: ${formatearMonto(presupuesto.monto, moneda)}`
                      : "Sin límite mensual"}
                  </small>
                )}
              </div>
              <span
                className="color"
                style={{ background: item.color }}
                title="Color de la categoría"
              />
              <ContentAccionesTabla
                funcionEditar={() => onEditar(item)}
                funcionEliminar={() => eliminar(item)}
              />
            </li>
          );
        })}
      </Lista>
      <Paginacion pagina={pagina} setPagina={setPagina} maximo={maximo} />
    </>
  );
}

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
      "icono texto color"
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
  }

  .color {
    grid-area: color;
    justify-self: end;
    width: 22px;
    height: 22px;
    border-radius: 50%;
  }

  li > div:last-child {
    grid-area: acciones;
    justify-self: end;
  }

  @media (min-width: ${v.bpbart}) {
    li {
      grid-template-columns: 44px 1fr 60px 100px;
      grid-template-areas: "icono texto color acciones";
    }
    .color {
      justify-self: center;
    }
  }
`;
