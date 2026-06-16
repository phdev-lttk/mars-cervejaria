// routes/upload.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

const storage = multer.diskStorage({
    destination: "uploads/cervejas/",
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const aceitos = ["image/jpeg", "image/png", "image/webp"];
        if (aceitos.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Formato inválido. Use JPG, PNG ou WebP."));
        }
    },
});

// POST /api/upload
router.post("/", authenticateToken, requireAdmin, (req, res) => {
    // Chama o multer via callback para capturar o erro aqui mesmo,
    // sem deixar vazar para o middleware global
    upload.single("imagem")(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ message: `Erro de upload: ${err.message}` });
        }
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        if (!req.file) {
            return res.status(400).json({ message: "Nenhuma imagem enviada." });
        }
        res.json({ url: `/uploads/cervejas/${req.file.filename}` });
    });
});

module.exports = router;