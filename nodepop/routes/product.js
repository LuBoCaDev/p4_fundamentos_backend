const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { isAuthenticated } = require('../middlewares/auth'); // Asumiendo que tienes un middleware de autenticación

// CREAR PRDUCTO 
router.post('/products', isAuthenticated, async (req, res) => {
    const { name, price, image, tags } = req.body;
    const product = new Product({
        name,
        owner: req.user._id, // Asegúrate de que req.user contiene el usuario autenticado
        price,
        image,
        tags
    });

    try {
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: 'Error creating product' });
    }
});

// ELIMINAR PRODUCTO
router.delete('/products/:id', isAuthenticated, async (req, res) => {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    if (product.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'You do not have permission to delete this product' });
    }

    await product.remove();
    res.status(204).end();
});

// eDITAR PRODUCTO
router.put('/products/:id', isAuthenticated, async (req, res) => {
    const { name, price, image, tags } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    if (product.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'You do not have permission to edit this product' });
    }

    // actualizar cmapos
    product.name = name || product.name;
    product.price = price || product.price;
    product.image = image || product.image;
    product.tags = tags || product.tags;

    try {
        await product.save();
        res.json(product);
    } catch (error) {
        res.status(400).json({ error: 'Error updating product' });
    }
});

module.exports = router;
