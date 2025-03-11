import express from "express";
import { NewsService } from "../services/newsService.js";

const newsController = express.Router();

newsController.post('/add-news', async (req, res) => {
    const { title, image_url, content } = req.body;

    console.log('Полученные данные на сервере:', req.body);  

    if (!title || !image_url || !content ) {
        return res.status(400).json({ success: false, error: "Все поля обязательны!" });
    }

    try {
        const newNews = await NewsService.addNews(title, image_url, content);
        console.log("Добавленная новость:", newNews); 
        return res.status(201).json({ success: true, order: newNews });
    } catch (error) {
        console.error("Ошибка при обработке заказа:", error); 
        return res.status(500).json({ success: false, error: "Ошибка при создании заказа" });
    }
});

newsController.get('/get-all-news', async (req, res) => {
    try {
        const news = await NewsService.getAllNews();
       
        if (news.length > 0) {
            return res.status(200).json({ success: true, news });
        } else {
            return res.status(404).json({ success: false, error: 'Новости не найдены' });
        }
    } catch (error) {
        console.error("Ошибка при обработке заказа:", error); 
        return res.status(500).json({ success: false, error: "Ошибка при создании заказа" });
    }
});

newsController.get('/get-news/:id', async (req, res) => {
    try {
        const {id} = req.params;

        const news = await NewsService.getNewsById(id);
       
        if (news) {
            return res.status(200).json({ success: true, news });
        } else {
            return res.status(404).json({ success: false, error: 'Новости не найдены' });
        }
    } catch (error) {
        console.error("Ошибка при обработке заказа:", error); 
        return res.status(500).json({ success: false, error: "Ошибка при создании заказа" });
    }
});


newsController.put('/change-news', async (req, res) => {
    try {
        const { id, title, image_url, content } = req.body;
        
        console.log("Controller log:", content);

        if (!title || !image_url || !content) {
            return res.status(400).json({ success: false, error: "Все поля обязательны!" });
        }

        const updatedNews = await NewsService.changeNews(id, title, image_url, content);

        if (updatedNews) {
            res.status(200).json({ success: true, message: "Товар успешно обновлён", news: updatedNews });
        } else {
            res.status(404).json({ success: false, error: "Товар не найден" });
        }
    } catch (error) {
        console.error("Ошибка при обновлении товара:", error);
        res.status(500).json({ success: false, error: "Внутренняя ошибка сервера" });
    }
});

newsController.delete("/delete-news/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await NewsService.deleteNews(id);

        if (result.success) {
            res.status(200).json({ success: true, message: result.message });
        } else {
            res.status(404).json({ success: false, error: result.message });
        }
    } catch (error) {
    }
});

export default newsController;