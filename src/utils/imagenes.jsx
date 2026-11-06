// Toma una foto elegida por la persona, la recorta en cuadrado y la achica
// para guardarla como texto (data URL) en la columna "foto" de la tabla usuarios.
export function reducirImagen(archivo, lado = 160) {
  return new Promise((resolve, reject) => {
    const lector = new FileReader();
    lector.onerror = () => reject(new Error("No se pudo leer el archivo."));
    lector.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("El archivo no es una imagen válida."));
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = lado;
        canvas.height = lado;
        const lado0 = Math.min(img.width, img.height);
        const sx = (img.width - lado0) / 2;
        const sy = (img.height - lado0) / 2;
        canvas.getContext("2d").drawImage(img, sx, sy, lado0, lado0, 0, 0, lado, lado);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = lector.result;
    };
    lector.readAsDataURL(archivo);
  });
}
