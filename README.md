# Gastos - UNO

Aplicación web para llevar el control de tus finanzas personales: registrá
ingresos y gastos, organizalos en categorías, poné límites mensuales y mirá
en qué se va tu plata con informes y gráficos.

## Funcionalidades

- **Inicio de sesión con Google** (Supabase Auth).
- **Home** con el resumen del mes: balance, ingresos, gastos y ahorro, con
  comparación contra el mes anterior, estado de los límites, pendientes y
  gastos por categoría.
- **Movimientos**: alta, edición y baja de ingresos y gastos, filtros
  (todos, gastos, ingresos, pendientes), búsqueda, paginación y exportación a
  CSV y PDF. Los movimientos pendientes (por pagar o por cobrar) no se suman a
  los totales hasta confirmarlos, y se pueden marcar como pagados con un clic.
- **Categorías**: categorías de gastos e ingresos con icono y color. En las de
  gastos se puede definir un límite mensual. No permite nombres repetidos.
- **Presupuestos**: límite mensual por categoría con barra de progreso. La app
  avisa al llegar al 80 % y al superar el límite.
- **Informes** y **Dashboard**: gráficos por categoría, evolución y por día.
- **Configuración**: perfil, moneda, tema claro u oscuro, y una zona de peligro
  para borrar todos los movimientos o todas las categorías.

## Tecnologías

- [React](https://react.dev/) 19 + [Vite](https://vite.dev/)
- [Supabase](https://supabase.com/) (base de datos PostgreSQL y autenticación)
- [TanStack Query](https://tanstack.com/query) para los datos del servidor
- [Zustand](https://zustand-demo.pmnd.rs/) para el estado local
- [styled-components](https://styled-components.com/) para los estilos
- [React Router](https://reactrouter.com/), [React Hook Form](https://react-hook-form.com/),
  [Chart.js](https://www.chartjs.org/), [SweetAlert2](https://sweetalert2.github.io/),
  [jsPDF](https://github.com/parallax/jsPDF)

## Requisitos

- Node.js 18 o superior
- Un proyecto de Supabase con el proveedor de Google habilitado

## Instalación

```bash
git clone https://github.com/romina888/sistema-gastos-uno.git
cd sistema-gastos-uno
npm install
```

Copiá el archivo `.env.example` a `.env` y completá tus datos de Supabase
(los encontrás en *Project Settings > API*):

```env
VITE_APP_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_APP_SUPABASE_ANON_KEY=tu-clave-anon
```

Después levantá la app:

```bash
npm run dev
```

