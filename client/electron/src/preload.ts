import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("db", {
    savePokemon: (pokemon: Pokemon) =>
        ipcRenderer.invoke("save-pokemon", pokemon),
    getPokemon: async () => ipcRenderer.invoke("get-pokemon"),
    deletePokemon: (pokemonId: number) =>
        ipcRenderer.invoke("delete-pokemon", pokemonId),
});

contextBridge.exposeInMainWorld("electronAPI", {
    minimizeWindow: () => ipcRenderer.send("minimize-window"),
    maximizeWindow: () => ipcRenderer.send("maximize-window"),
    closeWindow: () => ipcRenderer.send("close-window"),
});

contextBridge.exposeInMainWorld("wildPokemonAPI", {
    getWildPokemonState: async () =>
        ipcRenderer.invoke("get-wild-pokemon-state"),
    saveWildPokemonState: async (state: string) =>
        ipcRenderer.invoke("save-wild-pokemon-state", state),
});
