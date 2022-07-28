// Para instalar cors --> npm install cors
// Se necesita instalar mongoose para conectar DB --> npm i mongoose

const express = require("express");
const cors = require("cors");
const { dbConnection } = require("../database/config");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      auth: "/api/auth",
      usuarios: "/api/usuarios",
      categorias: "/api/categorias",
      productos: "/api/productos",
    };

    // Conectar a BBDD
    this.conectarDB();

    // Middlewares
    this.middlewares();

    // Rutas de la aplicacion
    this.routes();
  }

  // Creando la conexion a la bbdd
  async conectarDB() {
    await dbConnection();
  }

  middlewares() {
    // Con el .use indicamos que es un middleware
    this.app.use(cors()); // Indicamos el cors
    this.app.use(express.json()); //Lectura y parseo del body al formato JSON
    this.app.use(express.static("public")); // Indicamos que es el directorio público
  }

  routes() {
    this.app.use(this.paths.auth, require("../routes/auth"));
    this.app.use(this.paths.usuarios, require("../routes/user"));
    this.app.use(this.paths.categorias, require("../routes/categorias"));
    this.app.use(this.paths.productos, require("../routes/productos"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo en el puerto", this.port);
    });
  }
}

module.exports = Server;
