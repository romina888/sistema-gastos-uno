import { supabase } from "./supabase.config";

export async function MostrarCuentas({ idusuario }) {
  const { data, error } = await supabase
    .from("cuenta")
    .select()
    .eq("idusuario", idusuario)
    .order("id", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function MostrarMovimientos({ idusuario, desde, hasta }) {
  const cuentas = await MostrarCuentas({ idusuario });
  if (cuentas.length === 0) return [];

  const { data, error } = await supabase
    .from("movimientos")
    .select()
    .in(
      "idcuenta",
      cuentas.map((c) => c.id)
    )
    .gte("fecha", desde)
    .lt("fecha", hasta)
    .order("fecha", { ascending: false })
    .order("id", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

// Los últimos movimientos cargados (los más nuevos primero), sin importar la fecha.
export async function MostrarUltimosMovimientos({ idusuario, limite = 4 }) {
  const cuentas = await MostrarCuentas({ idusuario });
  if (cuentas.length === 0) return [];

  const { data, error } = await supabase
    .from("movimientos")
    .select()
    .in(
      "idcuenta",
      cuentas.map((c) => c.id)
    )
    .order("id", { ascending: false })
    .limit(limite);

  if (error) throw error;
  return data ?? [];
}

export async function InsertarMovimientos(p) {
  const { error } = await supabase.from("movimientos").insert(p);
  if (error) throw error;
}

export async function EditarMovimientos(p) {
  const { id, idcuenta, ...cambios } = p;
  const { data, error } = await supabase
    .from("movimientos")
    .update(cambios)
    .eq("id", id)
    .eq("idcuenta", idcuenta)
    .select();
  if (error) throw error;
  // Si Supabase bloquea el UPDATE por permisos (RLS) no da error: simplemente
  // no modifica ninguna fila. Lo avisamos para no mostrar "guardado" en falso.
  if (!data || data.length === 0) {
    throw new Error(
      "Supabase no actualizó el movimiento (revisá la política de UPDATE de la tabla movimientos)."
    );
  }
}

export async function EliminarMovimientos({ id, idcuenta }) {
  const { error } = await supabase
    .from("movimientos")
    .delete()
    .eq("id", id)
    .eq("idcuenta", idcuenta);
  if (error) throw error;
}

export async function MostrarTodasCategorias({ idusuario }) {
  const { data, error } = await supabase
    .from("categorias")
    .select()
    .eq("idusuario", idusuario)
    .order("descripcion", { ascending: true });

  if (error) throw error;
  return data ?? [];
}


// Cuántos movimientos tiene la persona (en todas sus cuentas).
export async function ContarMovimientos({ idusuario }) {
  const cuentas = await MostrarCuentas({ idusuario });
  if (cuentas.length === 0) return 0;

  const { count, error } = await supabase
    .from("movimientos")
    .select("id", { count: "exact", head: true })
    .in(
      "idcuenta",
      cuentas.map((c) => c.id)
    );

  if (error) throw error;
  return count ?? 0;
}

// Borra TODOS los movimientos de la persona. Devuelve cuántos se borraron.
export async function EliminarTodosMovimientos({ idusuario }) {
  const cuentas = await MostrarCuentas({ idusuario });
  if (cuentas.length === 0) return 0;

  const { data, error } = await supabase
    .from("movimientos")
    .delete()
    .in(
      "idcuenta",
      cuentas.map((c) => c.id)
    )
    .select("id");

  if (error) throw error;
  return data?.length ?? 0;
}
