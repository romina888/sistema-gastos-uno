import { Routes, Route } from "react-router-dom";
import {
  Login,
  Home,
  Layout,
  ProtectedRoute,
  UserAuth,
  Configuracion,
  Categorias,
  AcercaDe,
} from "../index";

export function MyRoutes() {
  const { user } = UserAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute user={user} redirectTo="/login" />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/configurar" element={<Configuracion />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/acerca-de" element={<AcercaDe />} /> 
        </Route>
      </Route>
    </Routes>
  );
}