import styled from "styled-components";
import { Btnsave } from "../moleculas/Btnsave";
import { useCategoriasStore, useUsuariosStore } from "../../index";
import Swal from "sweetalert2";
export function CardEliminarData() {
    const { eliminarCategoriasTodas } = useCategoriasStore();
    const { datausuarios } = useUsuariosStore();
    const eliminar = async () => {
        Swal.fire({
            title: "¿Estás seguro(a)(e)?",
            text: "Una vez eliminado, ¡no podrá recuperar estos registros!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, eliminar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const p = {
                    idusuario: datausuarios.id,
                };
                await eliminarCategoriasTodas(p);
            }
        });
    };
    return (
        <Container>
            <h2> Resetear todo</h2>
            <span>
                ADVERTENCIA!: *esta acción es irreversible, una vez ejecutada se
                eliminaran todos tus registros de movimientos incluso las categorias
                registradas. <br />
                *Se reseteara tambien los saldos acumulados en tus cuentas.
            </span>
            <Btnsave titulo="resetear"
                bgcolor="rgba(247, 92, 92, 0.87)"
                funcion={eliminar}
            />
        </Container>
    )
}
const Container = styled.div`
  display: flex;
  width: 100%;
  border-radius: 10px;
  border: 2px solid rgba(255, 99, 99, 0.87);
  height: 100%;
  background: rgb(42, 1, 1);
  background: linear-gradient(
    18deg,
    rgba(252, 69, 69, 0.12) 9%,
    rgba(252, 69, 69, 0.3) 100%
  );
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 10px;
  gap: 20px;

  h2 {
    color: rgba(252, 69, 69, 0.72);
  }
  span {
    color: rgba(251, 82, 82, 0.67);
    font-size: 120%;
  }
  `
