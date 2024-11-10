import createError from 'http-errors';
import Product from '../models/Product.js';

// Función para listar productos con paginación y filtros
export async function listProducts(req, res, next) {
  try {
    const userId = req.session.userId;
    const { skip = 0, limit = 10, sort, tag, priceMin, priceMax, name } = req.query;

    const filter = { owner: userId };
    if (tag) filter.tags = tag;
    if (priceMin && priceMax) filter.price = { $gte: priceMin, $lte: priceMax };
    if (name) filter.name = new RegExp(`^${name}`, 'i');

    const productos = await Product.find(filter)
      .skip(Number(skip))
      .limit(Number(limit))
      .sort(sort || 'name');

    res.render('products-list', { productos, skip: Number(skip), limit: Number(limit) });
  } catch (err) {
    next(err);
  }
}

// Función para mostrar la vista de creación de producto
export function index(req, res, next) {
  res.render('new-product');
}

// Función para crear un nuevo producto
export async function postNew(req, res, next) {
  try {
    const userId = req.session.userId;
    const { name, price, image, tags } = req.body;

    const product = new Product({
      name,
      owner: userId,
      price,
      image,
      tags
    });

    await product.save();

    res.redirect('/');
  } catch (err) {
    next(err);
  }
}

// Función para eliminar un producto
export async function deleteProduct(req, res, next) {
  const userId = req.session.userId;
  const productId = req.params.productId;

  const product = await Product.findOne({ _id: productId });

  if (!product) {
    console.warn(`WARNING - el usuario ${userId} está intentando eliminar un producto inexistente`);
    return next(createError(404, 'Not found'));
  }

  if (product.owner.toString() !== userId) {
    console.warn(`WARNING - el usuario ${userId} está intentando eliminar un producto de otro usuario`);
    return next(createError(401, 'Not authorized'));
  }

  await Product.deleteOne({ _id: productId });

  res.redirect('/');
}

// Función para editar un producto
export async function editProduct(req, res, next) {
  const userId = req.session.userId;
  const productId = req.params.productId;
  const { name, price, image, tags } = req.body;

  const product = await Product.findOne({ _id: productId });

  if (!product) {
    console.warn(`WARNING - el usuario ${userId} está intentando editar un producto inexistente`);
    return next(createError(404, 'Not found'));
  }

  if (product.owner.toString() !== userId) {
    console.warn(`WARNING - el usuario ${userId} está intentando editar un producto de otro usuario`);
    return next(createError(401, 'Not authorized'));
  }

  product.name = name;
  product.price = price;
  product.image = image;
  product.tags = tags;

  await product.save();

  res.redirect('/');
}