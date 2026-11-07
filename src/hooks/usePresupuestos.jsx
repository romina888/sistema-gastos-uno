import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useUsuarioFinanzas } from "./useFinanzas";
import {
  EliminarPresupuesto,
  GuardarPresupuesto,
  MostrarPresupuestos,
} from "../supabase/crudPresupuestos";

export function usePresupuestosUsuario() {
  const { idusuario } = useUsuarioFinanzas();
  return useQuery({
    queryKey: ["presupuestos", idusuario],
    queryFn: () => MostrarPresupuestos({ idusuario }),
    enabled: !!idusuario,
  });
}

export function useAccionesPresupuestos() {
  const queryClient = useQueryClient();
  const { idusuario } = useUsuarioFinanzas();
  const refrescar = () => queryClient.invalidateQueries({ queryKey: ["presupuestos"] });

  function mostrarError(titulo, error) {
    console.error(titulo, error);
    Swal.fire({ icon: "error", title: titulo, text: error?.message || "Error inesperado." });
  }

  async function guardar({ idcategoria, monto }) {
    try {
      await GuardarPresupuesto({ idusuario, idcategoria, monto });
      await refrescar();
      Swal.fire({
        icon: "success",
        title: "Límite guardado",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      mostrarError("No se pudo guardar el límite", error);
    }
  }

  async function eliminar({ id, descripcion }) {
    const respuesta = await Swal.fire({
      title: `¿Quitar el límite de "${descripcion}"?`,
      text: "La categoría y sus movimientos no se borran, solo el límite.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#BF83FF",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, quitar",
      cancelButtonText: "Cancelar",
    });
    if (!respuesta.isConfirmed) return;
    try {
      await EliminarPresupuesto({ id, idusuario });
      await refrescar();
    } catch (error) {
      mostrarError("No se pudo quitar el límite", error);
    }
  }

  return { guardar, eliminar };
}
