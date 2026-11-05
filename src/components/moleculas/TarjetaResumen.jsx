import styled from "styled-components";

// Tarjeta con un título chico y un número grande (ej: "Gastos  $ 1.200,00").
export function TarjetaResumen({ titulo, valor, color, detalle }) {
  return (
    <Container $color={color}>
      <span className="titulo">{titulo}</span>
      <strong className="valor">{valor}</strong>
      {detalle && <span className="detalle">{detalle}</span>}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.bg4};
  border-left: 5px solid ${(props) => props.$color || props.theme.primary};
  background: ${({ theme }) => theme.bg2};

  .titulo {
    font-size: 0.85em;
    color: ${({ theme }) => theme.colorSubtitle};
  }
  .valor {
    font-size: 1.35em;
    color: ${(props) => props.$color || props.theme.text};
    overflow-wrap: anywhere;
  }
  .detalle {
    font-size: 0.8em;
    color: ${({ theme }) => theme.colorSubtitle};
  }
`;
