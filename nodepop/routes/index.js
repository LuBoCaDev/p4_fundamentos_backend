const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// MOSTRAR PRODUCTOs (GET /)
router.get('/', async (req, res) => {
    const { tag, name, price, skip = 0, limit = 10, sort = 'name' } = req.query;

    const filter = {};  //filtros
    if (tag) filter.tags = tag; // tag
    if (name) filter.name = new RegExp('^' + name, 'i'); // nombre
    if (price) { // precios
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


module.exports = router;