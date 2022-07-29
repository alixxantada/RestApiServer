const { Schema, model } = require("mongoose");

// En MongoDb se graban los datos en objetos que se añaden a colecciones(las coleccciones son como las tablas de sql...)
const ProductoSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
    unique: true,
  },
  estado: {
    type: Boolean,
    default: true,
    required: true,
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: "Usuario", // Aqui hacemos referencia al Schema de usuario en la carpeta models(MongoDb crea las colecciones poniendolo en plural pero nosotros auqi debemos ponerlo en singular)
    required: true,
  },
  precio: {
    type: Number,
    default: 0,
  },
  categoria: {
    type: Schema.Types.ObjectId,
    ref: "Categoria",
    required: true,
  },
  descripcion: {
    type: String,
  },
  disponible: {
    type: Boolean,
    default: true,
  },
  img: { type: String },
});

ProductoSchema.methods.toJSON = function () {
  // Aqui quitamos los datos que no querramos devolver de la respuesta
  // const { __v, estado, ...data } = this.toObject();
  const { __v, ...data } = this.toObject();
  return data;
};

module.exports = model("Producto", ProductoSchema);
