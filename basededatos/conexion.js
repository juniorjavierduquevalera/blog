const mongoose = require("mongoose");

const conexion = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/blog", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Conexión exitosa a MongoDB");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
  }
};

module.exports = {
  conexion
};
