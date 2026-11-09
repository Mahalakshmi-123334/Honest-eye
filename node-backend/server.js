
require("dotenv").config({ path: __dirname + "/.env" });
console.log("Server key available:", Boolean(process.env.GEMINI_API_KEY));
const express = require("express");
const multer = require("multer");
const { analyzeNewsText } = require("./gemini");
const app = express();
const PORT = 5000;

app.use(express.json());

// Configure image upload
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed!"));
        }
    }
});

// Home API
app.get("/", (req, res) => {
    res.json({
        message: "Honest Eye Backend is running!"
    });
});

// Text API
app.post("/api/analyze-text", async (req, res) => {
    const { text } = req.body;

    if (!text || typeof text !== "string" || !text.trim()) {
        return res.status(400).json({
            success: false,
            message: "Please provide valid news text."
        });
    }

    try {
        const analysis = await analyzeNewsText(text);

        res.json({
            success: true,
            message: "News analyzed successfully!",
            receivedText: text,
            analysis: analysis
        });

    } catch (error) {
       console.error("Gemini error:", error.message);
console.error("Full error:", error);

        res.status(500).json({
            success: false,
            message: "Gemini analysis failed. Please check the API key and try again."
        });
    }
});
// URL API
app.post("/api/analyze-url", (req, res) => {
    const { url } = req.body;

    try {
        if (typeof url !== "string" || !url.trim()) {
            throw new Error("URL is required");
        }

        const validUrl = new URL(url);

        if (!["http:", "https:"].includes(validUrl.protocol)) {
            throw new Error("Invalid protocol");
        }

        res.json({
            success: true,
            message: "News URL received successfully!",
            receivedUrl: url
        });

    } catch (error) {
       res.status(500).json({
    success: false,
    error: error.message
});
    }
});

// Image upload API
app.post("/api/analyze-image", upload.single("image"), (req, res) => {

    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "Please upload an image."
        });
    }

    res.json({
        success: true,
        message: "Image received successfully!",
        imageName: req.file.originalname,
        imageSize: req.file.size,
        imageType: req.file.mimetype
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
