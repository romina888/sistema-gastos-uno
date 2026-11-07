import styled from "styled-components";
import { useState } from "react";
import Swal from "sweetalert2";
import { useQueryClient } from "@tanstack/react-query";
import { useUsuarioFinanzas } from "../../hooks/useFinanzas";
import { useCategoriasStore } from "../../store/CategoriasStore";
import {
  ContarMovimientos,
  EliminarTodosMovimientos,
} from "../../supabase/crudMovimientos";
import {
  ContarCategorias,
  EliminarTodasCategorias,
} from "../../supabase/crudCategorias";

const PALABRA = "BORRAR";

// Sección de Configuración para vaciar los datos de la cuenta.
// Pide escribir "borrar" (con mayúsculas o minúsculas) antes de eliminar nada.
export function ZonaPeligro() {
  const { idusuario } = useUsuarioFinanzas();
  const queryClient = useQueryClient();
  const [ocupado, setOcupado] = useState(false);

  function refrescar() {
    queryClient.invalidateQueries({ queryKey: ["movimientos"] });
    queryClient.invalidateQueries({ queryKey: ["presupuestos"] });
    queryClient.invalidateQueries({ queryKey: ["categorias-usuario"] });
    queryClient.invalidateQueries({ queryKey: ["mostrar categorias"] });
  }

  async function vaciar({ contar, borrar, singular, plural, aviso, despues }) {
    if (!idusuario || ocupado) return;
    setOcupado(true);
    try {
      const total = await contar({ idusuario });
      if (total === 0) {
        await Swal.fire({
          icon: "info",
          title: "No hay nada para borrar",
          text: `No tenés ${plural} cargad${plural === "movimientos" ? "os" : "as"}.`,
          confirmButtonColor: "#BF83FF",
        });
        return;
      }

      const { isConfirmed } = await Swal.fire({
        icon: "warning",
        title: `¿Borrar ${total} ${total === 1 ? singular : plural}?`,
        html: `${aviso}<br/><b>Esta acción no se puede deshacer.</b>`,
        input: "text",
        inputLabel: `Para confirmar, escribí "borrar" (con mayúsculas o minúsculas)`,
        inputPlaceholder: "borrar",
        showCancelButton: true,
        confirmButtonText: "Sí, borrar todo",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#7d7d7d",
        inputValidator: (valor) =>
          valor?.trim().toUpperCase() === PALABRA
            ? undefined
            : "Escribí la palabra borrar para confirmar",
      });
      if (!isConfirmed) return;

      const borrados = await borrar({ idusuario });
      despues?.();
      refrescar();

      if (borrados < total) {
        await Swal.fire({
          icon: "warning",
          title: `Se borraron ${borrados} de ${total}`,
          text: "Supabase no permitió borrar el resto (revisá las políticas de DELETE).",
          confirmButtonColor: "#BF83FF",
        });
      } else {
        await Swal.fire({
          icon: "success",
          title: "Listo, se borró todo",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error("Error al vaciar datos", error);
      Swal.fire({
        icon: "error",
        title: "No se pudo borrar",
        text:
          error?.message ||
          "Ocurrió un error inesperado. Si borrás categorías, probá primero borrar los movimientos.",
      });
    } finally {
      setOcupado(false);
    }
  }

  function borrarMovimientos() {
    vaciar({
      contar: ContarMovimientos,
      borrar: EliminarTodosMovimientos,
      singular: "movimiento",
      plural: "movimientos",
      aviso: "Se borran todos tus ingresos y gastos, pagados y pendientes.",
    });
  }

  function borrarCategorias() {
    vaciar({
      contar: ContarCategorias,
      borrar: EliminarTodasCategorias,
      singular: "categoría",
      plural: "categorías",
      aviso:
        "También se borran los límites mensuales. Los movimientos que las usan van a quedar como “Sin categoría”.",
      despues: () => useCategoriasStore.setState({ datacategoria: [] }),
    });
  }

  return (
    <Container>
      <h2>Zona de peligro</h2>
      <p className="nota">
        Para empezar de cero, borrá primero los movimientos y después las
        categorías.
      </p>

      <div className="fila">
        <div>
          <strong>Borrar todos los movimientos</strong>
          <small>Ingresos y gastos, pagados y pendientes.</small>
        </div>
        <button type="button" disabled={ocupado} onClick={borrarMovimientos}>
          Borrar movimientos
        </button>
      </div>

      <div className="fila">
        <div>
          <strong>Borrar todas las categorías</strong>
          <small>De gastos y de ingresos, con sus límites mensuales.</small>
        </div>
        <button type="button" disabled={ocupado} onClick={borrarCategorias}>
          Borrar categorías
        </button>
      </div>
    </Container>
  );
}

const Container = styled.section`
  width: 100%;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px;
  border-radius: 14px;
  border: 1px solid #f54e41;

  h2 {
    font-size: 1.05em;
    color: #f54e41;
  }

  .nota {
    font-size: 0.85em;
    color: ${({ theme }) => theme.colorSubtitle};
  }

  .fila {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;

    > div {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
      flex: 1 1 180px;
    }
    small {
      color: ${({ theme }) => theme.colorSubtitle};
    }
  }

  button {
    padding: 8px 14px;
    border: 1px solid #f54e41;
    border-radius: 10px;
    background: transparent;
    color: #f54e41;
    cursor: pointer;
    transition: 0.2s;

    &:hover:not(:disabled) {
      background: #f54e41;
      color: #fff;
    }
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;
