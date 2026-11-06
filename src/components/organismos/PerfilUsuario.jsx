import styled from "styled-components";
import { useRef, useState } from "react";
import Swal from "sweetalert2";
import { UserAuth } from "../../context/AuthContent";
import { useUsuariosStore } from "../../store/UsuariosStore";
import { reducirImagen } from "../../utils/imagenes";
import { v } from "../../styles/variables";
import { Btnsave } from "../moleculas/Btnsave";

const TAMANIO_MAXIMO = 5 * 1024 * 1024; // 5 MB antes de achicarla

// Permite cambiar el nombre y la foto que se muestran en la app.
// (El inicio de sesión es con Google, por eso no hay contraseña para cambiar.)
export function PerfilUsuario() {
  const { user } = UserAuth();
  const { datausuarios, editartemamonedauser } = useUsuariosStore();
  const inputArchivo = useRef(null);

  const [nombre, setNombre] = useState(datausuarios?.nombres || user?.name || "");
  const [foto, setFoto] = useState(datausuarios?.foto || user?.picture || "");
  const [guardando, setGuardando] = useState(false);

  async function elegirFoto(e) {
    const archivo = e.target.files?.[0];
    e.target.value = ""; // permite volver a elegir el mismo archivo
    if (!archivo) return;
    if (!archivo.type.startsWith("image/")) {
      Swal.fire({ icon: "warning", title: "Elegí una imagen (JPG, PNG, etc.)" });
      return;
    }
    if (archivo.size > TAMANIO_MAXIMO) {
      Swal.fire({ icon: "warning", title: "La imagen pesa más de 5 MB" });
      return;
    }
    try {
      setFoto(await reducirImagen(archivo));
    } catch (error) {
      Swal.fire({ icon: "error", title: "No se pudo usar la imagen", text: error.message });
    }
  }

  async function guardar() {
    const limpio = nombre.trim();
    if (limpio.length < 2 || limpio.length > 40) {
      Swal.fire({ icon: "warning", title: "El nombre debe tener entre 2 y 40 caracteres" });
      return;
    }
    if (!datausuarios?.id) return;
    try {
      setGuardando(true);
      await editartemamonedauser({ id: datausuarios.id, nombres: limpio, foto });
    } catch (error) {
      Swal.fire({ icon: "error", title: "No se pudo guardar el perfil", text: error.message });
    } finally {
      setGuardando(false);
    }
  }

  return (
    <Container>
      <h2>Perfil</h2>

      <div className="foto">
        {foto ? <img src={foto} alt="Tu foto de perfil" /> : <v.iconoUser />}
      </div>

      <div className="botones-foto">
        <button type="button" onClick={() => inputArchivo.current?.click()}>
          Cambiar foto
        </button>
        {user?.picture && foto !== user.picture && (
          <button type="button" onClick={() => setFoto(user.picture)}>
            Usar la foto de Google
          </button>
        )}
        <input
          ref={inputArchivo}
          type="file"
          accept="image/*"
          onChange={elegirFoto}
          hidden
        />
      </div>

      <label>
        <span>Nombre</span>
        <input
          type="text"
          value={nombre}
          maxLength={40}
          onChange={(e) => setNombre(e.target.value)}
        />
      </label>

      <Btnsave
        titulo={guardando ? "Guardando..." : "Guardar perfil"}
        bgcolor="#DAC1FF"
        icono={<v.iconoguardar />}
        funcion={guardar}
      />
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.bg4};
  background: ${({ theme }) => theme.bg2};

  h2 {
    font-size: 1.2em;
  }

  .foto {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 96px;
    height: 96px;
    border-radius: 50%;
    overflow: hidden;
    font-size: 56px;
    background: ${({ theme }) => theme.bg3};

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .botones-foto {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;

    button {
      padding: 8px 14px;
      border: 1px solid ${({ theme }) => theme.primary};
      border-radius: 10px;
      background: transparent;
      color: ${({ theme }) => theme.primary};
      cursor: pointer;

      &:hover {
        background: ${({ theme }) => theme.primary};
        color: #18121f;
      }
    }
  }

  label {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 6px;

    span {
      font-size: 0.85em;
      color: ${({ theme }) => theme.colorSubtitle};
    }

    input {
      padding: 10px;
      font-size: 16px;
      border: 1px solid ${({ theme }) => theme.bg4};
      border-radius: 10px;
      background: ${({ theme }) => theme.bgtotal};
      color: ${({ theme }) => theme.text};
      outline: none;

      &:focus {
        border-color: ${({ theme }) => theme.primary};
      }
    }
  }
`;
