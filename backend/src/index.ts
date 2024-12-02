import express, { Express, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import Database from "better-sqlite3";
import mongoose from "mongoose";
import PCBox from "./models/PCBoxSchema";

const app: Express = express();
const PORT: any = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

//SQLite
const db = new Database("pokemon_dme.db");

//MongoDB Atlas
mongoose
    .connect(
        process.env.MONGODB_URI ||
            "mongodb+srv://dme_user:vyjCUgtxFecTZxqd@clusterpokedex.nd1r8.mongodb.net/pokedex?retryWrites=true&w=majority&appName=ClusterPokedex",
        {}
    )
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));

//Endpoint: Capturar Pokémon
app.post("/api/catch", async (req: Request, res: Response) => {
    const { id, name, image, type } = req.body;

    try {
        // Verifica la cantidad de Pokémon en la Pokemon Party
        const partyCount = db
            .prepare("SELECT COUNT(*) AS count FROM pokemon")
            .get() as { count: number };

        if (partyCount.count >= 6) {
            //Si hay más de 6 guarda en la PC Box
            const newPokemon = new PCBox({ id, name, image, type });
            await newPokemon.save();
            res.status(201).json({ message: "Pokemon saved to PC Box" });
        } else {
            //Si hay espacio guarda en la Party
            const stmt = db.prepare(
                "INSERT INTO pokemon (id, name, image, type) VALUES (?, ?, ?, ?)"
            );
            stmt.run(id, name, image, type);
            res.status(200).json({ message: "Pokemon caught successfully" });
        }
    } catch (error) {
        console.error("Error catching Pokemon:", error);
        res.status(500).json({ message: "Failed to catch Pokemon" });
    }
});

//Endpoint: obtener todos los Pokémon capturados
app.get("/api/pokemon-party", (req: Request, res: Response) => {
    try {
        const stmt = db.prepare("SELECT * FROM Pokemon");
        const pokemon = stmt.all();
        res.status(200).json(pokemon);
    } catch (error: any) {
        console.error("Error fetching Pokémon Party:", error);
        res.status(500).json({ message: "Failed to fetch Pokémon Party" });
    }
});

//Endpoint: eliminar Pokémon capturado por ID
app.delete("/api/pokemon-party/:id", (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const stmt = db.prepare("DELETE FROM pokemon WHERE id = ?");
        const result = stmt.run(id);

        if (result.changes > 0) {
            res.status(200).json({ message: "Pokemon deleted successfully" });
        } else {
            res.status(404).json({ message: "Pokemon not found" });
        }
    } catch (error: any) {
        console.error("Error deleting Pokémon:", error);
        res.status(500).json({ message: "Failed to delete Pokemon" });
    }
});

//Endpoint: Obtener pokemones de PC Box
app.get("/api/pc-box", async (req: Request, res: Response) => {
    try {
        const pcBoxPokemon = await PCBox.find();
        res.status(200).json(pcBoxPokemon);
    } catch (error) {
        console.error("Error fetching PC Box:", error);
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
        console.error("Error saving to PC Box:", error);
        res.status(500).json({ message: "Failed to save Pokemon to PC Box" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
