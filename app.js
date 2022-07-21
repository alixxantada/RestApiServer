require("dotenv").config();

const Server = require("./models/server");

// Creamos la instancia del servidor
const server = new Server();

// Indicamos que escuche el server
server.listen();

// Para añadir tags
// git tag
// git tag -a v1.0.0 -m "Prueba Tag"
// git push --tags
