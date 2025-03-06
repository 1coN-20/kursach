import { addProduct, deleteProduct, getAllProducts, 
        changeProduct, getProductById, minusQuantity } from "../config/database.js";

export class ProductService {
    static async addProduct(name, image_url, price, quantity) {
        try {
            const product = await addProduct({ name, image_url, price, quantity });

            return { success: true, product };
        } catch (error) {
            console.error("Ошибка при добавлении товара:", error);
            return { success: false, error: error.message };
        }
    }

    static async deleteProduct(productId) {
        try {
            const result = await deleteProduct(productId);

            if (result) {
                return { success: true, message: 'Заказ удален', order: result };
            } else {
                return { success: false, message: 'Заказ не найден' };
            }
        } catch (error) {
            console.error("Ошибка при удалении заказа:", error);
            return { success: false, message: 'Ошибка при удалении товара' };
        }
    }

    static async getAllProducts() {
        try {
            const products = await getAllProducts();
            return products;
        } catch (error) {
            console.error('Ошибка при получении товаров:', error);
            throw new Error('Не удалось получить товары');
        }
    }

    static async getProductById(id) {
        try {
            const products = await getProductById(id);
            return products;
        } catch (error) {
            console.error('Ошибка при получении товаров:', error);
            throw new Error('Не удалось получить товары');
        }
    }

    static async changeProduct(id, name, image_url, price, quantity){
        try {
            const product = await changeProduct(id, name, image_url, price, quantity);
            return product;
        } catch (error) {
            throw error;
        }
    }

    static async minusQuantity(id, orderQuantity){
        try{
        const quantity = await minusQuantity(id, orderQuantity);
        return quantity;
        }catch(error){
            throw error;
        }
    }
}
