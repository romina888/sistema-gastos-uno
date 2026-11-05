import { create } from "zustand";

const hoy = new Date();

export const useMovimientosStore = create((set, get) => ({
  anio: hoy.getFullYear(),
  mes: hoy.getMonth(), // 0 = enero ... 11 = diciembre

  mesAnterior: () => {
    const { anio, mes } = get();
    if (mes === 0) set({ anio: anio - 1, mes: 11 });
    else set({ mes: mes - 1 });
  },
  mesSiguiente: () => {
    const { anio, mes } = get();
    if (mes === 11) set({ anio: anio + 1, mes: 0 });
    else set({ mes: mes + 1 });
  },
  irAHoy: () => {
    const ahora = new Date();
    set({ anio: ahora.getFullYear(), mes: ahora.getMonth() });
  },
}));
