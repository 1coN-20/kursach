import { ProductService } from "../services/productService.js";
import express from 'express';

const productController = express.Router();

productController.post('/add-product', async (req, res) => {
    const { name, image_url, price, quantity } = req.body;

    if (!name || !image_url || !price || !quantity) {
        return res.status(400).json({ success: false, error: "Все поля обязательны!" });
    }

    try {
        const result = await ProductService.addProduct(name, image_url, price, quantity);
        
        if (result.success) {
            return res.status(201).json({ success: true, product: result.product });
        } else {
            return res.status(500).json({ success: false, error: result.error });
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: "Произошла ошибка при добавлении товара!" });
    }
});

productController.delete('/delete-product/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await ProductService.deleteProduct(id);

        if (result.success) {
            res.status(200).json({ success: true, message: result.message });
        } else {
            res.status(404).json({ success: false, error: result.message });
        }
    } catch (error) {
    }
});

productController.get('/get-products', async (req, res) => {
    try {
        const products = await ProductService.getAllProducts();

        if (products.length > 0) {
            return res.status(200).json({ success: true, products });
        } else {
            return res.status(404).json({ success: false, error: 'Товары не найдены' });
        }
    } catch (error) {
        console.error('Ошибка при получении товаров:', error);
        return res.status(500).json({ success: false, error: 'Произошла ошибка при получении товаров!' });
    }
});

productController.get('/get-products/:id', async (req, res) => {
    try {
        const {id} = req.params;

        const products = await ProductService.getAllProducts(id);

        if (products.length > 0) {
            return res.status(200).json({ success: true, products });
        } else {
            return res.status(404).json({ success: false, error: 'Товары не найдены' });
        }
    } catch (error) {
        console.error('Ошибка при получении товаров:', error);
        return res.status(500).json({ success: false, error: 'Произошла ошибка при получении товаров!' });
    }
});

productController.put('/change-product', async (req, res) => {
    try {
        const { productId, name, image_url, price, quantity } = req.body;

        if (!name || !image_url || !price || !quantity) {
            return res.status(400).json({ success: false, error: "Все поля обязательны!" });
        }

        const updatedProduct = await ProductService.changeProduct(productId, name, image_url, price, quantity);

        if (updatedProduct) {
            res.status(200).json({ success: true, message: "Товар успешно обновлён", product: updatedProduct });
        } else {
            res.status(404).json({ success: false, error: "Товар не найден" });
        }
    } catch (error) {
        console.error("Ошибка при обновлении товара:", error);
        res.status(500).json({ success: false, error: "Внутренняя ошибка сервера" });
    }
});


productController.put('/minus', async (req, res) => {
    try {
        const {id, orderQuantity} = req.body;

        if (!id || !orderQuantity) {
            return res.status(400).json({ success: false, error: "Все поля обязательны!" });
        }

        const minus = await ProductService.minusQuantity(id, orderQuantity);

        if (minus) {
            res.status(200).json({ success: true, message: "Товар вычтен", product: minus });
        } else {
            res.status(404).json({ success: false, error: "Товар не вычтен" });
        }
    } catch (error) {
        throw error;
    }
});


export default productController;
