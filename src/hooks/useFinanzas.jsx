import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useUsuariosStore } from "../store/UsuariosStore";
import {
  MostrarCuentas,
  MostrarMovimientos,
  MostrarUltimosMovimientos,
  InsertarMovimientos,
  EditarMovimientos,
  EliminarMovimientos,
  MostrarTodasCategorias,
} from "../supabase/crudMovimientos";
import { MostrarPresupuestos } from "../supabase/crudPresupuestos";
import {
  ESTADO_CONFIRMADO,
  MESES,
  formatearMonto,
  rangoMes,
} from "../utils/finanzas";

export function useUsuarioFinanzas() {
  const { datausuarios } = useUsuariosStore();
  return {
    idusuario: datausuarios?.id,
    moneda: datausuarios?.moneda || "$",
  };
}
export function useCuentasUsuario() {
  const { idusuario } = useUsuarioFinanzas();
  return useQuery({
    queryKey: ["cuentas", idusuario],
    queryFn: () => MostrarCuentas({ idusuario }),
    enabled: !!idusuario,
  });
}
export function useMovimientosRango(desde, hasta) {
  const { idusuario } = useUsuarioFinanzas();
  return useQuery({
    queryKey: ["movimientos", idusuario, desde, hasta],
    queryFn: () => MostrarMovimientos({ idusuario, desde, hasta }),
    enabled: !!idusuario,
  });
}

// Los últimos movimientos cargados (para el Home).
export function useUltimosMovimientos(limite = 4) {
  const { idusuario } = useUsuarioFinanzas();
  return useQuery({
    queryKey: ["movimientos", "ultimos", idusuario, limite],
    queryFn: () => MostrarUltimosMovimientos({ idusuario, limite }),
    enabled: !!idusuario,
  });
}

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

// Antes de guardar un gasto confirmado, mira si con ese monto la categoría
// supera el límite mensual que tiene definido. Devuelve los datos para el
// aviso, o null si no hay nada que avisar. Si algo falla, no bloquea el guardado.
async function revisarLimite({ p, esEdicion, idusuario, moneda }) {
  try {
    if (p.tipo !== "g" || String(p.estado) !== ESTADO_CONFIRMADO) return null;
    if (!p.idcategoria || !idusuario) return null;

    const presupuestos = await MostrarPresupuestos({ idusuario });
    const presupuesto = presupuestos.find(
      (x) => String(x.idcategoria) === String(p.idcategoria)
    );
    if (!presupuesto) return null;

    const [anio, mesNumero] = String(p.fecha).slice(0, 10).split("-").map(Number);
    const { desde, hasta } = rangoMes(anio, mesNumero - 1);
    const delMes = await MostrarMovimientos({ idusuario, desde, hasta });

    const cuenta = (m) =>
      m.tipo === "g" &&
      String(m.estado) === ESTADO_CONFIRMADO &&
      String(m.idcategoria) === String(p.idcategoria);

    // Lo gastado en el mes tal como está hoy (con la versión vieja del movimiento si se edita).
    const antes = delMes.filter(cuenta).reduce((s, m) => s + Number(m.valor), 0);
    // Lo gastado en el mes si se guarda el cambio.
    const despues =
      delMes
        .filter((m) => !(esEdicion && m.id === p.id) && cuenta(m))
        .reduce((s, m) => s + Number(m.valor), 0) + Number(p.valor);

    const limite = Number(presupuesto.monto);
    if (despues <= limite || despues <= antes) return null;

    const categorias = await MostrarTodasCategorias({ idusuario });
    const categoria = categorias.find((c) => String(c.id) === String(p.idcategoria));
    return {
      categoria: categoria?.descripcion ?? "esta categoría",
      mes: `${MESES[mesNumero - 1].toLowerCase()} de ${anio}`,
      gastado: formatearMonto(despues, moneda),
      limite: formatearMonto(limite, moneda),
      exceso: formatearMonto(despues - limite, moneda),
    };
  } catch (error) {
    console.error("No se pudo revisar el límite de la categoría", error);
    return null;
  }
}

export function useAccionesMovimientos() {
  const { idusuario, moneda } = useUsuarioFinanzas();
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
      const aviso = await revisarLimite({ p, esEdicion, idusuario, moneda });
      if (esEdicion) await EditarMovimientos(p);
      else await InsertarMovimientos(p);
      await refrescar();
      if (aviso) {
        Swal.fire({
          icon: "warning",
          title: "Superaste el límite mensual",
          html: `Con este gasto, <b>${aviso.categoria}</b> llega a <b>${aviso.gastado}</b> en ${aviso.mes}, y el límite es de ${aviso.limite}.<br/>Te pasaste por <b>${aviso.exceso}</b>.`,
          confirmButtonText: "Entendido",
          confirmButtonColor: "#BF83FF",
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Datos guardados",
          showConfirmButton: false,
          timer: 1500,
        });
      }
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
