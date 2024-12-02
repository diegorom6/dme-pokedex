import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import Database from "better-sqlite3";

const db = new Database("pokemon.sqlite");

db.exec(`
    CREATE TABLE IF NOT EXISTS Pokemon (
        id INTEGER PRIMARY KEY,
        name TEXT,
        image TEXT,
        type TEXT,
        description TEXT
    );
`);

//Consultas SQL ejecutadas desde next
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

ipcMain.handle("get-pokemon", () => {
    return db.prepare("SELECT * FROM Pokemon").all();
});

app.on("ready", () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
    });

    mainWindow.loadURL("http://localhost:3000");
});
