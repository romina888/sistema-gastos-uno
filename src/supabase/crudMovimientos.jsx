import { supabase } from "./supabase.config";

// En la base, cada usuario tiene una o más "cuentas" (tabla cuenta) y cada
// movimiento pertenece a una cuenta (columna idcuenta). Por eso, para traer
// los movimientos de una persona, primero buscamos sus cuentas.
export async function MostrarCuentas({ idusuario }) {
  const { data, error } = await supabase
    .from("cuenta")
    .select()
    .eq("idusuario", idusuario)
    .order("id", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

// Movimientos del usuario entre dos fechas.
// desde se incluye, hasta NO se incluye (formato "AAAA-MM-DD").
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

export async function InsertarMovimientos(p) {
  const { error } = await supabase.from("movimientos").insert(p);
  if (error) throw error;
}

export async function EditarMovimientos(p) {
  const { id, idcuenta, ...cambios } = p;
  const { error } = await supabase
    .from("movimientos")
    .update(cambios)
    .eq("id", id)
    .eq("idcuenta", idcuenta);
  if (error) throw error;
}

export async function EliminarMovimientos({ id, idcuenta }) {
  const { error } = await supabase
    .from("movimientos")
    .delete()
    .eq("id", id)
    .eq("idcuenta", idcuenta);
  if (error) throw error;
}

// Todas las categorías del usuario (gastos e ingresos), para mostrar
// nombre, icono y color de cada movimiento.
export async function MostrarTodasCategorias({ idusuario }) {
  const { data, error } = await supabase
    .from("categorias")
    .select()
    .eq("idusuario", idusuario)
    .order("descripcion", { ascending: true });

  if (error) throw error;
  return data ?? [];
}
