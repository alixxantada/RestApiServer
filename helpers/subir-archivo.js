const { v4: uuidv4 } = require("uuid");
// const { v4 } = require("uuid");
const path = require("path");

const subirArchivo = (
  files,
  extensionesValidas = ["png", "jpg", "jpeg", "gif"],
  carpeta = ""
) => {
  return new Promise((resolve, reject) => {
    const { archivo } = files;

    const nombreCortado = archivo.name.split(".");
    const extension = nombreCortado[nombreCortado.length - 1];
    // Validar extensiones

    if (!extensionesValidas.includes(extension)) {
      return reject(
        `La extension ${extension} no es permitida, extensiones validas: ${extensionesValidas}`
      );
    }
    // Traceando en consola
    // console.log("Extension: ", extension);
    //Traceando en la respuesta de  Postman
    // res.json({ extension });

    const nombreTemp = uuidv4() + "." + extension;

    // Aqui indicamos el directorio donde estara el archivo y el nombre del archivo que subimos
    const uploadPath = path.join(
      __dirname, // Directorio donde esta este archivo
      "../uploads/",
      carpeta, // La carpeta que le paso a la funcion
      nombreTemp // El nombre ya modificado
    );

    archivo.mv(uploadPath, (err) => {
      if (err) {
        reject(err);
      }

      resolve(nombreTemp);
    });
  });
};

module.exports = {
  subirArchivo,
};
