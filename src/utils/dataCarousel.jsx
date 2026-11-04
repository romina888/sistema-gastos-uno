import { FaWallet } from "react-icons/fa";
import { v } from "../styles/variables";

// Tarjetas del carrusel de la pantalla de bienvenida: imágenes con un lema.
// Para agregar o quitar una tarjeta alcanza con modificar esta lista.
//  - titulo:  lema que se muestra en la tarjeta
//  - icono:   ícono (componente de react-icons)
//  - colores: los dos colores del degradé de fondo
export const CarouselData = [
  {
    titulo: "Siempre puntual",
    icono: v.iconocheck,
    colores: ["#7E3FD1", "#4B1FA3"],
  },
  {
    titulo: "Tranquilidad",
    icono: v.emoji,
    colores: ["#1FA37A", "#0F6E52"],
  },
  {
    titulo: "Reportes",
    icono: v.iconobars,
    colores: ["#2B7DE9", "#1B4FA8"],
  },
  {
    titulo: "Billetera",
    icono: FaWallet,
    colores: ["#E5436B", "#A3174A"],
  },
];
