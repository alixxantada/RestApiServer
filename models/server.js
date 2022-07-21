// Para instalar cors --> npm install cors

const express = require("express");
var cors = require("cors");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.usuariosRoutePath = "/api/usuarios";

    // Middlewares
    this.middlewares();

    // Rutas de la aplicacion
    this.routes();
  }

  middlewares() {
    // Con el .use indicamos que es un middleware
    this.app.use(cors()); // Indicamos el cors
    this.app.use(express.json()); //Lectura y parseo del body al formato JSON
    this.app.use(express.static("public")); // Indicamos que es el directorio público
  }

  routes() {
    this.app.use(this.usuariosRoutePath, require("../routes/user"));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo en el puerto", this.port);
    });
  }
}

module.exports = Server;
