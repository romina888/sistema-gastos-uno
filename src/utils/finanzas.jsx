export const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const dos = (n) => String(n).padStart(2, "0");

export function hoyISO() {
  const d = new Date();
  return `${d.getFullYear()}-${dos(d.getMonth() + 1)}-${dos(d.getDate())}`;
}

export function rangoMes(anio, mes) {
  const desde = `${anio}-${dos(mes + 1)}-01`;
  const siguiente = mes === 11 ? `${anio + 1}-01-01` : `${anio}-${dos(mes + 2)}-01`;
  return { desde, hasta: siguiente }; // "hasta" no se incluye
}

export function rangoAnio(anio) {
  return { desde: `${anio}-01-01`, hasta: `${anio + 1}-01-01` };
}

export function diasDelMes(anio, mes) {
  return new Date(anio, mes + 1, 0).getDate();
}

export function formatearFecha(fecha) {
  if (!fecha) return "";
  const [a, m, d] = String(fecha).slice(0, 10).split("-");
  return `${d}/${m}/${a}`;
}

export function formatearMonto(valor, moneda = "$") {
  const n = Number(valor) || 0;
  const texto = Math.abs(n).toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${n < 0 ? "-" : ""}${moneda} ${texto}`;
}

export const ESTADO_CONFIRMADO = "1";
export const ESTADO_PENDIENTE = "0";

export function esConfirmado(movimiento) {
  return String(movimiento.estado) === ESTADO_CONFIRMADO;
}

export function resumen(movimientos = []) {
  let ingresos = 0;
  let gastos = 0;
  for (const m of movimientos) {
    if (m.tipo === "i") ingresos += Number(m.valor);
    else if (m.tipo === "g") gastos += Number(m.valor);
  }
  return { ingresos, gastos, balance: ingresos - gastos };
}

export function agruparPorCategoria(movimientos = [], tipo, categorias = []) {
  const porId = new Map(categorias.map((c) => [c.id, c]));
  const acumulado = new Map();
  let total = 0;

  for (const m of movimientos) {
    if (m.tipo !== tipo) continue;
    const clave = m.idcategoria ?? "sin";
    acumulado.set(clave, (acumulado.get(clave) || 0) + Number(m.valor));
    total += Number(m.valor);
  }

  return [...acumulado.entries()]
    .map(([clave, valor]) => {
      const cat = porId.get(clave);
      return {
        id: clave,
        descripcion: cat?.descripcion ?? "Sin categoría",
        icono: cat?.icono ?? "❔",
        color: cat?.color ?? "#9E9E9E",
        valor,
        porcentaje: total > 0 ? (valor / total) * 100 : 0,
      };
    })
    .sort((a, b) => b.valor - a.valor);
}

export function serieDiaria(movimientos = [], anio, mes) {
  const cantidad = diasDelMes(anio, mes);
  const ingresos = Array(cantidad).fill(0);
  const gastos = Array(cantidad).fill(0);

  for (const m of movimientos) {
    const dia = parseInt(String(m.fecha).slice(8, 10), 10) - 1;
    if (dia < 0 || dia >= cantidad) continue;
    if (m.tipo === "i") ingresos[dia] += Number(m.valor);
    else if (m.tipo === "g") gastos[dia] += Number(m.valor);
  }

  let corrida = 0;
  const balanceAcumulado = ingresos.map((ing, i) => {
    corrida += ing - gastos[i];
    return corrida;
  });

  return {
    dias: Array.from({ length: cantidad }, (_, i) => String(i + 1)),
    ingresos,
    gastos,
    balanceAcumulado,
  };
}

export function serieMensual(movimientos = []) {
  const ingresos = Array(12).fill(0);
  const gastos = Array(12).fill(0);

  for (const m of movimientos) {
    const mes = parseInt(String(m.fecha).slice(5, 7), 10) - 1;
    if (mes < 0 || mes > 11) continue;
    if (m.tipo === "i") ingresos[mes] += Number(m.valor);
    else if (m.tipo === "g") gastos[mes] += Number(m.valor);
  }

  return { ingresos, gastos };
}
