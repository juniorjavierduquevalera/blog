const express = require("express");
const multer = require('multer');
const router = express.Router();

const ArticuloControlador = require("../controladores/Articulo");

const almacenamiento = multer.diskStorage({
    destination: (req, file, cb) => {
      // Aquí defines la carpeta de destino para las imágenes subidas.     .
      cb(null, './imagenes/articulos');
    },
    filename: (req, file, cb) => {
      // Aquí defines el nombre del archivo para las imágenes subidas.    
      const nombreArchivo = "articulo" + Date.now() + file.originalname;
      cb(null, nombreArchivo);
    }
  });
  const cargarImagen = multer({ storage: almacenamiento });

//Rutas//
router.post("/crear", ArticuloControlador.crear);
router.get("/articulos/:ultimos?", ArticuloControlador.listar);
router.get("/articulo/:id", ArticuloControlador.unArticulo);
router.delete("/articulo/:id", ArticuloControlador.borrarArticulo);
router.put("/articulo/:id", ArticuloControlador.editarArticulo);
router.post("/subir-imagen/:id",[cargarImagen.single("file")],  ArticuloControlador.subirImagen);
router.get("/imagen/:fichero", ArticuloControlador.imagen);

// Exportar el enrutador
module.exports = router;
