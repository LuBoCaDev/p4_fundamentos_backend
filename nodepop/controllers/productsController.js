import createError from 'http-errors';
import Product from '../models/Product.js';

export async function getAllProducts(req, res, next) {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        next(createError(500, 'Error al obtener los productos'));
    }
}

export async function postNew(req, res, next) {
    const { name, price, image, tags } = req.body;
    const product = new Product({
        name,
        owner: req.user._id,
        price,
        image,
        tags
    });

    try {
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        next(createError(400, 'Error al crear el producto'));
    }
}

export async function deleteProduct(req, res, next) {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
        return next(createError(404, 'Producto no encontrado'));
    }

    if (product.owner.toString() !== req.user._id.toString()) {
        return next(createError(403, 'No tienes permiso para eliminar este producto'));
    }

    await product.remove();
    res.status(204).end();
}

export async function updateProduct(req, res, next) {
    const { name, price, image, tags } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (!product) {
        return next(createError(404, 'Producto no encontrado'));
    }

    if (product.owner.toString() !== req.user._id.toString()) {
        return next(createError(403, 'No tienes permiso para editar este producto'));
    }

    product.name = name || product.name;
    product.price = price || product.price;
    product.image = image || product.image;
    product.tags = tags || product.tags;

    try {
        await product.save();
        res.json(product);
    } catch (error) {
        next(createError(400, 'Error al actualizar el producto'));
    }
}