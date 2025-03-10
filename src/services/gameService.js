import pool from "../config/database.js";

export class GameService {
    static async addGame(enemy, home, date) {
        try {
            const result = await pool.query(`
                INSERT INTO "Games" (enemy, home, date)
                VALUES ($1, $2, $3)
                RETURNING *;
            `, [enemy, home, date]);

            return result.rows[0];
        } catch (error) {
            console.error("Ошибка при добавлении игры:", error);
            throw error;
        }
    }

    static async getAllGames() {
        try {
            const result = await pool.query(`
                SELECT g.id AS game_id, 
                       g.home, 
                       g.date, 
                       t.id AS team_id, 
                       t.name AS team_name, 
                       t.image_url AS team_image_url, 
                       t.home_address AS team_home_address, 
                       t.created_at AS team_created_at, 
                       t.updatedAt AS team_updated_at
                FROM "Games" g
                JOIN "Teams" t ON g.enemy = t.id
                ORDER BY g.date DESC;
            `);
            return result.rows;
        } catch (error) {
            console.error("Ошибка при получении списка игр:", error);
            throw error;
        }
    }

    static async getGameById(id) {
        try {
            const result = await pool.query(`
                SELECT g.id AS game_id, 
                       g.enemy, 
                       g.home, 
                       g.date, 
                       g.created_at AS game_created_at, 
                       g.updatedAt AS game_updated_at, 
                       t.id AS team_id, 
                       t.name AS team_name, 
                       t.image_url AS team_image_url, 
                       t.home_address AS team_home_address, 
                       t.created_at AS team_created_at, 
                       t.updatedAt AS team_updated_at
                FROM "Games" g
                JOIN "Teams" t ON g.enemy = t.id
                WHERE g.id = $1;
            `, [id]);
            return result.rows[0];
        } catch (error) {
            console.error("Ошибка при получении игры по ID:", error);
            throw error;
        }
    }

    static async deleteGame(id) {
        try {
            const result = await pool.query(`DELETE FROM "Games" WHERE id = $1 RETURNING *;`, [id]);
            return result.rows[0];
        } catch (error) {
            console.error("Ошибка при удалении игры:", error);
            throw error;
        }
    }

    static async updateGame( id, enemy, home, date ){
        try {
            const result = await pool.query(
                `UPDATE "Games" SET enemy = $1, home = $2, date = $3 WHERE id = $4 RETURNING *`,
                [enemy, home, date, id]
            );
            return result.rows;
        } catch (error) {
            console.error("Ошибка при удалении игры:", error);
            throw error;
        }
    }
}