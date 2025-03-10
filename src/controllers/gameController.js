import { GameService } from "../services/gameService.js";
import express from 'express';

const gameController = express.Router();

gameController.post('/add-game', async (req, res) => {
    const { enemy, home, date } = req.body;

    if (!enemy || home === undefined || !date) {
        return res.status(400).json({ success: false, error: "Все поля обязательны!" });
    }

    try {
        const game = await GameService.addGame(enemy, home, date);
        return res.status(201).json({ success: true, game });
    } catch (error) {
        console.error("Ошибка при добавлении игры:", error);
        return res.status(500).json({ success: false, error: "Ошибка сервера при добавлении игры!" });
    }
});

gameController.get('/get-games', async (req, res) => {
    try {
        const games = await GameService.getAllGames();

        if (games.length > 0) {
            return res.status(200).json({ success: true, games });
        } else {
            return res.status(404).json({ success: false, error: "Игры не найдены" });
        }
    } catch (error) {
        console.error("Ошибка при получении игр:", error);
        return res.status(500).json({ success: false, error: "Ошибка сервера при получении игр!" });
    }
});

gameController.get('/get-game/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const game = await GameService.getGameById(id);

        if (game) {
            return res.status(200).json({ success: true, game });
        } else {
            return res.status(404).json({ success: false, error: "Игра не найдена" });
        }
    } catch (error) {
        console.error("Ошибка при получении игры:", error);
        return res.status(500).json({ success: false, error: "Ошибка сервера при получении игры!" });
    }
});

gameController.delete('/delete-game/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedGame = await GameService.deleteGame(id);

        if (deletedGame) {
            return res.status(200).json({ success: true, message: "Игра успешно удалена", game: deletedGame });
        } else {
            return res.status(404).json({ success: false, error: "Игра не найдена" });
        }
    } catch (error) {
        console.error("Ошибка при удалении игры:", error);
        return res.status(500).json({ success: false, error: "Ошибка сервера при удалении игры!" });
    }
});

gameController.put('/update-game', async (req, res) => {
    try {
        const { id, enemy, home, date } = req.body;
        
        const result = await GameService.updateGame( id, enemy, home, date);

        if (result.rowCount > 0) {
            return res.status(200).json({ success: true, game: result.rows[0] });
        } 
    } catch (error) {
        location.reload();
    }
});

export default gameController;