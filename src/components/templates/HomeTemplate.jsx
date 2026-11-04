import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../../context/AuthContent";
import { v } from "../../styles/variables";
import { Btnsave } from "../moleculas/Btnsave";
import { Carousel } from "../moleculas/Carousel";

// Pantalla de bienvenida: saludo, una breve descripción y el carrusel de tarjetas.
export function HomeTemplate() {
  const { user } = UserAuth();
  const navigate = useNavigate();
  const nombre = user?.full_name || user?.name || "";

  return (
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
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  justify-content: center;
  gap: 40px;
  min-height: 70vh;
  color: ${({ theme }) => theme.text};

  .presentacion {
    max-width: 420px;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 16px;

    h1 {
      font-size: 2rem;
      line-height: 1.2;
    }

    p {
      color: ${({ theme }) => theme.colorSubtitle};
      line-height: 1.6;
    }
  }

  .botones {
    display: flex;
    justify-content: center;
  }

  @media (min-width: 48em) {
    flex-direction: row;
    gap: 64px;

    .presentacion {
      text-align: left;
    }

    .botones {
      justify-content: flex-start;
    }
  }
`;
