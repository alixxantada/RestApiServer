const { Schema, model } = require("mongoose");

// En MongoDb se graban los datos en objetos que se añaden a colecciones(las coleccciones son como las tablas de sql...)
const CategoriaSchema = Schema({
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
});

CategoriaSchema.methods.toJSON = function () {
  const { __v, estado, ...data } = this.toObject();
  return data;
};

module.exports = model("Categoria", CategoriaSchema);
