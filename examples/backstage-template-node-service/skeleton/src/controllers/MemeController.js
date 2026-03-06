const Meme = require("../models/Meme");
const { getPool } = require("../db");

class MemeController {
  static async getAllMemes(req, res) {
    try {
      const { rows } = await getPool().query(
        'SELECT id, title, description, image_url AS "imageUrl", category, tags, likes, views, created_at AS "createdAt", updated_at AS "updatedAt" FROM memes ORDER BY id'
      );
      res.json(rows);
    } catch (error) {
      console.error("Error getting memes:", error);
      res.status(500).json({
        error: "Internal server error",
        message: "Failed to retrieve memes",
      });
    }
  }

  static async getMemeById(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const { rows } = await getPool().query(
        'SELECT id, title, description, image_url AS "imageUrl", category, tags, likes, views, created_at AS "createdAt", updated_at AS "updatedAt" FROM memes WHERE id = $1',
        [id]
      );
      if (rows.length === 0) {
        return res.status(404).json({
          error: "Not found",
          message: `Meme with id ${id} not found`,
        });
      }
      res.json(rows[0]);
    } catch (error) {
      console.error("Error getting meme by id:", error);
      res.status(500).json({
        error: "Internal server error",
        message: "Failed to retrieve meme",
      });
    }
  }

  static async createMeme(req, res) {
    try {
      const validationErrors = Meme.validateCreateRequest(req.body);
      if (validationErrors.length > 0) {
        return res.status(400).json({
          error: "Validation failed",
          message: "Request validation failed",
          details: validationErrors,
        });
      }
      const newMeme = Meme.fromRequest(req.body);
      const { rows } = await getPool().query(
        'INSERT INTO memes (title, description, image_url, category, tags, likes, views) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id, title, description, image_url AS "imageUrl", category, tags, likes, views, created_at AS "createdAt", updated_at AS "updatedAt"',
        [
          newMeme.title,
          newMeme.description,
          newMeme.imageUrl,
          newMeme.category,
          newMeme.tags,
          newMeme.likes,
          newMeme.views,
        ]
      );
      res.status(201).json(rows[0]);
    } catch (error) {
      console.error("Error creating meme:", error);
      res.status(500).json({
        error: "Internal server error",
        message: "Failed to create meme",
      });
    }
  }

  static async updateMeme(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const validationErrors = Meme.validateCreateRequest(req.body);
      if (validationErrors.length > 0) {
        return res.status(400).json({
          error: "Validation failed",
          message: "Request validation failed",
          details: validationErrors,
        });
      }
      const { rows } = await getPool().query(
        'UPDATE memes SET title=$1, description=$2, image_url=$3, category=$4, tags=$5, likes=$6, views=$7, updated_at=now() WHERE id=$8 RETURNING id, title, description, image_url AS "imageUrl", category, tags, likes, views, created_at AS "createdAt", updated_at AS "updatedAt"',
        [
          req.body.title,
          req.body.description,
          req.body.imageUrl,
          req.body.category,
          req.body.tags,
          req.body.likes,
          req.body.views,
          id,
        ]
      );
      if (rows.length === 0) {
        return res.status(404).json({
          error: "Not found",
          message: `Meme with id ${id} not found`,
        });
      }
      res.json(rows[0]);
    } catch (error) {
      console.error("Error updating meme:", error);
      res.status(500).json({
        error: "Internal server error",
        message: "Failed to update meme",
      });
    }
  }

  static async deleteMeme(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const { rowCount } = await getPool().query(
        "DELETE FROM memes WHERE id=$1",
        [id]
      );
      if (rowCount === 0) {
        return res.status(404).json({
          error: "Not found",
          message: `Meme with id ${id} not found`,
        });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting meme:", error);
      res.status(500).json({
        error: "Internal server error",
        message: "Failed to delete meme",
      });
    }
  }
}

module.exports = MemeController;
