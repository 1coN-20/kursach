import express from "express";
import { TeamService } from "../services/teamService.js";

const teamController = express.Router();

teamController.post('/add-team', async (req, res) => {
    const { name, image_url, home_address } = req.body;

    if (!name || !image_url || !home_address ) {
        return res.status(400).json({ success: false, error: "Все поля обязательны!" });
    }

    try {
        const result = await TeamService.addTeam(name, image_url, home_address);
        if (result.success) {
            return res.status(201).json({ success: true, team: result.team });
        } else {
            return res.status(500).json({ success: false, error: result.error });
        }
    } catch (error) {
        return res.status(500).json({ success: false, error: "Произошла ошибка при добавлении товара!" });
    }
});

teamController.delete('/delete-team/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await TeamService.deleteTeam(id);

        if (result.success) {
            res.status(200).json({ success: true, message: result.message });
        } else {
            res.status(404).json({ success: false, error: result.message });
        }
    } catch (error) {
    }
});

teamController.get('/get-teams', async (req, res) => {
    try {
        const teams = await TeamService.getAllTeams();

        if (teams.length > 0) {
            return res.status(200).json({ success: true, teams });
        } else {
            return res.status(404).json({ success: false, error: 'Товары не найдены' });
        }
    } catch (error) {
        console.error('Ошибка при получении товаров:', error);
        return res.status(500).json({ success: false, error: 'Произошла ошибка при получении товаров!' });
    }
});

teamController.put('/change-team', async (req, res) => {
    try {
        const { id, name, image_url, home_address } = req.body;

        if (!name || !image_url || !home_address) {
            return res.status(400).json({ success: false, error: "Все поля обязательны!" });
        }

        const updatedTeam = await TeamService.changeTeam(id, name, image_url, home_address);

        if (updatedTeam) {
            res.status(200).json({ success: true, message: "Team успешно обновлён", team: updatedTeam });
        } else {
            res.status(404).json({ success: false, error: "Товар не найден" });
        }
    } catch (error) {
        console.error("Ошибка при обновлении товара:", error);
        res.status(500).json({ success: false, error: "Внутренняя ошибка сервера" });
    }
});

teamController.get('/get-team/:id', async (req, res) => {
    try {
        const {id} = req.params;

        const team = await TeamService.getTeamById(id);

        if (team.length > 0) {
            return res.status(200).json({ success: true, team });
        } else {
            return res.status(200).json({ success: true, team });
        }
    } catch (error) {
        console.error('Ошибка при получении товаров:', error);
        return res.status(500).json({ success: false, error: 'Произошла ошибка при получении товаров!' });
    }
});

export default teamController;