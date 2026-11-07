import styled from "styled-components";
import { ConfiguracionTemplate } from "../index";
export function Configuracion() {
  return (
    <Container>
      <ConfiguracionTemplate />
    </Container>
  );
}
const Container = styled.main`
 width: 100%;
 min-width: 0;
`;