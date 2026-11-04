
import { supabase, ObtenerIdAuthSupabase } from "../index";
import Swal from "sweetalert2";

export const InsertarUsuarios = async (p) => {
  const { data, error } = await supabase
    .from("usuarios")
    .upsert(p, {
      onConflict: "idauth_supabase",
      ignoreDuplicates: true,
    })
    .select();

  if (error) {
    console.error("Error al insertar usuario:", error);
    throw error;
  }

  return data;
};

export const MostrarUsuarios = async () => {
  try {
    const idAuthSupabase = await ObtenerIdAuthSupabase();

    const { error, data } = await supabase
      .from("usuarios")
      .select()
      .eq("idauth_supabase", idAuthSupabase)
      .maybeSingle();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error al mostrar usuario:", error);
    throw error;
  }
};

export async function EditarTemaMonedaUser(p) {
  try {
    const { error } = await supabase
      .from("usuarios")
      .update(p)
      .eq("id", p.id);

    if (error) throw error;

    Swal.fire({
      icon: "success",
      title: "Datos modificados",
      showConfirmButton: false,
      timer: 1500,
    });
  } catch (error) {
    console.error("Error al editar usuario:", error);
    throw error;
  }
}
