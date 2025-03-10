import { addTeam, deleteTeam, changeTeam, getAllTeams, getTeamById } from "../config/database.js";

export class TeamService{
    static async addTeam(name, image_url, home_address){
        try {
            const team = await addTeam({name, image_url, home_address});

            return { success: true, team };
        } catch (error) {
            console.error("Ошибка при добавлении товара:", error);
            return { success: false, error: error.message };
        }
    }

    static async deleteTeam(id) {
        try {
            const result = await deleteTeam(id);

            if (result) {
                return { success: true, message: 'Команда удален', team: result };
            } else {
                return { success: false, message: 'Заказ не найден' };
            }
        } catch (error) {
            console.error("Ошибка при удалении заказа:", error);
            return { success: false, message: 'Ошибка при удалении товара' };
        }
    }

    static async getAllTeams() {
        try {
            const products = await getAllTeams();
            return products;
        } catch (error) {
            console.error('Ошибка при получении товаров:', error);
            throw new Error('Не удалось получить товары');
        }
    }

    static async changeTeam(id, name, image_url, home_address){
        try {
            const product = await changeTeam(id, name, image_url, home_address);
            return product;
        } catch (error) {
            throw error;
        }
    }

    static async getTeamById(id) {
        try {
            const products = await getTeamById(id);
            return products;
        } catch (error) {
            console.error('Ошибка при получении товаров:', error);
            throw new Error('Не удалось получить товары');
        }
    }
}