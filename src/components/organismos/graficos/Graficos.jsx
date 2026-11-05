import { useTheme } from "styled-components";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { formatearMonto } from "../../../utils/finanzas";
import { v } from "../../../styles/variables";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip
);

function opcionesBase(theme, moneda, conEjes) {
  const opciones = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: conEjes === "leyenda",
        labels: { color: theme.text },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const valor = ctx.parsed?.y ?? ctx.parsed;
            const nombre = ctx.dataset.label ? `${ctx.dataset.label}: ` : `${ctx.label}: `;
            return `${nombre}${formatearMonto(valor, moneda)}`;
          },
        },
      },
    },
  };
  if (conEjes) {
    opciones.scales = {
      x: {
        ticks: { color: theme.colorSubtitle },
        grid: { display: false },
      },
      y: {
        ticks: {
          color: theme.colorSubtitle,
          callback: (valor) => Number(valor).toLocaleString("es-AR"),
        },
        grid: { color: theme.bg4 },
      },
    };
  }
  return opciones;
}

// datos: resultado de agruparPorCategoria()
export function GraficoDona({ datos, moneda }) {
  const theme = useTheme();
  const data = {
    labels: datos.map((d) => `${d.icono} ${d.descripcion}`),
    datasets: [
      {
        data: datos.map((d) => d.valor),
        backgroundColor: datos.map((d) => d.color),
        borderColor: theme.bg2,
        borderWidth: 3,
      },
    ],
  };
  return (
    <div style={{ position: "relative", height: 300 }}>
      <Doughnut data={data} options={{ ...opcionesBase(theme, moneda, false), cutout: "62%" }} />
    </div>
  );
}

// Balance acumulado día a día.
export function GraficoLinea({ etiquetas, valores, moneda }) {
  const theme = useTheme();
  const data = {
    labels: etiquetas,
    datasets: [
      {
        label: "Balance acumulado",
        data: valores,
        borderColor: theme.primary,
        backgroundColor: `${theme.primary}33`,
        fill: true,
        tension: 0.3,
        pointRadius: 3,
      },
    ],
  };
  return (
    <div style={{ position: "relative", height: 320 }}>
      <Line data={data} options={opcionesBase(theme, moneda, true)} />
    </div>
  );
}

// Ingresos y gastos lado a lado.
export function GraficoBarras({ etiquetas, ingresos, gastos, moneda }) {
  const theme = useTheme();
  const data = {
    labels: etiquetas,
    datasets: [
      { label: "Ingresos", data: ingresos, backgroundColor: v.colorIngresos, borderRadius: 4 },
      { label: "Gastos", data: gastos, backgroundColor: v.colorGastos, borderRadius: 4 },
    ],
  };
  return (
    <div style={{ position: "relative", height: 320 }}>
      <Bar data={data} options={opcionesBase(theme, moneda, "leyenda")} />
    </div>
  );
}
