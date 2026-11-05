import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../../context/AuthContent";
import { v } from "../../styles/variables";
import { Btnsave } from "../moleculas/Btnsave";
import { Carousel } from "../moleculas/Carousel";
import { Header } from "../../index";

export function HomeTemplate() {
  const { user } = UserAuth();
  const navigate = useNavigate();
  const nombre = user?.full_name || user?.name || "";
  const [state, setState] = useState(false);

  function openUser() {
    setState(!state);
  }

  function cerrarDesplegables() {
    setState(false);
  }

  return (
    <MainContainer onClick={cerrarDesplegables}>
      
      <header className="header">
        <Header stateConfig={{ state: state, setState: openUser }} />
      </header>

      <Container>
        <section className="presentacion">
          <h1>Bienvenido {nombre}</h1>
          <p>
            Gastos - UNO te ayuda a organizar tus gastos e ingresos en un solo
            lugar. Deslizá las tarjetas para descubrir más.
          </p>
          <div className="botones">
            <Btnsave
              titulo="Ir a configuración"
              icono={<v.iconoSettings />}
              bgcolor={v.colorSecundario}
              funcion={() => navigate("/configurar")}
            />
          </div>
        </section>

        <section className="tarjetas">
          <Carousel />
        </section>
      </Container>

    </MainContainer>
  );
}

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  position: relative; 

  .header {
    padding: 16px 24px;
    display: flex;
    justify-content: flex-end;
    width: 100%;
    position: absolute; 
    top: 0;
    right: 0;
    z-index: 10;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  justify-content: center;
  gap: 40px;
  min-height: 100vh; 
  width: 100%;
  padding: 40px 20px;
  color: ${({ theme }) => theme.text};

  .presentacion {
    max-width: 450px;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 16px;

    h1 {
      font-size: 2.5rem;
      line-height: 1.2;
      margin: 0;
    }

    p {
      color: ${({ theme }) => theme.colorSubtitle};
      line-height: 1.6;
      margin: 0;
    }
  }

  .botones {
    display: flex;
    justify-content: center;
    margin-top: 8px;
  }

  @media (min-width: 48em) {
    flex-direction: row;
    gap: 60px;
    padding-bottom: 100px; 

    .presentacion {
      text-align: left;
    }

    .botones {
      justify-content: flex-start;
    }
  }
`;