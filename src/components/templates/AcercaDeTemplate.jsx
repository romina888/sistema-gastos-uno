import { useState } from "react";
import styled from "styled-components";
import { v } from "../../styles/variables";
import { FaWallet, FaReact, FaDatabase, FaEnvelope } from "react-icons/fa";
import { SiVite, SiStyledcomponents, SiSupabase } from "react-icons/si";
import { Header } from "../../index"; // Lo importamos del index global como hacen tus compañeros

export function AcercaDeTemplate() {
  // 👇 1. Los mismos estados que usa Categorías
  const [state, setState] = useState(false);

  // 👇 2. La función que abre y cierra el menú
  function openUser() {
    setState(!state);
  }

  // 👇 3. La función que cierra el menú al hacer clic en el fondo
  function cerrarDesplegables() {
    setState(false);
  }

  return (
    // 👇 4. El Container principal con el onClick
    <Container onClick={cerrarDesplegables}>
      
      {/* 👇 5. El Header con los mismos props que en Categorías */}
      <header className="header">
        <Header stateConfig={{ state: state, setState: openUser }} />
      </header>

      {/* 👇 6. El contenido de tu sección (envuelto para que no choque con el Container) */}
      <ContenidoAcerca>
        <HeaderSection>
          <LogoContainer>
            <FaWallet size={60} color="#61D37D" /> 
          </LogoContainer>
          <h1>Gastos - UNO</h1>
          <Version>Versión 1.0.0</Version>
          <Description>
            Gastos - UNO es una aplicación diseñada para ayudarte a gestionar tus finanzas personales de manera sencilla, rápida y segura. Controlá tus ingresos, egresos y categorías en un solo lugar.
          </Description>
        </HeaderSection>

        <SectionTitle>Tecnologías Utilizadas</SectionTitle>
        <TechGrid>
          <TechCard>
            <FaReact size={30} color="#61DAFB" />
            <span>React</span>
          </TechCard>
          <TechCard>
            <SiVite size={30} color="#646CFF" />
            <span>Vite</span>
          </TechCard>
          <TechCard>
            <SiStyledcomponents size={30} color="#DB7093" />
            <span>Styled Components</span>
          </TechCard>
          <TechCard>
            <SiSupabase size={30} color="#3ECF8E" />
            <span>Supabase</span>
          </TechCard>
          <TechCard>
            <FaDatabase size={30} color="#764ABC" />
            <span>Zustand</span>
          </TechCard>
          <TechCard>
            <FaDatabase size={30} color="#61D37D" />
            <span>PostgreSQL</span>
          </TechCard>
        </TechGrid>

        <SectionTitle>Créditos y Soporte</SectionTitle>
        <FooterSection>
          <p>Desarrollado por <strong>Albornoz Romina, Gruppi Franco, Maurizi Gonzalo</strong></p>
          <p>© {new Date().getFullYear()} Gastos - UNO. Todos los derechos reservados.</p>
          
          <ContactButton href="mailto:soporte@gastosuno.com">
            <FaEnvelope size={18} />
            Contactar a Soporte
          </ContactButton>
        </FooterSection>
      </ContenidoAcerca>
    </Container>
  );
}

// --- ESTILOS ---

// 👇 IMPORTANTE: Le damos la misma estructura que Categorías
const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;

  .header {
    /* Ajustá este padding según lo que usen en Categorías si querés que sea idéntico */
    padding: 16px 24px; 
    display: flex;
    justify-content: flex-end;
  }
`;

// Acá metemos el diseño original de Acerca de pero con max-width
const ContenidoAcerca = styled.div`
  width: 100%;
  max-width: 75em;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  animation: fadeIn 0.5s ease-in-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const HeaderSection = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: ${({ theme }) => theme.bg2};
  padding: 40px 20px;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.bg4};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);

  h1 {
    font-size: 2rem;
    margin: 16px 0 8px;
    color: ${({ theme }) => theme.text};
  }
`;

const LogoContainer = styled.div`
  background: ${({ theme }) => theme.bg4}80;
  padding: 20px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Version = styled.span`
  font-size: 0.9rem;
  background: ${({ theme }) => theme.bg4}80;
  padding: 4px 12px;
  border-radius: 20px;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.primary};
  font-weight: 600;
`;

const Description = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  max-width: 600px;
  color: ${({ theme }) => theme.colorSubtitle};
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 16px;
  border-bottom: 2px solid ${({ theme }) => theme.bg4};
  padding-bottom: 8px;

  @media (min-width: ${v.bpbart}) {
    font-size: 1.8rem;
  }
`;

const TechGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (min-width: ${v.bpbart}) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: ${v.bphomer}) {
    grid-template-columns: repeat(6, 1fr);
  }
`;

const TechCard = styled.div`
  background: ${({ theme }) => theme.bg2};
  border: 1px solid ${({ theme }) => theme.bg4};
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
    border-color: ${({ theme }) => theme.primary};
  }

  span {
    font-size: 0.9rem;
    font-weight: 600;
    text-align: center;
  }
`;

const FooterSection = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
  background: ${({ theme }) => theme.bg2};
  padding: 32px 20px;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.bg4};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);

  p {
    color: ${({ theme }) => theme.colorSubtitle};
    font-size: 0.9rem;
  }
`;

const ContactButton = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.bg};
  border: 1px solid ${({ theme }) => theme.primary};
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.8;
    transform: translateY(-2px);
  }
`;