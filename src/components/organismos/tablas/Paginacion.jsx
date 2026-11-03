import { v } from "../../../styles/variables";
import styled from "styled-components";
import { useOperaciones } from "../../../index";

export const Paginacion = ({ pagina, setPagina, maximo }) => {
  const { colorCategoria } = useOperaciones();

  const nextPage = () => {
    if (pagina < maximo) {
      setPagina(pagina + 1);
    }
  };

  const previousPage = () => {
    if (pagina > 1) {
      setPagina(pagina - 1);
    }
  };

  const inicio = () => {
    setPagina(1);
  };

  return (
    <Container $colorCategoria={colorCategoria}>
      <button onClick={inicio} disabled={pagina === 1}>
        <span><v.iconoinicio /></span>
      </button>

      <button onClick={previousPage} disabled={pagina === 1}>
        <span className="iconoIzquierda">
          <v.iconoFlechabajo />
        </span>
      </button>

      <span>{pagina}</span>
      <p>de {maximo}</p>

      <button onClick={nextPage} disabled={pagina >= maximo}>
        <span className="iconoDerecha">
          <v.iconoFlechabajo />
        </span>
      </button>
    </Container>
  );
};


const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;

  button {
    background-color: ${(props) => props.$colorCategoria};
    border: none;
    padding: 5px 10px;
    border-radius: 3px;
    height: 40px;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    text-align: center;
    transition: 0.3s;

    &:hover {
      box-shadow: 0px 10px 15px -3px ${(props) => props.$colorCategoria};
    }

    span {
      color: #fff;
      display: flex;

      svg {
        font-size: 15px;
        font-weight: 800;
      }
    }

    .iconoIzquierda {
      transform: rotate(90deg);
    }

    .iconoDerecha {
      transform: rotate(-90deg);
    }
  }

  button[disabled] {
    background-color: #646464;
    cursor: no-drop;
    box-shadow: none;
  }
`;
