import styled from "styled-components";
import { v } from "../../styles/variables";
export function TarjetaResumen({ titulo, valor, color, detalle, insignia, filas }) {
  return (
    <Container $color={color} $ancha={!!filas}>
      <div className="encabezado">
        <span className="titulo">{titulo}</span>
        {insignia && <span className="insignia">{insignia}</span>}
      </div>
      {valor !== undefined && <strong className="valor">{valor}</strong>}
      {filas && (
        <ul className="filas">
          {filas.map((f) => (
            <li key={f.texto}>
              <span>{f.texto}</span>
              <strong style={{ color: f.color }}>{f.valor}</strong>
            </li>
          ))}
        </ul>
      )}
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

  /* En celular y tablet, la card con filas ocupa todo el ancho (queda debajo de las otras). */
  @media (max-width: ${v.bphomer}) {
    ${(props) => (props.$ancha ? "grid-column: 1 / -1;" : "")}
  }

  .encabezado {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }
  .filas {
    list-style: none;
    margin: 2px 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;

    li {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      justify-content: space-between;
      gap: 2px 12px;
    }
    span {
      font-size: 0.85em;
      color: ${({ theme }) => theme.colorSubtitle};
    }
    strong {
      font-size: 1.1em;
      overflow-wrap: anywhere;
    }
  }
  .insignia {
    padding: 2px 10px;
    border-radius: 999px;
    font-size: 0.75em;
    font-weight: 600;
    white-space: nowrap;
    color: #18121f;
    background: ${(props) => props.$color || props.theme.primary};
  }
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
