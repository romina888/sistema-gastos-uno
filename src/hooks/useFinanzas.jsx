import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useUsuariosStore } from "../store/UsuariosStore";
import {
  MostrarCuentas,
  MostrarMovimientos,
  InsertarMovimientos,
  EditarMovimientos,
  EliminarMovimientos,
  MostrarTodasCategorias,
} from "../supabase/crudMovimientos";

// Datos del usuario que se usan en todas las pantallas de finanzas.
export function useUsuarioFinanzas() {
  const { datausuarios } = useUsuariosStore();
  return {
    idusuario: datausuarios?.id,
    moneda: datausuarios?.moneda || "$",
  };
}

// Cuentas del usuario (cada persona tiene al menos una "billetera").
export function useCuentasUsuario() {
  const { idusuario } = useUsuarioFinanzas();
  return useQuery({
    queryKey: ["cuentas", idusuario],
    queryFn: () => MostrarCuentas({ idusuario }),
    enabled: !!idusuario,
  });
}

// Movimientos entre dos fechas ("desde" incluida, "hasta" no incluida).
export function useMovimientosRango(desde, hasta) {
  const { idusuario } = useUsuarioFinanzas();
  return useQuery({
    queryKey: ["movimientos", idusuario, desde, hasta],
    queryFn: () => MostrarMovimientos({ idusuario, desde, hasta }),
    enabled: !!idusuario,
  });
}

// Todas las categorías del usuario (gastos e ingresos).
export function useCategoriasUsuario() {
  const { idusuario } = useUsuarioFinanzas();
  return useQuery({
    queryKey: ["categorias-usuario", idusuario],
    queryFn: () => MostrarTodasCategorias({ idusuario }),
    enabled: !!idusuario,
  });
}

function mostrarError(titulo, error) {
  console.error(titulo, error);
  Swal.fire({
    icon: "error",
    title: titulo,
    text: error?.message || "Ocurrió un error inesperado.",
  });
}

// Guardar (crear o editar) y eliminar movimientos, refrescando las listas.
export function useAccionesMovimientos() {
  const queryClient = useQueryClient();
  const refrescar = () =>
    queryClient.invalidateQueries({ queryKey: ["movimientos"] });

  async function guardar(p, esEdicion) {
    try {
      if (!p.idcuenta) {
        throw new Error(
          "No se encontró una cuenta asociada a tu usuario (tabla cuenta)."
        );
      }
      if (esEdicion) await EditarMovimientos(p);
      else await InsertarMovimientos(p);
      await refrescar();
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Datos guardados",
        showConfirmButton: false,
        timer: 1500,
      });
      return true;
    } catch (error) {
      mostrarError("No se pudo guardar el movimiento", error);
      return false;
    }
  }

  async function eliminar(p) {
    const respuesta = await Swal.fire({
      title: "¿Eliminar este movimiento?",
      text: "Una vez eliminado, no vas a poder recuperarlo.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#BF83FF",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!respuesta.isConfirmed) return;
    try {
      await EliminarMovimientos({ id: p.id, idcuenta: p.idcuenta });
      await refrescar();
      Swal.fire({
        icon: "success",
        title: "Movimiento eliminado",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      mostrarError("No se pudo eliminar el movimiento", error);
    }
  }

  return { guardar, eliminar };
}
