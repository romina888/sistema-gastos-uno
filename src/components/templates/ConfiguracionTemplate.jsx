import styled from "styled-components";
import {
  Header,
  Selector,
  v,
  ListaPaises,
  useUsuariosStore,
  ListaGenerica,
  TemasData,
  Btnsave,
  PerfilUsuario,
} from "../../index";
import { useState } from "react";
import { ZonaPeligro } from "../organismos/ZonaPeligro";

export function ConfiguracionTemplate() {
  const { datausuarios, editartemamonedauser } = useUsuariosStore();

  const [select, setSelect] = useState({});
  const [selectTema, setSelecttema] = useState({});
  const [state, setState] = useState(false);
  const [stateListaPaises, setStateListaPaises] = useState(false);
  const [stateListaTemas, setStateListaTemas] = useState(false);

  // País y moneda
  const moneda = select.symbol || datausuarios?.moneda || "$";
  const pais = select.countryName || datausuarios?.pais || "Argentina";

  // Tema actual: si todavía no elegiste uno, toma el guardado en Supabase
  const temaActual =
    selectTema.descripcion ||
    (datausuarios?.tema === "0" ? "light" : "dark");

  // Iconos propios del proyecto
  const iconoTema =
    selectTema.icono ||
    (temaActual === "light" ? <v.iconosol /> : <v.iconoluna />);

  // Guardar cambios
  const editar = async () => {
    const themeElegido = selectTema.descripcion
      ? selectTema.descripcion === "light"
        ? "0"
        : "1"
      : datausuarios?.tema || "1";

    const p = {
      tema: themeElegido,
      moneda: moneda,
      pais: pais,
      id: datausuarios?.id,
    };

    await editartemamonedauser(p);
  };

  return (
    <Container>
      <header className="header">
        <Header
          stateConfig={{ state: state, setState: () => setState(!state) }}
        />
      </header>

      <section className="area2">
        <h1>AJUSTES</h1>

        <PerfilUsuario />

        <ContentCard>
          <span>Moneda:</span>

          <Selector
            state={stateListaPaises}
            color={v.colorPrincipal}
            texto1={`${moneda} ${pais}`}
            funcion={() => setStateListaPaises(!stateListaPaises)}
          />

          {stateListaPaises && (
            <ListaPaises
              setSelect={(p) => setSelect(p)}
              setState={() => setStateListaPaises(!stateListaPaises)}
            />
          )}
        </ContentCard>

        <ContentCard>
          <span>Tema:</span>

          <Selector
            state={stateListaTemas}
            color={v.colorPrincipal}
            texto1={temaActual}
            icono={iconoTema}
            funcion={() => setStateListaTemas(!stateListaTemas)}
          />

          {stateListaTemas && (
            <ListaGenerica
              data={TemasData}
              setState={() => setStateListaTemas(!stateListaTemas)}
              funcion={setSelecttema}
            />
          )}
        </ContentCard>

        <Btnsave
          titulo="Guardar"
          bgcolor={v.colorPrincipal}
          icono={<v.iconoguardar />}
          funcion={editar}
        />
        <ZonaPeligro />
      </section>
    </Container>
  );
}


const Container = styled.div`
  padding: 20px 30px;
  width: 100%;
  background: ${({ theme }) => theme.bgtotal};
  color: ${({ theme }) => theme.text};
  display: grid;
  grid-template:
    "header" 80px
    "area2" auto;

  .header {
    grid-area: header;
    display: flex;
    align-items: center;
  }

  .area2 {
    grid-area: area2;
    width: 100%;
    max-width: 560px;
    margin: 30px auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 24px;

    h1 {
      width: 100%;
      font-size: 2rem;
      font-weight: 700;
      text-align: center;
      margin: 0 0 8px;
    }
  }

  @media (max-width: 768px) {
    padding: 15px;

    .area2 {
      margin: 20px auto;
      gap: 20px;

      h1 {
        font-size: 1.7rem;
      }
    }
  }
`;

const ContentCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  position: relative;
  width: 100%;
  max-width: 440px;

  > span {
    font-size: 15px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
`;
