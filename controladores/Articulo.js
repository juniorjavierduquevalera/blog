const fs = require("fs");
const path = require("path");
const { validarArticulo } = require("../helpers/validar");
const Articulo = require("../modelos/Articulo");

const crear = async (req, res) => {
  const parametros = req.body;

  const errorValidacion = validarArticulo(parametros);

  if (errorValidacion) {
    return res.status(400).json(errorValidacion); // Enviar la respuesta de error
  }

  try {
    const articulo = new Articulo(parametros);
    const articuloGuardado = await articulo.save();

    return res.status(200).json({
      status: "success",
      articulo: articuloGuardado,
      mensaje: "Artículo creado con éxito",
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      mensaje: "No se ha guardado el artículo",
      error: error.message,
    });
  }
};
const listar = async (req, res) => {
  try {
    let consulta = Articulo.find({});

    if (req.params.ultimos) {
      consulta = consulta.limit(req.params.ultimos);
    }

    consulta = consulta.sort({ fecha: -1 });

    const articulos = await consulta.exec();

    if (!articulos || articulos.length === 0) {
      return res.status(404).json({
        status: "error",
        mensaje: "No se han encontrado artículos",
      });
    }

    return res.status(200).json({
      status: "success",
      parametro_url: req.params.ultimos,
      articulos: articulos,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      mensaje: "Error al buscar artículos",
      error: error.message,
    });
  }
};

const unArticulo = async (req, res) => {
  try {
    const id = req.params.id;

    // Utiliza el método findById para buscar un artículo por su ID
    const articulo = await Articulo.findById(id);

    if (!articulo) {
      return res.status(404).json({
        status: "error",
        mensaje: "No se encontró el artículo con el ID proporcionado",
      });
    }

    return res.status(200).json({
      status: "success",
      articulo: articulo,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      mensaje: "Error al buscar el artículo por ID",
      error: error.message,
    });
  }
};

const borrarArticulo = async (req, res) => {
  try {
    const id = req.params.id;

    // Utiliza el método findByIdAndDelete para buscar y eliminar un artículo por su ID
    const articulo = await Articulo.findByIdAndDelete(id);

    if (!articulo) {
      return res.status(404).json({
        status: "error",
        mensaje: "No se encontró el artículo con el ID proporcionado",
      });
    }

    return res.status(200).json({
      status: "success",
      mensaje: "Artículo eliminado con éxito",
      articuloEliminado: articulo, // Incluimos los datos del artículo eliminado
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      mensaje: "Error al eliminar el artículo por ID",
      error: error.message,
    });
  }
};

const editarArticulo = async (req, res) => {
  try {
    const id = req.params.id;
    const nuevosDatos = req.body; // Los nuevos datos para actualizar el artículo

    // Utiliza el método findByIdAndUpdate para buscar y actualizar un artículo por su ID
    const articuloActualizado = await Articulo.findByIdAndUpdate(
      id,
      nuevosDatos,
      {
        new: true, // Para que devuelva el artículo actualizado en lugar del antiguo
      }
    );

    if (!articuloActualizado) {
      return res.status(404).json({
        status: "error",
        mensaje: "No se encontró el artículo con el ID proporcionado",
      });
    }

    return res.status(200).json({
      status: "success",
      mensaje: "Artículo actualizado con éxito",
      articulo: articuloActualizado,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      mensaje: "Error al actualizar el artículo por ID",
      error: error.message,
    });
  }
};

const subirImagen = async (req, res) => {
  if (req.file) {
    const archivo = req.file.originalname;
    const archivo_split = archivo.split(".");
    const extension = archivo_split[archivo_split.length - 1].toLowerCase();

    if (!["png", "jpg", "jpeg", "gif"].includes(extension)) {
      // Borrar el archivo utilizando fs.unlinkSync
      try {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({
          status: "error",
          mensaje: "Tipo de archivo no permitido. El archivo se ha eliminado.",
        });
      } catch (error) {
        return res.status(500).json({
          status: "error",
          mensaje: "Error al eliminar el archivo no permitido",
          error: error.message,
        });
      }
    } else {
      const articuloId = req.params.id;
      try {
        const articuloActualizado = await Articulo.findByIdAndUpdate(
          articuloId,
          { imagen: req.file.filename },
          { new: true }
        );

        if (!articuloActualizado) {
          return res.status(400).json({
            status: "error",
            mensaje: "No se encontró el artículo o no se pudo actualizar con la imagen.",
          });
        }

        return res.status(200).json({
          status: "success",
          file: req.file,
          archivo_split: archivo_split,
          mensaje: "La imagen se ha subido con éxito y se ha vinculado al artículo.",
        });
      } catch (error) {
        return res.status(500).json({
          status: "error",
          mensaje: "Error al actualizar el artículo con la imagen.",
          error: error.message,
        });
      }
    }
  } else {
    return res.status(400).json({
      status: "error",
      mensaje: "No se ha subido ninguna imagen",
    });
  }
};

const imagen = (req, res) => {
  const fichero = req.params.fichero;
  const ruta_fisica = "./imagenes/articulos/" + fichero;

  fs.stat(ruta_fisica, (error, stats) => {
    if (error) {
      console.error("Error al obtener la información del archivo:", error);
      return res.status(404).json({
        status: "error",
        mensaje: "El archivo no existe o no se pudo acceder a él.",
      });
    }

    // Verifica si el archivo existe
    if (stats.isFile()) {
      // Si existe y es un archivo, envía el archivo como respuesta
      return res.sendFile(path.resolve(ruta_fisica));
    } else {
      return res.status(404).json({
        status: "error",
        mensaje: "El archivo no existe o no es un archivo válido.",
      });
    }
  });
};

module.exports = {
  crear,
  listar,
  unArticulo,
  borrarArticulo,
  editarArticulo,
  subirImagen,
  imagen,
};
