import { supabase } from "./supabase.config";

export async function MostrarPresupuestos({ idusuario }) {
  const { data, error } = await supabase
    .from("presupuestos")
    .select()
    .eq("idusuario", idusuario);

  if (error) throw error;
  return data ?? [];
}

// Crea el límite de una categoría o lo actualiza si ya existía.
export async function GuardarPresupuesto({ idusuario, idcategoria, monto }) {
  const { error } = await supabase
    .from("presupuestos")
    .upsert({ idusuario, idcategoria, monto }, { onConflict: "idusuario,idcategoria" });

  if (error) throw error;
}

export async function EliminarPresupuesto({ id, idusuario }) {
  const { error } = await supabase
    .from("presupuestos")
    .delete()
    .eq("id", id)
    .eq("idusuario", idusuario);

  if (error) throw error;
}
