import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { v } from "../../../styles/variables";
import { LinksArray, SecondarylinksArray } from "../../../utils/dataEstatica";
import { SidebarCard } from "./SidebarCard";

export function Sidebar({ collapsed, onToggle, mobileOpen, onCloseMobile }) {

  const renderLinks = (links) =>
    links.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
        end={item.to === "/"}
        className="link"
        title={collapsed ? item.label : undefined}
        onClick={onCloseMobile}
      >
        <span className="icono">{item.icon}</span>
        <span className="texto">{item.label}</span>
      </NavLink>
    ));

  return (
    <>
      <Overlay
        $visible={mobileOpen}
        onClick={onCloseMobile}
        aria-hidden="true"
      />

      <Container
        $collapsed={collapsed}
        $mobileOpen={mobileOpen}
        aria-label="Menú principal"
      >
        <div className="header">
          <img className="logo" src={v.logo} alt="Logo de Gastos - UNO" />

          <span className="marca">Gastos - UNO</span>

          <button
            type="button"
            className="btnIcono btnPlegar"
            onClick={onToggle}
            aria-label={collapsed ? "Expandir menú" : "Contraer menú"}
            title={collapsed ? "Expandir menú" : "Contraer menú"}
          >
            {collapsed ? <v.icondesplegar /> : <v.iconoplegar />}
          </button>

          <button
            type="button"
            className="btnIcono btnCerrarMobile"
            onClick={onCloseMobile}
            aria-label="Cerrar menú"
          >
            <v.iconocerrar />
          </button>
        </div>

        <nav className="nav">
          {renderLinks(LinksArray)}

          <div className="separador" />

          {renderLinks(SecondarylinksArray)}
        </nav>

        <div className="tarjetaAyuda">
          {!collapsed && <SidebarCard />}
        </div>
      </Container>
    </>
  );
}

const Overlay = styled.div`
  display: none;

  @media (max-width: 48em) {
    display: ${(props) => (props.$visible ? "block" : "none")};
    position: fixed;
    inset: 0;
    z-index: 90;
    background: rgba(0, 0, 0, 0.5);
  }
`;

const Container = styled.aside`
  position: sticky;
  top: 0;
  height: 100vh;
  height: 100dvh;
  flex-shrink: 0;
  width: ${(props) =>
    props.$collapsed ? v.sidebarWidthCollapsed : v.sidebarWidth};
  padding: ${v.mdSpacing};

  display: flex;
  flex-direction: column;
  gap: ${v.mdSpacing};
  overflow-x: hidden;
  overflow-y: auto;

  background: ${(props) => props.theme.bg2};
  color: ${(props) => props.theme.text};
  border-right: 1px solid ${(props) => props.theme.bg4};
  transition: width 0.25s ease;

  .header {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 44px;
  }

  .logo {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    object-fit: contain;
  }

  .marca {
    flex: 1;
    font-size: ${(props) => props.theme.fontlg};
    font-weight: 700;
    white-space: nowrap;
  }

  .btnIcono {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    border: none;
    border-radius: ${v.borderRadius};
    background: transparent;
    color: ${(props) => props.theme.text};
    font-size: 1.3em;
    cursor: pointer;

    &:hover {
      background: ${(props) => props.theme.bg4};
    }
  }

  .btnCerrarMobile {
    display: none;
  }

  .nav {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .separador {
    height: 1px;
    margin: 12px 0;
    background: ${(props) => props.theme.bg4};
  }

  .link {
    display: flex;
    align-items: center;
    gap: 14px;
    width: 100%;
    min-height: 44px;
    padding: 0 12px;

    border: none;
    border-radius: 10px;
    background: transparent;
    color: ${(props) => props.theme.colorSubtitle};
    font-size: ${(props) => props.theme.fontmd};
    font-weight: 500;
    text-decoration: none;
    white-space: nowrap;
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease;

    &:hover {
      background: ${(props) => props.theme.bg4};
      color: ${(props) => props.theme.text};
    }

    &:focus-visible {
      outline: 2px solid ${(props) => props.theme.primary};
      outline-offset: 2px;
    }

    &.active {
      background: ${(props) => props.theme.bg5}20;
      color: ${(props) => props.theme.primary};
      font-weight: 600;
      box-shadow: inset 3px 0 0 ${(props) => props.theme.primary};
    }
  }

  .icono {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-size: ${(props) => props.theme.sizeoficon};
  }

  .tarjetaAyuda {
    margin-top: auto;
  }

  .pie {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding-top: ${v.mdSpacing};
    border-top: 1px solid ${(props) => props.theme.bg4};
  }

  .salir:hover {
    color: ${v.colorError};
  }

  .usuario {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 6px;
    min-height: 48px;
  }

  .avatar {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    border-radius: 50%;
    object-fit: cover;
  }

  .avatarVacio {
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${(props) => props.theme.bg4};
    font-size: 1.4em;
  }

  .nombre {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: ${(props) => props.theme.fontsm};
    font-weight: 600;
  }

  ${(props) =>
    props.$collapsed &&
    `
      .marca,
      .texto,
      .nombre {
        display: none;
      }

      .header {
        flex-direction: column;
        justify-content: center;
        gap: 8px;
      }

      .link {
        justify-content: center;
        padding: 0;
      }

      .usuario {
        justify-content: center;
      }
    `}

  @media (max-width: 48em) {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    width: min(${v.sidebarWidth}, 85vw);
    transform: translateX(
      ${(props) => (props.$mobileOpen ? "0" : "-100%")}
    );
    transition: transform 0.25s ease;

    .btnPlegar {
      display: none;
    }

    .btnCerrarMobile {
      display: flex;
    }

    .marca,
    .texto,
    .nombre {
      display: block;
    }

    .header {
      flex-direction: row;
    }

    .link {
      justify-content: flex-start;
      padding: 0 12px;
    }

    .usuario {
      justify-content: flex-start;
    }
  }
`;
