const { request, response } = require("express");
const { Producto } = require("../models");

const productoGetAll = async (req = request, res = response) => {
  // const { q, nombre = "No name", apikey, page = 1, limit } = req.query; // si le damos valores, estariamos indicando valor predefinido en caso de que no venga esa dato en la query

  const { limite = 5, desde = 0 } = req.query; // Indicamos la paginacion del total de usuarios en caso de que nos lo manden en la query(paginacion predefinida)
  const queryProductoActivo = { estado: true };

  const [total, productos] = await Promise.all([
    // Devolvemos un arrai de promesas, desestructuramos el total y usuarios, devolviendo en la primera promesa el total y en la segunda los usuarios
    Producto.countDocuments(queryProductoActivo), // Cantidad de produtos
    Producto.find(queryProductoActivo) // Con esto sacamos el total de los productos que NO han sido borrados en bbdd(borrado logico)
      .populate("usuario", "nombre") // Con esto añadimos a la respuesta el usuario creador
      .skip(Number(desde)) // En la query llega como string y hay que parsearlo con Number(desde cual empieza a sacar resultados)
      .limit(Number(limite)), // En la query llega como string y hay que parsearlo con Number(cantidad a paginar)
  ]);
  // Para enviar la respuesta en formato json y añadimos un status con el código que queramos( res.status(403).json({ )
  res.json({
    total,
    productos,
  });
};

const productoGetOne = async (req, res = response) => {
  const { id } = req.params;
  const producto = await Producto.findById(id)
    .populate("usuario", "nombre")
    .populate("categoria", "nombre");

  res.json(producto);
};

const productoPost = async (req = request, res = response) => {
  const { estado, usuario, ...body } = req.body;

  const productoDB = await Producto.findOne({ nombre: body.nombre });

  if (productoDB) {
    return res.status(400).json({
      msg: `El producto ${productoDB.nombre}, ya existe`,
    });
  }

  const data = {
    ...body,
    nombre: body.nombre.toUpperCase(),
    // Guardamos el id del usuario logueado
    usuario: req.usuario._id,
  };
  // Creamos la instancia del schema de  usuario y le pasamos el body que contiene los datos
  const producto = new Producto(data);

  // Guarda el producto en db
  await producto.save();

  res.status(201).json({
    producto,
  });
};

const productoPut = async (req = request, res = response) => {
  const { id } = req.params;
  const { usuario, estado, ...data } = req.body;

  // Nombre del producto a mayus
  if (data.nombre) {
    data.nombre = data.nombre.toUpperCase();
  }

  //Guardamos el id del usuario logueado
  data.usuario = req.usuario._id;
  // Buscamos el usuario en bbdd por id y le enviamos todos los demas datos
  const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

  res.json(producto);
};

const productoDelete = async (req = request, res = response) => {
  const { id } = req.params;

  // Borrado logico de producto
  const productoBorrado = await Producto.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true } // Para que se reflejen los cambios ya en la propia respuesta
  );

  res.json(productoBorrado);
};

module.exports = {
  productoGetAll,
  productoGetOne,
  productoPut,
  productoPost,
  productoDelete,
};
