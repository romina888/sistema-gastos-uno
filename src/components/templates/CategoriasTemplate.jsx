import styled from "styled-components";
import {
  Header,
  ContentFiltros,
  Btndesplegable,
  useOperaciones,
  ListaMenuDesplegable,
  DataDesplegableTipo,
  Btnfiltro,
  v,
  TablaCategorias,
  RegistrarCategorias
} from "../../index";
import { useState } from "react";
export function CategoriasTemplate({ data }) {
  const [openRegistro, SetopenRegistro] = useState(false);
  const [accion, setAccion] = useState("");
  const [dataSelect, setdataSelect] = useState([]);
  const [state, setState] = useState(false);
  const [stateTipo, setStateTipo] = useState(false);
  const { colorCategoria, tituloBtnDes, bgCategoria, setTipo } =
    useOperaciones();
  function cambiarTipo(p) {
  const opcionSeleccionada = DataDesplegableTipo.find(
    (item) => item.tipo === p
  );

  if (opcionSeleccionada) {
    setTipo(opcionSeleccionada);
  }

  setStateTipo(false);
  setState(false);
}

  function cerrarDesplegables() {
    setStateTipo(false);
    setState(false);
  }
  function openTipo() {
    setStateTipo(!stateTipo);
    setState(false);
  }
  function openUser() {
    setState(!state);
    setStateTipo(false);
  }
  function nuevoRegistro(){
    SetopenRegistro(!openRegistro);
    setAccion("Nuevo")
    setdataSelect([])
  }
  return (
    <Container onClick={cerrarDesplegables}>
      {openRegistro && <RegistrarCategorias dataSelect={dataSelect} onClose={()=>SetopenRegistro(!openRegistro)} accion={accion}/>}

      <header className="header">
        <Header stateConfig={{ state: state, setState: openUser }} />
      </header>

      <section className="tipo">
        <ContentFiltros>
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Btndesplegable
              textcolor={colorCategoria}
              bgcolor={bgCategoria}
              text={tituloBtnDes}
              funcion={openTipo}
            />
            {stateTipo && (
              <ListaMenuDesplegable
                data={DataDesplegableTipo}
                top="112%"
                funcion={(p) => cambiarTipo(p)}
              />
            )}
          </div>
        </ContentFiltros>
      </section>
      <section className="area2">
        <ContentFiltro>
          <Btnfiltro
          funcion={nuevoRegistro}
            bgcolor={bgCategoria}
            textcolor={colorCategoria}
            icono={<v.agregar />}
          />
        </ContentFiltro>
      </section>
      <section className="main">
        <TablaCategorias data={data} SetopenRegistro={SetopenRegistro} setdataSelect={setdataSelect} setAccion={setAccion}/>
      </section>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  min-width: 0;
  min-height: 100%;
  padding: 12px 16px 24px;
  overflow-x: hidden;
  background: ${({ theme }) => theme.bgtotal};
  color: ${({ theme }) => theme.text};

  display: grid;
  grid-template:
    "header" auto
    "tipo" auto
    "area2" auto
    "main" 1fr;
  row-gap: 16px;

  .header {
    grid-area: header;
    display: flex;
    align-items: center;
    min-width: 0;
  }

  .tipo {
    grid-area: tipo;
    display: flex;
    align-items: center;
    min-width: 0;
  }

  .area2 {
    grid-area: area2;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    min-width: 0;
  }

  .main {
    grid-area: main;
    min-width: 0;
    width: 100%;
  }

  @media (max-width: 48em) {
    padding: 10px 12px 20px;
    row-gap: 12px;
  }

  @media (min-width: 48.01em) {
    padding: 16px 24px 28px;
  }
`;
const ContentFiltro = styled.div`
  display: flex;
  flex-wrap: wrap;
`;