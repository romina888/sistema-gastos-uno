import { useEffect, useState } from "react";
import styled from "styled-components";
import { v } from "../../../styles/variables";
import {
  InputText,
  Spinner,
  useOperaciones,
  Btnsave,
  useUsuariosStore,
  useCategoriasStore,
} from "../../../index";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import {
  EliminarPresupuesto,
  GuardarPresupuesto,
} from "../../../supabase/crudPresupuestos";
import { CirclePicker } from "react-color";
import Emojipicker from "emoji-picker-react";

export function RegistrarCategorias({
  onClose,
  dataSelect,
  accion,
  presupuesto,
  moneda = "$",
}) {
  const queryClient = useQueryClient();
  const { insertarCategorias, editarCategoria } = useCategoriasStore();
  const { datausuarios } = useUsuariosStore();
  const [showPicker, setShowPicker] = useState(false);
  const [emojiselect, setEmojiselect] = useState("😻");
  const [currentColor, setColor] = useState("#F44336");

  const [estadoProceso, setEstadoproceso] = useState(false);
  const { tipo } = useOperaciones();
  function onEmojiClick(emojiObject) {
    setEmojiselect(() => emojiObject.emoji);
    setShowPicker(false);
  }
  function elegirColor(color) {
    setColor(color.hex);
  }

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: { limite: presupuesto ? String(presupuesto.monto) : "" },
  });

  // Crea, cambia o quita el límite mensual (solo categorías de gastos).
  async function guardarLimite(idcategoria, valor) {
    if (tipo !== "g" || !idcategoria) return;
    const texto = String(valor ?? "").trim();
    try {
      if (texto) {
        await GuardarPresupuesto({
          idusuario: datausuarios.id,
          idcategoria,
          monto: Number(texto),
        });
      } else if (presupuesto) {
        await EliminarPresupuesto({
          id: presupuesto.id,
          idusuario: datausuarios.id,
        });
      }
      await queryClient.invalidateQueries({ queryKey: ["presupuestos"] });
    } catch (error) {
      console.error("No se pudo guardar el límite", error);
      Swal.fire({
        icon: "error",
        title: "La categoría se guardó, pero no el límite",
        text: error?.message || "Probá de nuevo desde Presupuestos.",
      });
    }
  }

  async function insertar(data) {
    if (accion === "Editar") {
      const p = {
        descripcion: data.descripcion,
        color: currentColor,
        icono: emojiselect,
        id: dataSelect.id,
        idusuario:datausuarios.id,
        tipo: tipo,
      };
      try {
        setEstadoproceso(true);
        await editarCategoria(p);
        await guardarLimite(dataSelect.id, data.limite);
        queryClient.invalidateQueries({ queryKey: ["categorias-usuario"] });
        setEstadoproceso(false);
        onClose();
      } catch (error) {}
    } else {
      const p = {
        descripcion: data.descripcion,
        color: currentColor,
        icono: emojiselect,
        idusuario: datausuarios.id,
        tipo: tipo,
      };
      try {
        setEstadoproceso(true);
        const nueva = await insertarCategorias(p);
        if (nueva) await guardarLimite(nueva.id, data.limite);
        queryClient.invalidateQueries({ queryKey: ["categorias-usuario"] });
        setEstadoproceso(false);

        onClose();
      } catch (error) {
        alert("error ingresar Form");
      }
    }
  }
  useEffect(() => {
    if (accion === "Editar") {
      setEmojiselect(dataSelect.icono);
      setColor(dataSelect.color);
    } 
  }, []);
  return (
    <Container>
      {estadoProceso && <Spinner />}

      <div className="sub-contenedor">
        <div className="headers">
          <section>
            <h1>
              {accion == "Editar"
                ? "Editar categoria"
                : "Registrar nueva categoria"}
            </h1>
          </section>

          <section>
            <span onClick={onClose}>x</span>
          </section>
        </div>

        <form className="formulario" onSubmit={handleSubmit(insertar)}>
          <section>
            <div>
              <InputText
                defaultValue={dataSelect.descripcion}
                register={register}
                placeholder="Descripcion"
                errors={errors}
                style={{ textTransform: "capitalize" }}
              />
            </div>
            {tipo === "g" && (
              <label className="limite">
                <span>Límite mensual ({moneda}) · opcional</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  inputMode="decimal"
                  placeholder="Sin límite"
                  {...register("limite", {
                    validate: (x) =>
                      !x || Number(x) > 0 || "El límite debe ser mayor a 0",
                  })}
                />
                {errors.limite && <p>{errors.limite.message}</p>}
                <small>Si lo superás con un gasto, te avisamos.</small>
              </label>
            )}
            <div className="colorContainer">
              <ContentTitle>
                {<v.paletacolores />}
                <span>Color</span>
              </ContentTitle>
              <div className="colorPickerContent">
                <CirclePicker onChange={elegirColor} color={currentColor} />
              </div>
            </div>
            <div>
              <ContentTitle>
                <input
                readOnly={true}
                  value={emojiselect}
                  type="text"
                  onClick={() => setShowPicker(!showPicker)}
                ></input>
                <span>icono</span>
              </ContentTitle>
              {showPicker && (
                <ContainerEmojiPicker>
                  <Emojipicker onEmojiClick={onEmojiClick} />
                </ContainerEmojiPicker>
              )}
            </div>
            <div className="btnguardarContent">
              <Btnsave
                icono={<v.iconoguardar />}
                titulo="Guardar"
                bgcolor="#DAC1FF"
              />
            </div>
          </section>
        </form>
      </div>
    </Container>
  );
}
const Container = styled.div`
  transition: 0.5s;
  top: 0;
  left: 0;
  position: fixed;
  background-color: rgba(10, 9, 9, 0.5);
  display: flex;
  width: 100%;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  .sub-contenedor {
    width: 500px;
    max-width: 85%;
    border-radius: 20px;
    background: ${({ theme }) => theme.bgtotal};
    box-shadow: -10px 15px 30px rgba(10, 9, 9, 0.4);
    padding: 13px 36px 20px 36px;
    z-index: 100;

    .headers {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      h1 {
        font-size: 20px;
        font-weight: 500;
      }
      span {
        font-size: 20px;
        cursor: pointer;
      }
    }
    .formulario {
      section {
        gap: 20px;
        display: flex;
        flex-direction: column;
        .colorContainer {
          .colorPickerContent {
            padding-top: 15px;
            min-height: 50px;
          }
        }
        .limite {
          display: flex;
          flex-direction: column;
          gap: 6px;

          > span {
            font-size: 0.85em;
            color: ${({ theme }) => theme.colorSubtitle};
          }
          input {
            background: ${({ theme }) => theme.bgtotal};
            font-size: 16px;
            padding: 10px 10px 10px 5px;
            width: 100%;
            border: none;
            border-bottom: solid 1px grey;
            color: ${({ theme }) => theme.text};
            outline: none;
          }
          small {
            font-size: 12px;
            color: ${({ theme }) => theme.colorSubtitle};
          }
          p {
            color: #ff6d00;
            font-size: 12px;
          }
        }
      }
    }
  }
`;

const ContentTitle = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 20px;
  svg {
    font-size: 25px;
  }
  input {
    border: none;
    outline: none;
    background: transparent;
    padding: 2px;
    width: 40px;
    font-size: 28px;
  }
`;
const ContainerEmojiPicker = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`;