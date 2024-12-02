import express, { Express, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import PCBox from "./models/PCBoxSchema";

const app: Express = express();
const PORT: any = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());
require("dotenv").config();

//MongoDB Atlas
mongoose
    .connect(process.env.MONGO_URI || "", {})
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));

//Endpoint: Obtener pokemones de PC Box
app.get("/api/pc-box", async (req: Request, res: Response) => {
    try {
        const pcBoxPokemon = await PCBox.find();
        res.status(200).json(pcBoxPokemon);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch PC Box Pokemon" });
    }
});

//Endpoint: Guardar pokemones en PC Box
app.post("/api/pc-box", async (req: Request, res: Response) => {
    const { id, name, image, type } = req.body;

    try {
        const newPokemon = new PCBox({ id, name, image, type });
        await newPokemon.save();
        res.status(201).json({ message: "Pokemon saved to PC Box" });
    } catch (error) {
        res.status(500).json({ message: "Failed to save Pokemon to PC Box" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
