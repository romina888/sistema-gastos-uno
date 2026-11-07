import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { CategoriasTemplate } from "../components/templates/CategoriasTemplate";
import { useCategoriasStore } from "../store/CategoriasStore";
import { useOperaciones } from "../store/OperacionesStore";
import { useUsuariosStore } from "../store/UsuariosStore";
import { useUsuarioFinanzas } from "../hooks/useFinanzas";
import { usePresupuestosUsuario } from "../hooks/usePresupuestos";

export function Categorias() {
  const { tipo } = useOperaciones();
  const { datacategoria, mostrarCategorias } = useCategoriasStore();
  const { datausuarios } = useUsuariosStore();
  const { moneda } = useUsuarioFinanzas();
  const { data: presupuestos = [] } = usePresupuestosUsuario();
  const { isLoading, error } = useQuery({
    queryKey: ["mostrar categorias", tipo],
    queryFn: () =>
      mostrarCategorias({
        idusuario: datausuarios.id,
        tipo: tipo,
      }),
  });

  return (
    <Container>
      <CategoriasTemplate
        data={datacategoria}
        presupuestos={presupuestos}
        moneda={moneda}
        cargando={isLoading}
        error={error}
      />
    </Container>
  );
}
const Container = styled.div`
  width: 100%;
  min-width: 0;
`;
