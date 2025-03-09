import { addNews, getAllNews, getNewsById, 
        changeNews, deleteNews } from  "../config/database.js";

export class NewsService{
    static async addNews(title, image_url, content) {
        try {
            const result = await addNews({ title, image_url, content});
            return result;
        } catch (error) {
            console.error("Ошибка при добавлении новости:", error);
            throw error;
        }
    }

    static async getAllNews(){
        try {
            const result = await getAllNews();
            return result;
        } catch (error) {
            console.error("Ошибка получения новостей:", error);
            throw error;
        }
    }

    static async getNewsById(id){
        try {
            const result = await getNewsById(id);
            return result;
        } catch (error) {
            console.error("Ошибка получения новостей:", error);
            throw error;
        }
    }

    static async changeNews(id, title, image_url, content){
        try {
            const product = await changeNews(id, title, image_url, content);
            return product;
        } catch (error) {
            throw error;
        }
    }

    static async deleteNews(id){
        try {
            const result = await deleteNews(id);
            if (result) {
                return { success: true, message: 'Заказ удален', news: result };
            } else {
                return { success: false, message: 'Заказ не найден' };
            }
        } catch (error) {
            console.error("Ошибка при удалении news:", error);
            return { success: false, message: 'Ошибка при удалении news' };
        }
    }
}