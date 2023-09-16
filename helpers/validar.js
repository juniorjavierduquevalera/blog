const validator = require("validator");

const validarArticulo = (parametros) => {
  if (validator.isEmpty(parametros.titulo) || validator.isEmpty(parametros.contenido)) {
    return {
      status: "error",
      mensaje: "El título y el contenido son obligatorios"
    };
  }
  // Si no hay errores, devolvemos null o undefined (sin error)
  return null;
};

module.exports = {
  validarArticulo
};
