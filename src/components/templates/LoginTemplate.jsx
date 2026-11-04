import styled from "styled-components";
import { Btnsave, v, useAuthStore } from "../../index";

export function LoginTemplate() {
  const { signInWithGoogle } = useAuthStore();
  return (
    <Container>
      <div className="glow glowPurple" />
      <div className="glow glowBlue" />

      <div className="contentCard">
        <span className="version">versión 1.0</span>
        
        <div className="contentImg">
          <img src={v.logo} alt="Logo de Gastos - UNO" />
        </div>

        <Titulo>Gastos - UNO</Titulo>

        <p className="frase">
          Organizá tus gastos e ingresos
        </p>

        <div className="divider" />

        <p className="loginText">
          Ingresá para continuar
        </p>

        <ContainerBtn>
          <Btnsave
            titulo="Continuar con Google"
            icono={<v.iconogoogle />}
            bgcolor={v.colorSecundario} 
            funcion={signInWithGoogle}
          />
        </ContainerBtn>

        <p className="footerText">
          Tu información queda protegida
        </p>
      </div>
    </Container>
  );
}

const Container = styled.main`
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
  box-sizing: border-box;
  padding: 24px;

  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;
  isolation: isolate;
  overflow: hidden;

  background: #0b0c10;
  color: #e5e7eb;
  font-family: "Inter", sans-serif;

  .glow {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    pointer-events: none;
    z-index: -1;
  }

  .glowPurple {
    width: 400px;
    height: 400px;
    top: 10%;
    left: 10%;
    background: rgba(147, 51, 234, 0.10);
  }

  .glowBlue {
    width: 300px;
    height: 300px;
    right: 10%;
    bottom: 10%;
    background: rgba(37, 99, 235, 0.10);
  }

  .contentCard {
    width: 100%;
    max-width: 400px;
    box-sizing: border-box;
    padding: 40px;

    display: flex;
    flex-direction: column;
    align-items: center;

    position: relative;
    z-index: 1;

    background: #13151a;
    border: 1px solid #292c34;
    border-radius: 32px;

    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35);

    .version {
      width: 100%;
      margin-bottom: 24px;
      color: #6b7280;
      font-size: 0.75rem;
      font-weight: 500;
      letter-spacing: 0.05em;
    }

    .contentImg {
  width: 80px;
  height: 80px;
  margin-bottom: 24px;
  padding: 12px;
  box-sizing: border-box;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(168, 85, 247, 0.10);
  border: 1px solid rgba(168, 85, 247, 0.20);
  border-radius: 16px;

  box-shadow: 0 0 15px rgba(168, 85, 247, 0.15);

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

    .frase {
      margin: 0 0 32px;
      color: #9ca3af;
      font-size: 0.875rem;
      text-align: center;
      line-height: 1.6;
    }

    .divider {
      width: 100%;
      height: 1px;
      margin-bottom: 24px;
      background: #292c34;
    }

    .loginText {
      margin: 0 0 16px;
      color: #9ca3af;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .footerText {
      margin: 24px 0 0;
      color: #6b7280;
      font-size: 0.75rem;
      font-weight: 500;
      text-align: center;
    }
  }

  @media (max-width: 480px) {
    padding: 18px;

    .contentCard {
      padding: 32px 24px;
      border-radius: 28px;
    }

    .glowPurple {
      left: -180px;
    }

    .glowBlue {
      right: -180px;
    }
  }

  @media (max-width: 350px) {
    padding: 12px;

    .contentCard {
      padding: 28px 18px;
    }
  }
`;

const Titulo = styled.h1`
  margin: 0 0 8px;
  color: #ffffff;
  font-size: clamp(1.7rem, 7vw, 1.875rem);
  font-weight: 700;
  letter-spacing: 0.02em;
  line-height: 1.25;
  text-align: center;
`;
 
const ContainerBtn = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;

  > * {
    width: 100%;
  }
`;
