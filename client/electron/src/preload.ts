import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("db", {
    savePokemon: (pokemon: Pokemon) =>
        ipcRenderer.invoke("save-pokemon", pokemon),
    getPokemon: async () => ipcRenderer.invoke("get-pokemon"),
});
