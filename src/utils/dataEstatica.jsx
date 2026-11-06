import { v } from "../styles/variables";
import { AiOutlineHome, AiOutlineApartment, AiOutlineSetting, } from "react-icons/ai";
import { MdOutlineAnalytics } from "react-icons/md";
import {RiDashboard3Line} from "react-icons/ri"
import {TbPig} from "react-icons/tb"

export const DesplegableUser = [
  {
    text: "Configuracion",
    icono: <v.iconoSettings/>,
    tipo: "configuracion",
  },
  {
    text: "Cerrar sesión",
    icono: <v.iconoCerrarSesion/>,
    tipo: "cerrarsesion",
  },
];
export const DataDesplegableTipo = [
  {
    text: "Categorias gastos",
    color:  v.colorGastos,
    tipo: "g",
    bgcolor:  v.colorbgGastos,
  },
  {
    text: "Categorias ingresos",
    color: v.colorIngresos,
    tipo: "i",
    bgcolor:  v.colorbgingresos,
  },
];

// Enlaces principales del Sidebar
export const LinksArray = [
  { label: "Home", icon: <v.iconoinicio />, to: "/" },
  { label: "Categorías", icon: <v.iconocategorias />, to: "/categorias" },
  { label: "Movimientos", icon: <v.iconomovimientos />, to: "/movimientos" },
  { label: "Presupuestos", icon: <v.iconopresupuestos />, to: "/presupuestos" },
  { label: "Informes", icon: <v.iconoreportes />, to: "/informes" },
  { label: "Dashboard", icon: <v.iconolineal />, to: "/dashboard" },
];

// Enlaces secundarios del Sidebar
export const SecondarylinksArray = [
  { label: "Configuración", icon: <v.iconoSettings />, to: "/configurar" },
  { label: "Acerca de", icon: <v.iconoayuda />, to: "/acerca-de" },
];

// Opciones de temas
export const TemasData = [
  {
    descripcion: "light",
    tema: "light",
    icono: <v.iconosol />,
  },
  {
    descripcion: "dark",
    tema: "dark",
    icono: <v.iconoluna />,
  },
];