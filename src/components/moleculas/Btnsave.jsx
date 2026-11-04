import styled from "styled-components";
import { v } from "../../index";

export function Btnsave({ funcion, titulo, bgcolor, icono }) {
  return (
    <Container
      type="submit"
      onClick={funcion}
      $bgcolor={bgcolor || v.colorPrincipal}
    >
      {icono}
      <span>{titulo}</span>
    </Container>
  );
}

const Container = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;

  padding: 12px 28px;
  border: none;
  border-radius: 10px;

  background: ${(props) => props.$bgcolor};
  color: #18121f;

  font-size: 15px;
  font-weight: 600;
  cursor: pointer;

  transition: background 0.2s ease, transform 0.2s ease;

  &:hover {
    filter: brightness(1.08);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;