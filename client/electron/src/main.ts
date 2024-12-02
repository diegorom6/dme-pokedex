import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import Database from "better-sqlite3";

const db = new Database("pokemon.sqlite");
const dbHelper = new Database("pokemon-wild.sqlite");

db.exec(`
    CREATE TABLE IF NOT EXISTS Pokemon (
        id INTEGER PRIMARY KEY,
        name TEXT,
        image TEXT,
        type TEXT,
        description TEXT
    );
`);

//Tabla para mantener estado de Select en Wild-Pokemon
dbHelper.exec(
    `
    CREATE TABLE IF NOT EXISTS wild_pokemon_state (
      id INTEGER PRIMARY KEY,
      selected_type TEXT NOT NULL,
      results TEXT NOT NULL
    );
  `
);

//y sus respectivas consultas...
export const getWildPokemonState = (): {
    selectedType: string;
    results: string;
} => {
    const stmt = dbHelper.prepare(
        "SELECT * FROM wild_pokemon_state WHERE id = 1"
    );
    const row = stmt.get() as { selected_type: string; results: string };

    if (!row) {
        return {
            selectedType: "fire",
            results: JSON.stringify([]),
        };
    }
    return {
        selectedType: row.selected_type,
        results: row.results,
    };
};

export const saveWildPokemonState = (state: {
    selectedType: string;
    wildResults: Pokemon[];
}) => {
    try {
        if (!state.wildResults || state.wildResults.length === 0) {
            return;
        }

        const stmt = dbHelper.prepare(`
            INSERT INTO wild_pokemon_state (id, selected_type, results)
            VALUES (1, ?, ?)
            ON CONFLICT(id) DO UPDATE 
            SET selected_type = excluded.selected_type, 
                results = excluded.results
        `);

        const serializedResults = JSON.stringify(state.wildResults);
        stmt.run(state.selectedType, serializedResults);
    } catch (error) {
        console.error("Failed to save wild Pokémon state:", error);
    }
};

//Consultas SQL ejecutadas desde next

ipcMain.handle("get-pokemon", () => {
    return db.prepare("SELECT * FROM Pokemon").all();
});

ipcMain.handle("save-pokemon", (event: any, pokemon: Pokemon) => {
    const stmt = db.prepare(
        "INSERT INTO Pokemon (id, name, image, type, description) VALUES (?, ?, ?, ?, ?)"
    );

    stmt.run(
        pokemon.id,
        pokemon.name,
        pokemon.image,
        pokemon.type,
        pokemon.description
    );
});

ipcMain.handle("delete-pokemon", (event: any, pokemonId: number) => {
    const stmt = db.prepare("DELETE FROM Pokemon WHERE id = ?");
    stmt.run(pokemonId);
});

ipcMain.handle("get-wild-pokemon-state", () => {
    try {
        return getWildPokemonState();
    } catch (error) {
        return {
            //Devolver por defecto no más...
            selectedType: "fire",
            results: JSON.stringify([]),
        };
    }
});

ipcMain.handle("save-wild-pokemon-state", (event, state) => {
    try {
        saveWildPokemonState(state);
        return { success: true };
    } catch (error) {
        return { success: false, error: error };
    }
});

app.on("ready", () => {
    const mainWindow: BrowserWindow = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
        autoHideMenuBar: true,
        frame: false,
    });

    mainWindow.maximize();

    mainWindow.loadURL("http://localhost:3000");

    ipcMain.on("minimize-window", () => {
        mainWindow.minimize();
    });

    ipcMain.on("maximize-window", () => {
        if (mainWindow.isMaximized()) {
            mainWindow.restore();
        } else {
            mainWindow.maximize();
        }
    });

    ipcMain.on("close-window", () => {
        mainWindow.close();
    });
});
