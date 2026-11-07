import { supabase } from "../index";
import Swal from "sweetalert2";
// Código de Postgres para "valor duplicado" (restricción unique).
export const ERROR_DUPLICADO = "23505";

export function mensajeErrorCategoria(error, descripcion) {
  if (error?.code === ERROR_DUPLICADO) {
    return `Ya existe una categoría llamada "${descripcion}". Probá con otro nombre.`;
  }
  return error?.message || "Ocurrió un error inesperado.";
}

export async function InsertarCategorias(p) {
  try {
    const { data, error } = await supabase
      .from("categorias")
      .insert(p)
      .select();
    if (error) {
      Swal.fire({
        icon: "error",
        title:
          error.code === ERROR_DUPLICADO
            ? "Esa categoría ya existe"
            : "No se pudo crear la categoría",
        text: mensajeErrorCategoria(error, p.descripcion),
        confirmButtonColor: "#BF83FF",
      });
      return null;
    }
    Swal.fire({
      icon: "success",
      title: "Datos guardados",
      showConfirmButton: false,
      timer: 1500,
    });
    // La categoría recién creada, para poder asignarle un límite.
    return data?.[0] ?? null;
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "No se pudo crear la categoría",
      text: mensajeErrorCategoria(error, p.descripcion),
      confirmButtonColor: "#BF83FF",
    });
    return null;
  }
}
export async function MostrarCategorias(p) {
  const { data, error } = await supabase
    .from("categorias")
    .select()
    .eq("idusuario", p.idusuario)
    .eq("tipo", p.tipo)
    .order("id", { ascending: false });

  if (error) throw error;

  return data;
}

export async function EliminarCategorias(p) {
  const { error } = await supabase
    .from("categorias")
    .delete()
    .eq("idusuario", p.idusuario)
    .eq("id", p.id);

  if (error) throw error;
}

export async function EditarCategorias(p) {
  const { error } = await supabase
    .from("categorias")
    .update(p)
    .eq("idusuario", p.idusuario)
    .eq("id", p.id);

  if (error) throw error;
}

// Cuántas categorías (de gastos e ingresos) tiene la persona.
export async function ContarCategorias({ idusuario }) {
  const { count, error } = await supabase
    .from("categorias")
    .select("id", { count: "exact", head: true })
    .eq("idusuario", idusuario);

  if (error) throw error;
  return count ?? 0;
}

// Borra TODAS las categorías de la persona (sus límites se borran en cascada).
// Devuelve cuántas se borraron.
export async function EliminarTodasCategorias({ idusuario }) {
  const { data, error } = await supabase
    .from("categorias")
    .delete()
    .eq("idusuario", idusuario)
    .select("id");

  if (error) throw error;
  return data?.length ?? 0;
}
