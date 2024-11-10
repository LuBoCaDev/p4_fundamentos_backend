import { query, validationResult } from 'express-validator';
import Product from '../models/Product.js'; 

export async function index(req, res, next) {
  try {
    const now = new Date();
    const userId = req.session.userId;

    // Parámetros de búsqueda y paginación
    const { name, priceMin, priceMax, tag, skip = 0, limit = 10, sort = 'name' } = req.query;
    const searchParams = { name, priceMin, priceMax, tag };

    const filter = { owner: userId };

    if (tag) filter.tags = tag;
    if (priceMin && priceMax) filter.price = { $gte: priceMin, $lte: priceMax };
    if (name) filter.name = new RegExp(`^${name}`, 'i');

    // Obtener productos con los filtros aplicados
    const products = await Product.find(filter)
      .skip(Number(skip))
      .limit(Number(limit))
      .sort(sort || 'name');

    // Calcular la paginación
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);
    const currentPage = Math.floor(skip / limit) + 1;

    // Renderizar la vista con los productos, parámetros de búsqueda y paginación
    res.render('home', {
      products,
      searchParams,
      currentPage,
      totalPages,
      limit,
      skip: Number(skip),
    });
    
  } catch (err) {
    next(err);
  }
}


export function paranInRouteExample(req, res, next) {
  const num = req.params.num;
  res.send('Received ' + num);
}

export function paranInRouteMultipleExample(req, res, next) {
  const product = req.params.product;
  const size = req.params.size;
  const color = req.params.color;
  res.send(`Received ${product} size ${size} color ${color}`);
}

export function paramInQuery(req, res, next) {
  const size = req.query.size;
  const color = req.query.color;
  res.send(`Received size ${size} color ${color}`);
}

export function createExample(req, res, next) {
  const item = req.body.item;
  assert(item, 'item is required');
  res.send('Received ' + item);
}

export const validateQueryExampleValidations = [
  query('param1')
    .isLength({ min: 4 })
    .withMessage('min 4 characters'),
  query('param2')
    .isNumeric()
    .withMessage('must be numeric'),
  query('param3')
    .custom(value => value === '42')
    .withMessage('must be 42')
];

export function validateQueryExample(req, res, next) {
  validationResult(req).throw();
  const param1 = req.query.param1;
  const param2 = req.query.param2;
  res.send(`Validated ${param1} ${param2}`);
}
