import { useMemo, useState } from "react";
import { v } from "../../styles/variables";
import { useOperaciones } from "../../store/OperacionesStore";
import { DataDesplegableTipo } from "../../utils/dataEstatica";
import { Header } from "../organismos/Header";
import { Btnsave } from "../moleculas/Btnsave";
import { Segmentado } from "../moleculas/Segmentado";
import { ContenedorPagina } from "../atomos/ContenedorPagina";
import { TablaCategorias } from "../organismos/tablas/TablaCategorias";
import { RegistrarCategorias } from "../organismos/formularios/RegistrarCategorias";

const TIPOS = [
  { valor: "g", texto: "Gastos", color: v.colorGastos },
  { valor: "i", texto: "Ingresos", color: v.colorIngresos },
];

export function CategoriasTemplate({
  data = [],
  presupuestos = [],
  moneda = "$",
  cargando = false,
  error = null,
}) {
  const [openRegistro, setOpenRegistro] = useState(false);
  const [accion, setAccion] = useState("Nuevo");
  const [dataSelect, setDataSelect] = useState({});
  const [stateUser, setStateUser] = useState(false);
  const { tipo, setTipo } = useOperaciones();

  const presupuestoPorCategoria = useMemo(
    () => new Map(presupuestos.map((p) => [p.idcategoria, p])),
    [presupuestos]
  );

  function cambiarTipo(valor) {
    const opcion = DataDesplegableTipo.find((item) => item.tipo === valor);
    if (opcion) setTipo(opcion);
  }

  function nuevo() {
    setAccion("Nuevo");
    setDataSelect({});
    setOpenRegistro(true);
  }

  function editar(categoria) {
    setAccion("Editar");
    setDataSelect(categoria);
    setOpenRegistro(true);
  }

  return (
    <ContenedorPagina onClick={() => setStateUser(false)}>
      {openRegistro && (
        <RegistrarCategorias
          key={`${accion}-${dataSelect.id ?? "nueva"}`}
          dataSelect={dataSelect}
          accion={accion}
          moneda={moneda}
          presupuesto={presupuestoPorCategoria.get(dataSelect.id)}
          onClose={() => setOpenRegistro(false)}
        />
      )}

      <header className="cabecera">
        <Header
          stateConfig={{ state: stateUser, setState: () => setStateUser(!stateUser) }}
        />
      </header>

      <div className="titulo">
        <h1>Categorías</h1>
        <p>
          Organizá tus ingresos y gastos en categorías. En las de gastos podés
          poner un límite mensual y te avisamos si lo superás.
        </p>
      </div>

      <div className="barra">
        <Segmentado opciones={TIPOS} valor={tipo} onChange={cambiarTipo} />
        <div className="acciones">
          <Btnsave
            funcion={nuevo}
            titulo="Nueva categoría"
            icono={<v.agregar />}
            bgcolor="#DAC1FF"
          />
        </div>
      </div>

      <section className="panel">
        {error ? (
          <p className="error">No se pudieron cargar las categorías: {error.message}</p>
        ) : cargando && data.length === 0 ? (
          <p className="vacio">Cargando categorías...</p>
        ) : (
          <TablaCategorias
            data={data}
            tipo={tipo}
            moneda={moneda}
            presupuestoPorCategoria={presupuestoPorCategoria}
            onEditar={editar}
          />
        )}
      </section>
    </ContenedorPagina>
  );
}
