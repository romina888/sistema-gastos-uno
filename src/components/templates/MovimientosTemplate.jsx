import styled from "styled-components";
import {
  Header,
  CalendarioLineal,
  CardTotales,
  useOperaciones,
  v,
  useMovimientosStore,
  useUsuariosStore,
  TablaMovimientos,
  useCuentaStore,
  useCategoriasStore,
  DataDesplegableMovimientos,
  DataDesplegableTipo,
  ContentFiltros,
  Btndesplegable,
  ListaMenuDesplegable,
  Btnfiltro,
  RegistrarMovimientos,
} from "../../index";
import dayjs from "dayjs";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

export function MovimientosTemplate() {
  const [dataSelect, setdataSelect] = useState([]);
  const [accion, setAccion] = useState("");
  const [openRegistro, SetopenRegistro] = useState(false);
  const [value, setValue] = useState(dayjs(Date.now()));
  const [formatoFecha, setFormatoFecha] = useState("");
  const [state, setState] = useState(false);
  const [stateTipo, setStateTipo] = useState(false);

  const { setTipo, tipo, colorCategoria, bgCategoria, año, mes } =
    useOperaciones();
  const { datausuarios } = useUsuariosStore();
  const idusuario = datausuarios?.id;

  const {
    totalMesAño,
    totalMesAñoPagados,
    totalMesAñoPendientes,
    mostrarMovimientos,
    datamovimientos,
  } = useMovimientosStore();
  const { mostrarCuentas } = useCuentaStore();
  const { mostrarCategorias } = useCategoriasStore();

  // Igual que en CategoriasTemplate
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
  function nuevoRegistro() {
    SetopenRegistro(!openRegistro);
    setAccion("Nuevo");
    setdataSelect([]);
  }

  useQuery({
    queryKey: ["mostrar movimientos mes año", { año, mes, idusuario, tipo }],
    queryFn: () =>
      mostrarMovimientos({
        año: año,
        mes: mes,
        idusuario: idusuario,
        tipocategoria: tipo,
      }),
    enabled: !!idusuario && !!mes && !!año,
  });
  useQuery({
    queryKey: ["mostrar cuentas", idusuario],
    queryFn: () => mostrarCuentas({ idusuario: idusuario }),
    enabled: !!idusuario,
  });
  useQuery({
    queryKey: ["mostrar categorias", { idusuario, tipo }],
    queryFn: () => mostrarCategorias({ idusuario: idusuario, tipo: tipo }),
    enabled: !!idusuario,
  });

  return (
    <Container onClick={cerrarDesplegables}>
      {openRegistro && (
        <RegistrarMovimientos
          dataSelect={dataSelect}
          accion={accion}
          state={openRegistro}
          setState={() => SetopenRegistro(!openRegistro)}
        />
      )}

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
              text={tipo === "g" ? "Gastos" : "Ingresos"}
              funcion={openTipo}
            />
            {stateTipo && (
              <ListaMenuDesplegable
                data={DataDesplegableMovimientos}
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

      <section className="totales">
        <CardTotales
          total={totalMesAñoPendientes}
          title={tipo === "g" ? "Gastos pendientes" : "Ingresos pendientes"}
          color={colorCategoria}
          icono={<v.flechaarribalarga />}
        />
        <CardTotales
          total={totalMesAñoPagados}
          title={tipo === "g" ? "Gastos pagados" : "Ingresos pagados"}
          color={colorCategoria}
          icono={<v.flechaabajolarga />}
        />
        <CardTotales
          total={totalMesAño}
          title="Total"
          color={colorCategoria}
          icono={<v.balance />}
        />
      </section>

      <section className="calendario">
        <CalendarioLineal
          value={value}
          setValue={setValue}
          formatofecha={formatoFecha}
          setFormatoFecha={setFormatoFecha}
        />
      </section>

      <section className="main">
        <TablaMovimientos
          data={datamovimientos}
          SetopenRegistro={SetopenRegistro}
          setdataSelect={setdataSelect}
          setAccion={setAccion}
        />
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
    "totales" auto
    "calendario" auto
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

  .totales {
    grid-area: totales;
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
    min-width: 0;
  }

  .calendario {
    grid-area: calendario;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 0;
    max-width: 100%;
    overflow: hidden;
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

    .totales {
      grid-template-columns: repeat(3, 1fr);
    }
  }
`;
const ContentFiltro = styled.div`
  display: flex;
  flex-wrap: wrap;
`;