import express from "express";
import {createUserValidation} from "../validation/authValidation.js";
import bcrypt from "bcrypt";
import {decodeAccessToken, generateAccessToken} from "../utils/jwt.js";
import {UserService} from "../services/userService.js";

const userService = new UserService();

const authController = express.Router();

authController.post("/register", async (req, res) => {
    console.log('Request body:', req.body);  
    const validation = createUserValidation.safeParse(req.body);

    if (!validation.success) {
        console.log('Validation error:', validation.error.errors); 
        return res.status(400).json(validation.error.errors);
    }

    const existingUser = await userService.findUserByEmail(req.body.email);
    if (existingUser) {
        return res.status(400).json({ message: "Пользователь уже существует" });
    }

    const user = await userService.createUser(req.body);
    console.log('User created:', user);

    return res.status(200).json(user);
});


authController.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await userService.findUserByEmail(email);

    user.isAdmin = user.isadmin;
    delete user.isadmin;
        
    console.log('User from DB:', user);
        
    if (!user) {
        return res.status(401).json({ message: "Wrong email or password" });
    }
        
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    console.log('Password Valid:', isPasswordValid);
        
    if (isPasswordValid) {
        const token = generateAccessToken({ id: user.id, isAdmin: user.isAdmin, name: user.name, email: user.email, phone_number: user.phone_number, delivery_address: user.delivery_address});
            
        return res.status(200).json({ 
            token, 
            isAdmin: user.isAdmin,
            name: user.name,
            email: user.email,
            phone_number: user.phone_number,
            delivery_address: user.delivery_address
        });
    }
        
    return res.status(401).json({ message: "Wrong email or password" });
});
        
authController.get("/check", async (req, res) => {

    const decodedUser = decodeAccessToken(req.headers.authorization)

    if(decodedUser){
        return res.status(200).json({decodedUser});
    }

    return res.status(401).json({message:"Token is invalid"});

})

authController.get("/users", async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        return res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Ошибка при получении пользователей" });
    }
});

authController.get("/users/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const user = await userService.findUserById(id);
        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Ошибка при получении пользователя" });
    }
});

authController.put("/update-users", async (req, res) => {
    const { id, name, email, phone_number, delivery_address } = req.body;

    console.log('Полученные данные для обновления:', req.body);
    try {

        const updatedUser = await userService.updateUserInfo(id, name, email, phone_number, delivery_address);
        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Ошибка при обновлении данных пользователя" });
    }
});

authController.delete("/users/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await userService.deleteUser(id);
        return res.status(200).json({ message: "Пользователь удален" });
    } catch (error) {

    }
});

authController.put("/update-admin-true/:id", async (req, res) =>{
    const {id} = req.params;

    try {
        await userService.updateAdminTrue(id);
        return res.status(200).json({ message: "Admin True" });
    } catch (error) {
        throw error;
    }
});

authController.put("/update-admin-false/:id", async (req, res) =>{
    const {id} = req.params;

    try {
        await userService.updateAdminFalse(id);
        return res.status(200).json({ message: "Admin False" });
    } catch (error) {
        throw error;
    }
});

export default authController;