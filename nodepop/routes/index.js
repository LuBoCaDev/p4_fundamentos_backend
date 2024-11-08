import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// MOSTRAR PRODUCTOS (GET /api/products)
router.get('/api/products', async (req, res) => {
    const { tag, name, price, skip = 0, limit = 10, sort = 'name' } = req.query;

    const filter = {};
    if (tag) filter.tags = tag;
    if (name) filter.name = new RegExp('^' + name, 'i');
    if (price) {
        const [min, max] = price.split('-');
        if (min) filter.price = { ...filter.price, $gte: min };
        if (max) filter.price = { ...filter.price, $lte: max };
    }

    try {
        const products = await Product.find(filter)
            .skip(parseInt(skip))
            .limit(parseInt(limit))
            .sort(sort);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching products' });
    }
});

// RUTA PRINCIPAL (GET /) que renderiza la vista 'home'
router.get('/', async (req, res) => {
    try {
        const products = await Product.find(); // Obtener los productos desde la base de datos
        res.render('home', { products }); // Pasar los productos a la vista 'home'
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

export default router;
