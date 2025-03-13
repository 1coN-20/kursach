import { exportOrdersToExcel, getOrdersData } from "../services/analitService.js";
import express from 'express';

const exportController = express.Router();

exportController.get('/export-orders', async (req, res) => {
    try {
        const filePath = await exportOrdersToExcel();
        res.download(filePath, 'Orders_Report.xlsx');
    } catch (error) {
        console.error('Ошибка при экспорте данных:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

exportController.get('/report', async (req, res) => {
    try {
        const data = await getOrdersData(); 
        res.json(data); 
    } catch (error) {
        console.error('Ошибка при получении данных отчета:', error);
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

export default exportController;