import { supabase } from "../index";
import Swal from "sweetalert2";
export async function InsertarCategorias(p) {
  try {
    const { data, error } = await supabase
      .from("categorias")
      .insert(p)
      .select();
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Ya existe un registro con " + p.descripcion,
        footer: '<a href="">Agregue una nueva descripcion</a>',
      });
    }
    if (data) {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Datos guardados",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  } catch (error) {
    alert(error.error_description || error.message + " insertar categorias");
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