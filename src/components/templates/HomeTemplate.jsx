import { useState } from "react"; // 👈 1. Importás useState
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../../context/AuthContent";
import { v } from "../../styles/variables";
import { Btnsave } from "../moleculas/Btnsave";
import { Carousel } from "../moleculas/Carousel";
import { Header } from "../../index"; // 👈 2. Importás el Header

export function HomeTemplate() {
  const { user } = UserAuth();
  const navigate = useNavigate();
  const nombre = user?.full_name || user?.name || "";

  // 👇 3. Agregás los mismos estados y funciones que en Categorías/Acerca de
  const [state, setState] = useState(false);

  function openUser() {
    setState(!state);
  }

  function cerrarDesplegables() {
    setState(false);
  }

  return (
    // 👇 4. Envolvés todo en un Container principal con el onClick
    <MainContainer onClick={cerrarDesplegables}>
      
      {/* 👇 5. Agregás el header */}
      <header className="header">
        <Header stateConfig={{ state: state, setState: openUser }} />
      </header>

      {/* 👇 6. Tu diseño original va acá adentro */}
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
  /* Esto evita que el header se superponga con el scroll */
  position: relative; 

  .header {
    padding: 16px 24px;
    display: flex;
    justify-content: flex-end;
    width: 100%;
    /* Lo fijamos arriba a la derecha para que no empuje el contenido */
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
  /* 👇 Esto es clave: forzamos un alto mínimo y centramos */
  min-height: 100vh; 
  width: 100%;
  padding: 40px 20px; /* Aire a los costados y arriba/abajo */
  color: ${({ theme }) => theme.text};

  .presentacion {
    max-width: 450px; /* Un poco más ancho para que respire el texto */
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
    gap: 60px; /* Reduje un poco el gap para que no se separen tanto */
    
    /* 👇 En escritorio, subimos un poco el bloque para que no quede tan abajo */
    padding-bottom: 100px; 

    .presentacion {
      text-align: left;
    }

    .botones {
      justify-content: flex-start;
    }
  }
`;