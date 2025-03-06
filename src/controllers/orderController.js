import { OrderService } from "../services/orderService.js";
import express from "express";

const orderController = express.Router();

orderController.post('/add-order', async (req, res) => {
    const { name, email, phone_number, delivery_address, product_id, quantity } = req.body;

    console.log('Полученные данные на сервере:', req.body);  

    if (!name || !email || !phone_number || !delivery_address || !product_id || !quantity) {
        return res.status(400).json({ success: false, error: "Все поля обязательны!" });
    }

    try {
        const newOrder = await OrderService.addOrder(name, email, phone_number, delivery_address, product_id, quantity);
        console.log("Добавленный заказ:", newOrder); 
        return res.status(201).json({ success: true, order: newOrder });
    } catch (error) {
        console.error("Ошибка при обработке заказа:", error); 
        return res.status(500).json({ success: false, error: "Ошибка при создании заказа" });
    }
});

// Получение всех заказов
orderController.get("/get-orders", async (req, res) => {
    try {
        const orders = await OrderService.getAllOrders();
        console.log("Полученные заказы:", orders);  

        if (!orders || orders.length === 0) {
            return res.status(404).json({ success: false, error: 'Нет заказов' });
        }

        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error("Ошибка при получении заказов:", error);
        return res.status(500).json({ success: false, error: 'Ошибка при получении заказов' });
    }
});

orderController.get("/get-allorders", async (req, res) => {
    try {
        const orders = await OrderService.getToAllOrdersTable();
        console.log("Все заказы:", orders);  

        if (!orders || orders.length === 0) {
            return res.status(404).json({ success: false, error: 'Нет заказов' });
        }

        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error("Ошибка при получении всех заказов:", error);
        return res.status(500).json({ success: false, error: 'Ошибка при получении всех заказов' });
        
    }
});

orderController.delete("/delete-order/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await OrderService.deleteOrder(id);

        if (result.success) {
            res.status(200).json({ success: true, message: result.message });
        } else {
            res.status(404).json({ success: false, error: result.message });
        }
    } catch (error) {
    }
});

orderController.put("/update-status/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await OrderService.updateOrderStatus(id);
        console.log("Результат запроса:", result);

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, error: "Заказ не найден" });
        }

        res.status(200).json({ success: true, message: "Статус заказа обновлён" });
    } catch (error) {
        console.error("Ошибка при обновлении статуса заказа:", error);
        res.status(500).json({ success: false, error: "Ошибка сервера" });
    }
});

orderController.put("/cancel-status/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await OrderService.cancelOrderStatus(id);

        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, error: "Заказ не найден" });
        }

        res.status(200).json({ success: true, message: "Статус заказа обновлён" });
    } catch (error) {
        console.error("Ошибка при обновлении статуса заказа:", error);
        res.status(500).json({ success: false, error: "Ошибка сервера" });
    }
});

orderController.get("/get-userorder/:userName", async (req, res) => {
    try {
        const { userName } = req.params;
        console.log("Получен запрос на заказы пользователя:", userName);

        const orders = await OrderService.getUsersOrders(userName);
        console.log("Заказы из сервиса:", orders); 

        if (!orders || orders.length === 0) {
            return res.status(404).json({ success: false, error: "Заказы не найдены" });
        }

        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error("Ошибка при получении заказов:", error);
        res.status(500).json({ success: false, error: "Внутренняя ошибка сервера" });
    }
});



export default orderController;
