import styled from "styled-components";
import { v } from "../../index";

export function Selector({ color, state, funcion, texto1, texto2, icono }) {
  return (
    <Container color={color} onClick={funcion}>
      <div className="valor">
        {icono && <span className="selectorIcono">{icono}</span>}

        <span>{texto1}</span>

        {texto2 && <span>{texto2}</span>}
      </div>

      <span className={state ? "open" : "close"}>
        <v.iconoFlechabajo />
      </span>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 12px 16px;
  min-width: 220px;
  border: 1px solid ${(props) => props.color};
  border-radius: 10px;
  background: ${({ theme }) => theme.bg2};
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(props) => props.color};
    background: ${({ theme }) => theme.bg4};
  }

  .valor {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .selectorIcono {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: ${({ theme }) => theme.primary};
  }

  .open,
  .close {
    display: flex;
    align-items: center;
    transition: transform 0.2s ease;
  }

  .open {
    transform: rotate(180deg);
  }

  .close {
    transform: rotate(0deg);
  }
`;