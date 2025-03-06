import { addOrder, getAllOrders, deleteOrder, 
        getToAllOrdersTable, updateOrderStatus,
        cancelOrderStatus, getUsersOrders } from "../config/database.js";

export class OrderService {
    
    static async addOrder(name, email, phone_number, delivery_address, product_id, quantity) {
        try {
            const result = await addOrder({ name, email, phone_number, delivery_address, product_id, quantity });
            return result;
        } catch (error) {
            console.error("Ошибка при добавлении заказа:", error);
            throw error;
        }
    }

    static async getAllOrders() {
        try {
            const result = await getAllOrders();
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async deleteOrder(id) {
        try {
            const result = await deleteOrder(id);
            if (result) {
                return { success: true, message: 'Заказ удален', order: result };
            } else {
                return { success: false, message: 'Заказ не найден' };
            }
        } catch (error) {
            console.error("Ошибка при удалении заказа:", error);
            return { success: false, message: 'Ошибка при удалении заказа' };
        }
    }

    static async getToAllOrdersTable(){
        try {
            const result = await getToAllOrdersTable();
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async updateOrderStatus(orderId){
        try {
            const result = await updateOrderStatus(orderId);
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async cancelOrderStatus(orderId){
        try {
            const result = await cancelOrderStatus(orderId);
            return result;
        } catch (error) {
            throw error;
        }
    }

    static async getUsersOrders(userName){
        try {
            const result = await getUsersOrders(userName);
            return result;
        } catch (error) {
            throw error;
        }
    }
}
