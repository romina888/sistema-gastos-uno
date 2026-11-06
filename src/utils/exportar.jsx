import {
  MESES,
  esConfirmado,
  formatearFecha,
  formatearMonto,
  hoyISO,
  resumen,
} from "./finanzas";

// Texto seguro para el PDF: las fuentes estándar no dibujan emojis ni símbolos raros.
const soloLatin1 = (t) => String(t ?? "").replace(/[^\u0000-ÿ]/g, "").trim();

function fila(m, categoriaPorId) {
  const cat = categoriaPorId.get(m.idcategoria);
  return {
    fecha: formatearFecha(m.fecha),
    tipo: m.tipo === "i" ? "Ingreso" : "Gasto",
    categoria: cat?.descripcion ?? "Sin categoría",
    descripcion: m.descripcion ?? "",
    estado: esConfirmado(m) ? "Confirmado" : "Pendiente",
    valor: Number(m.valor) * (m.tipo === "i" ? 1 : -1),
  };
}

function descargar(blob, nombreArchivo) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombreArchivo;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function nombreArchivoMovimientos(anio, mes, extension) {
  return `movimientos-${anio}-${String(mes + 1).padStart(2, "0")}.${extension}`;
}

// CSV pensado para abrirse en Excel en español (separador ";" y coma decimal).
export function exportarCSV({ movimientos, categoriaPorId, anio, mes }) {
  const celda = (t) => `"${String(t ?? "").replace(/"/g, '""')}"`;
  const encabezado = ["Fecha", "Tipo", "Categoría", "Descripción", "Estado", "Monto"];
  const lineas = movimientos.map((m) => {
    const f = fila(m, categoriaPorId);
    return [
      f.fecha,
      f.tipo,
      f.categoria,
      f.descripcion,
      f.estado,
      f.valor.toFixed(2).replace(".", ","),
    ]
      .map(celda)
      .join(";");
  });
  const texto = [encabezado.map(celda).join(";"), ...lineas].join("\r\n");
  // El "﻿" del principio hace que Excel reconozca los acentos.
  descargar(
    new Blob(["﻿" + texto], { type: "text/csv;charset=utf-8" }),
    nombreArchivoMovimientos(anio, mes, "csv")
  );
}

export async function exportarPDF({ movimientos, categoriaPorId, moneda, anio, mes }) {
  // Se carga recién al exportar para no hacer pesada la app al inicio.
  const { jsPDF } = await import("jspdf");
  // jspdf-autotable se expone de formas distintas según cómo lo empaquete Vite,
  // así que buscamos la función en los lugares posibles.
  const modulo = await import("jspdf-autotable");
  const funcionTabla = [
    modulo.default,
    modulo.default?.default,
    modulo.autoTable,
    modulo.default?.autoTable,
  ].find((f) => typeof f === "function");
  const autoTable = (doc, opciones) =>
    funcionTabla ? funcionTabla(doc, opciones) : doc.autoTable(opciones);

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const { ingresos, gastos, balance } = resumen(movimientos.filter(esConfirmado));
  const dinero = (n) => soloLatin1(formatearMonto(n, moneda));

  doc.setFontSize(18);
  doc.text(`Movimientos - ${MESES[mes]} ${anio}`, 40, 50);
  doc.setFontSize(10);
  doc.setTextColor(110);
  doc.text(`Gastos - UNO · generado el ${formatearFecha(hoyISO())}`, 40, 68);
  doc.setTextColor(0);

  doc.setFontSize(11);
  doc.text(`Ingresos: ${dinero(ingresos)}`, 40, 92);
  doc.text(`Gastos: ${dinero(gastos)}`, 220, 92);
  doc.text(`Balance: ${dinero(balance)}`, 380, 92);
  doc.setFontSize(8);
  doc.setTextColor(110);
  doc.text("Los totales cuentan solo los movimientos confirmados.", 40, 108);
  doc.setTextColor(0);

  autoTable(doc, {
    startY: 120,
    head: [["Fecha", "Tipo", "Categoria", "Descripcion", "Estado", "Monto"]],
    body: movimientos.map((m) => {
      const f = fila(m, categoriaPorId);
      return [
        f.fecha,
        f.tipo,
        soloLatin1(f.categoria),
        soloLatin1(f.descripcion),
        f.estado,
        dinero(f.valor),
      ];
    }),
    styles: { fontSize: 9 },
    headStyles: { fillColor: [126, 63, 209] },
    columnStyles: { 5: { halign: "right" } },
  });

  doc.save(nombreArchivoMovimientos(anio, mes, "pdf"));
}
