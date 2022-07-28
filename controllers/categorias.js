const { request, response } = require("express");
const { Categoria } = require("../models");

const categoriaGetAll = async (req = request, res = response) => {
  // const { q, nombre = "No name", apikey, page = 1, limit } = req.query; // si le damos valores, estariamos indicando valor predefinido en caso de que no venga esa dato en la query

  const { limite = 5, desde = 0 } = req.query; // Indicamos la paginacion del total de usuarios en caso de que nos lo manden en la query(paginacion predefinida)
  const queryCategoriaActivo = { estado: true };

  const [total, categorias] = await Promise.all([
    // Devolvemos un arrai de promesas, desestructuramos el total y usuarios, devolviendo en la primera promesa el total y en la segunda los usuarios
    Categoria.countDocuments(queryCategoriaActivo), // Cantidad de categorias
    Categoria.find(queryCategoriaActivo) // Con esto sacamos el total de categorias que NO han sido borrados en bbdd(borrado logico)
      .populate("usuario", "nombre") // Con esto añadimos a la respuesta el usuario creador
      .skip(Number(desde)) // En la query llega como string y hay que parsearlo con Number(desde cual empieza a sacar resultados)
      .limit(Number(limite)), // En la query llega como string y hay que parsearlo con Number(cantidad a paginar)
  ]);
  // Para enviar la respuesta en formato json y añadimos un status con el código que queramos( res.status(403).json({ )
  res.json({
    total,
    categorias,
  });
};

const categoriaGetOne = async (req, res = response) => {
  const { id } = req.params;
  const categoria = await Categoria.findById(id).populate("usuario", "nombre");

  res.json(categoria);
};

const categoriaPost = async (req = request, res = response) => {
  // Nombre de la categoria a mayus
  const nombre = req.body.nombre.toUpperCase();
  const categoriaDB = await Categoria.findOne({ nombre });

  if (categoriaDB) {
    return res.status(400).json({
      msg: `La categoria ${categoriaDB.nombre}, ya existe`,
    });
  }

  const data = {
    nombre,
    // Guardamos el id del usuario logueado
    usuario: req.usuario._id,
  };
  // Creamos la instancia del schema de  usuario y le pasamos el body que contiene los datos
  const categoria = new Categoria(data);

  // Guarda la categoria en db
  await categoria.save();

  res.status(201).json({
    categoria,
  });
};

const categoriaPut = async (req = request, res = response) => {
  const { id } = req.params;
  const { usuario, estado, ...data } = req.body;

  // Nombre de la categoria a mayus
  data.nombre = data.nombre.toUpperCase();

  //Guardamos el id del usuario logueado
  data.usuario = req.usuario._id;
  // Buscamos el usuario en bbdd por id y le enviamos todos los demas datos
  const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

  res.json({
    categoria,
  });
};

const categoriaDelete = async (req = request, res = response) => {
  const { id } = req.params;

  // Borrado logico de categoria
  const categoriaBorrada = await Categoria.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true } // Para que se reflejen los cambios ya en la propia respuesta
  );

  res.json({
    categoriaBorrada,
  });
};

const categoriaPatch = (req = request, res = response) => {
  res.json({
    msg: "patch API - controlador",
  });
};

module.exports = {
  categoriaGetAll,
  categoriaGetOne,
  categoriaPut,
  categoriaPost,
  categoriaDelete,
  categoriaPatch,
};
