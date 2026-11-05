import styled from "styled-components";
import { v } from "../../styles/variables";

export function SelectorPeriodo({
  etiqueta,
  onAnterior,
  onSiguiente,
  onHoy,
  textoHoy = "Hoy",
}) {
  return (
    <Container>
      <button
        type="button"
        className="flecha izquierda"
        onClick={onAnterior}
        aria-label="Período anterior"
      >
        <v.iconoFlechabajo />
      </button>

      <span className="etiqueta">{etiqueta}</span>

      <button
        type="button"
        className="flecha derecha"
        onClick={onSiguiente}
        aria-label="Período siguiente"
      >
        <v.iconoFlechabajo />
      </button>

      {onHoy && (
        <button type="button" className="hoy" onClick={onHoy}>
          {textoHoy}
        </button>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;

  .flecha {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border: 1px solid ${({ theme }) => theme.bg4};
    border-radius: 50%;
    background: ${({ theme }) => theme.bg2};
    color: ${({ theme }) => theme.text};
    cursor: pointer;
    transition: 0.2s;

    &:hover {
      border-color: ${({ theme }) => theme.primary};
      color: ${({ theme }) => theme.primary};
    }
  }
  .izquierda svg {
    transform: rotate(90deg);
  }
  .derecha svg {
    transform: rotate(-90deg);
  }

  .etiqueta {
    min-width: 160px;
    padding: 8px 18px;
    text-align: center;
    font-weight: 600;
    border: 1px solid ${({ theme }) => theme.primary};
    border-radius: 999px;
    color: ${({ theme }) => theme.primary};
  }

  .hoy {
    padding: 8px 14px;
    border: none;
    border-radius: 999px;
    background: transparent;
    color: ${({ theme }) => theme.colorSubtitle};
    text-decoration: underline;
    cursor: pointer;
  }
`;
