import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import authController from './src/controllers/authController.js';
import productController from './src/controllers/productController.js';
import orderController from './src/controllers/orderController.js';
import { createUserTable, createProductTable, createOrdersTable, createAllOrdersTable } from './src/config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware для парсинга JSON
app.use(express.json());

app.use('/web', express.static(path.join(process.cwd(), 'web')));

// Подключение маршрутов
app.use('/controllers', authController);
app.use('/controllers', productController);
app.use('/controllers', orderController);

createUserTable()
    .then(() => {
        console.log("User table is ready.");
    })
    .catch((err) => {
        console.error("Error creating User table:", err);
    });

createProductTable()
    .then(() => {
        console.log("Product table is ready.");
    })
    .catch((err) => {
        console.error("Error creating Product table:", err);
    });

createOrdersTable()
    .then(() => {
        console.log("Orders table is ready.");
    })
    .catch((err) => {
        console.error("Error creating Orders table:", err);
    });
createAllOrdersTable()
    .then(() => {
        console.log("All Orders table is ready.");
    })
    .catch((err) => {
        console.error("Error creating All Orders table:", err);
    });

app.get('/', (req, res) => {
    res.send('Welcome to the server!'); 
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
