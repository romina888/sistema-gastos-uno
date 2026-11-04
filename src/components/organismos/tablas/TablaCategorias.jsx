import styled from "styled-components";
import {
  ContentAccionesTabla,
  useCategoriasStore,
  Paginacion,
} from "../../../index";
import Swal from "sweetalert2";
import { v } from "../../../styles/variables";
import { useEffect, useState } from "react";

export function TablaCategorias({
  data,
  SetopenRegistro,
  setdataSelect,
  setAccion,
}) {
  const [pagina, setPagina] = useState(1);
  const [porPagina, setPorPagina] = useState(4);

  const maximo = Math.max(1, Math.ceil(data.length / porPagina));

  useEffect(() => {
    if (pagina > maximo) {
      setPagina(maximo);
    }
  }, [pagina, maximo]);

  const { eliminarCategoria } = useCategoriasStore();

  function eliminar(p) {
    Swal.fire({
      title: `¿Estás seguro de eliminar "${p.descripcion}"?`,
      text: "Una vez eliminada, no podrás recuperar esta categoría.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#BF83FF",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await eliminarCategoria({
            id: p.id,
            idusuario: p.idusuario,
          });

          Swal.fire({
            icon: "success",
            title: "Categoría eliminada",
            showConfirmButton: false,
            timer: 1500,
          });
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "No se pudo eliminar",
            text: "Ocurrió un error al eliminar la categoría.",
          });
        }
      }
    });
  }

  function editar(data) {
    SetopenRegistro(true);
    setdataSelect(data);
    setAccion("Editar");
  }

  return (
    <>
      <Container>
        <table className="responsive-table">
          <thead>
            <tr>
              <th scope="col">Descripcion</th>
              <th scope="col">Icono</th>
              <th scope="col">Color</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data
              .slice(
                (pagina - 1) * porPagina,
                (pagina - 1) * porPagina + porPagina
              )
              .map((item, index) => {
                return (
                  <tr key={item.id}>
                    <th scope="row">{item.descripcion}</th>
                    <td data-title="Icono">{item.icono}</td>
                    <td data-title="Color" className="Colordiv">
                      <div className="ColorContent">
                        <Colorcontent
                          color={item.color}
                          $alto="25px"
                          $ancho="25px"
                        />
                      </div>
                    </td>
                    <td data-title="Acciones">
                      <ContentAccionesTabla
                        funcionEditar={() => editar(item)}
                        funcionEliminar={() => eliminar(item)}
                      />
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        <Paginacion pagina={pagina} setPagina={setPagina} maximo={maximo} />
      </Container>
    </>
  );
}

const Container = styled.div`
  position: relative;
  width: 100%;
  min-width: 0;
  margin: 16px 0 24px;

  .responsive-table {
    width: 100%;
    border-spacing: 0;
    margin-bottom: 20px;
    table-layout: fixed;

    thead {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);

      @media (min-width: ${v.bpbart}) {
        position: relative;
        width: auto;
        height: auto;
        overflow: visible;
        clip: auto;
      }

      th {
        border-bottom: 2px solid rgba(115, 115, 115, 0.32);
        font-weight: normal;
        text-align: center;
        color: ${({ theme }) => theme.text};
        padding: 12px 8px;
      }
    }

    tbody,
    tr,
    th,
    td {
      display: block;
      padding: 0;
      text-align: left;
      white-space: normal;
      overflow-wrap: anywhere;
    }

    tr {
      margin-bottom: 14px;
      border: 1px solid ${({ theme }) => theme.bg4};
      border-radius: 12px;
      padding: 10px;
      background: ${({ theme }) => theme.bg2};

      @media (min-width: ${v.bpbart}) {
        display: table-row;
        margin-bottom: 0;
        padding: 0;
        border: none;
        border-radius: 0;
        background: transparent;
        
        /* Agregamos el borde aquí para que abarque toda la fila */
        border-bottom: 1px solid rgba(161, 161, 161, 0.32); 
      }
    }

    th,
    td {
      padding: 8px;
      vertical-align: middle;

      @media (min-width: ${v.bpbart}) {
        display: table-cell;
        padding: 12px 8px;
      }
    }

    tbody {
      @media (min-width: ${v.bpbart}) {
        display: table-row-group;
      }

      tr:nth-of-type(even) {
        @media (min-width: ${v.bpbart}) {
          background-color: rgba(151, 151, 151, 0.12);
        }
      }

      th[scope="row"] {
        color: ${({ theme }) => theme.text};

        @media (min-width: ${v.bpbart}) {
          text-align: center;
          background: transparent;
        }
      }

      .Colordiv {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 50px;

        @media (min-width: ${v.bpbart}) {
          justify-content: center;
          height: auto;
        }
      }

      td {
        text-align: left;

        @media (min-width: ${v.bpbart}) {
          /* Quitamos el border-bottom de los td para que no se corte */
          border-bottom: none; 
          text-align: center;
        }
      }

      td[data-title]:before {
        content: attr(data-title);
        float: left;
        font-size: 0.85em;

        @media (min-width: ${v.bpbart}) {
          content: none;
        }
      }
    }
  }

  @media (min-width: ${v.bpbart}) {
    margin: 20px 0 28px;
  }

  @media (min-width: ${v.bphomer}) {
    max-width: 75em;
    margin: 24px auto;
  }
`;

const Colorcontent = styled.div`
  justify-content: center;
  min-height: ${(props) => props.$alto};
  width: ${(props) => props.$ancho};
  display: block;
  background-color: ${(props) => props.color};
  border-radius: 50%;
  text-align: center;
`;