import { addUser, findUserByEmail, getAllUsers, 
        deleteUserById, updateAdminFalse, updateAdminTrue,
        updateUserInfo } from "../config/database.js";
import bcrypt from "bcrypt";

export class UserService {

    async createUser(body) {
        body.password = bcrypt.hashSync(body.password, 12);

        const user = await addUser(body);
        return user;
    }

    async findUserByEmail(email) {
        const user = await findUserByEmail(email);
        return user;
    }

    async findUserById(id) {
        const result = await pool.query(
            'SELECT * FROM "User" WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }
    
    async getAllUsers() {
        try {
            const users = await getAllUsers();
            return users;
        } catch (error) {
            console.error("Ошибка при получении всех пользователей:", error);
            throw error;
        }
    }

    async deleteUser(id) {
        try {
            const result = await deleteUserById(id);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async updateAdminFalse(id){
        try {
            const result = await updateAdminFalse(id);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async updateAdminTrue(id){
        try {
            const result = await updateAdminTrue(id);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async updateUserInfo(id, name, email, phone_number, delivery_address){
        try {
            console.log('updateUserInfo params:', { id, name, email, phone_number, delivery_address });
            const result = await updateUserInfo(id, name, email, phone_number, delivery_address);
            return result;
        } catch (error) {
            throw error;
        }
    }

}
