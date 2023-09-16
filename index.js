const { conexion }=require ("./basededatos/conexion")
const express= require("express");
const cors = require("cors");


//conectar a la base de datos//
conexion();

// crear servidor de node
const app = express();
const puerto = 3900;

//configurar cors
app.use(cors());

//convertir body a objeto js
app.use(express.json());
app.use(express.urlencoded({extended:true})); //form-urlencoded

app.listen(puerto,()=>{
    console.log("servidor correiendo en el puerto 3900")
});


// Importar las rutas
const rutas_articulo = require("./rutas/articulo");

// Cargar las rutas
app.use("/api", rutas_articulo);


  




