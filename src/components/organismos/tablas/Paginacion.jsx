
import React, { useState } from "react";
import { v } from "../../../styles/variables";
import styled from "styled-components";
import { useOperaciones } from "../../../index";

export const Paginacion = ({ pagina, setPagina, maximo }) => {
  const { bgCategoria, colorCategoria } = useOperaciones();
  const [input, setInput] = useState(1);

  const nextPage = () => {
    setInput(parseInt(input) + 1);
    setPagina(parseInt(pagina) + 1);
  };

  const previousPage = () => {
    setInput(parseInt(input) - 1);
    setPagina(parseInt(pagina) - 1);
  };

  const inicio = () => {
    setInput(1);
    setPagina(1);
  };

  return (
    <Container $bgCategoria={bgCategoria} $colorCategoria={colorCategoria}>
      <button onClick={inicio}>
        <span><v.iconoinicio /></span>
      </button>

      <button disabled={pagina === 1 || pagina < 1} onClick={previousPage}>
        <span className="iconoIzquierda"><v.iconoFlechabajo /></span>
      </button>

      <span>{input}</span>
      <p>de {Math.ceil(maximo)}</p>

      <button
        disabled={pagina >= Math.ceil(maximo)}
        onClick={nextPage}
      >
        <span className="iconoDerecha"><v.iconoFlechabajo /></span>
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
