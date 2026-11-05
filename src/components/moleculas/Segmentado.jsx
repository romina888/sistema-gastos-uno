import styled from "styled-components";

export function Segmentado({ opciones, valor, onChange }) {
  return (
    <Container role="tablist">
      {opciones.map((o) => (
        <button
          key={o.valor}
          type="button"
          role="tab"
          aria-selected={valor === o.valor}
          className={valor === o.valor ? "activo" : ""}
          style={valor === o.valor && o.color ? { background: o.color } : undefined}
          onClick={() => onChange(o.valor)}
        >
          {o.icono}
          <span>{o.texto}</span>
        </button>
      ))}
    </Container>
  );
}

const Container = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 4px;
  border-radius: 999px;
  background: ${({ theme }) => theme.bg3};
  border: 1px solid ${({ theme }) => theme.bg4};

  button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border: none;
    border-radius: 999px;
    background: transparent;
    color: ${({ theme }) => theme.text};
    font-size: 0.9em;
    cursor: pointer;
    transition: 0.2s;

    svg {
      font-size: 1.2em;
    }

    &:hover {
      background: ${({ theme }) => theme.bg4};
    }
  }

  .activo,
  .activo:hover {
    background: ${({ theme }) => theme.primary};
    color: #18121f;
    font-weight: 600;
  }
`;
