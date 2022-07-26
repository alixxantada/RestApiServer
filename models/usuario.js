const { Schema, model } = require("mongoose");

// En MongoDb se graban los datos en objetos que se añaden a colecciones(las coleccciones son como las tablas de sql...)
const UsuarioSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  correo: {
    type: String,
    required: [true, "El correo es obligatorio"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "La contraseña es obligatoria"],
  },
  img: {
    type: String,
  },
  rol: {
    type: String,
    required: [true, "El rol es obligatorio"],
    //  Con esto vlaidariamos que los rolles solo pueden ser uno de estos:
    emun: ["ADMIN_ROLE", "USER_ROLE"],
  },
  estado: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
});

UsuarioSchema.methods.toJSON = function () {
  // Aqui le quitamos el __v y password al usuario y lo devolvemos en la respuesta con el resto de datos(de esta forma le quitamos el __v y la password)
  const { __v, password, _id, ...user } = this.toObject();
  user.uid = _id; // Aqui creamos un nuevo campo a la hora de devolver el usuario(uid) dandole el valor de _id y previamente le quitamos el _id
  return user;
};

module.exports = model("Usuario", UsuarioSchema);
