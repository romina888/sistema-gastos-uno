import styled from "styled-components";
import { v } from "../../../styles/variables";

export function SidebarCard() {
  return (
    <Container>
      <div className="iconoDecorativo">
        <v.iconoayuda />
      </div>

      <h4>Centro de ayuda</h4>

      <p>¿Necesitás soporte?</p>

      <button type="button">
        Contactar
      </button>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  overflow: hidden;
  padding: 16px;
  border-radius: 16px;
  border: 1px solid ${(props) => props.theme.primary}40;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.primary}35,
    ${(props) => props.theme.bg5}10
  );

  h4 {
    position: relative;
    z-index: 1;
    margin: 0 0 6px;
    color: ${(props) => props.theme.text};
    font-size: ${(props) => props.theme.fontmd};
    font-weight: 600;
  }

  p {
    position: relative;
    z-index: 1;
    margin: 0 0 12px;
    color: ${(props) => props.theme.colorSubtitle};
    font-size: ${(props) => props.theme.fontxs};
  }

  .iconoDecorativo {
    position: absolute;
    top: -8px;
    right: -5px;
    font-size: 4em;
    color: ${(props) => props.theme.primary};
    opacity: 0.12;
  }

button {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 10px;
  background: ${(props) =>
    props.theme === undefined ? "#7E3FD1" : props.theme.primary};
  color: #FFFFFF;
  font-weight: 700;
  font-size: ${(props) => props.theme.fontxs};
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${(props) => props.theme.bg5};
    color: #FFFFFF;
  }
}
`;
