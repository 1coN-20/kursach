import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import authController from './src/controllers/authController.js';
import productController from './src/controllers/productController.js';
import orderController from './src/controllers/orderController.js';
import newsController from './src/controllers/newsController.js';
import teamController from './src/controllers/teamController.js';
import gameController from './src/controllers/gameController.js';
import { createUserTable, createProductTable, createOrdersTable, createAllOrdersTable, createNewsTable, createTeamsTable, createGamesTable } from './src/config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/web', express.static(path.join(process.cwd(), 'web')));

app.use('/controllers', authController);
app.use('/controllers', productController);
app.use('/controllers', orderController);
app.use('/controllers', newsController);
app.use('/controllers', teamController);
app.use('/controllers', gameController);

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
createNewsTable()
    .then(() => {
        console.log("News table is ready.");
    })
    .catch((err) => {
        console.error("Error creating News table:", err);
    });
createTeamsTable()
    .then(() => {
        console.log("Teams table is ready.");
    })
    .catch((err) => {
        console.error("Error creating Teams table:", err);
    });
createGamesTable()
    .then(() => {
        console.log("Games table is ready.");
    })
    .catch((err) => {
        console.error("Error creating Games table:", err);
    });


app.get('/', (req, res) => {
    res.send('Welcome to the server!'); 
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
