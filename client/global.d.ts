export {};

declare global {
    interface Window {
        db: {
            getPokemon: () => Promise<Pokemon[]>;
            savePokemon: (pokemon: Pokemon) => void;
            deletePokemon: (pokemonId: number) => Promise<void>;
        };
        electronAPI: {
            minimizeWindow(): void;
            maximizeWindow(): void;
            closeWindow(): void;
        };
        wildPokemonAPI: {
            getWildPokemonState: () => Promise<{
                results: string;
                selectedType: string;
                wildResults: Pokemon[];
            }>;
            saveWildPokemonState: (state: {
                selectedType: string;
                wildResults: Pokemon[];
            }) => Promise<void>;
        };
    }

    export interface Pokemon {
        id: number;
        name: string;
        image: string;
        type: string;
        description: string;
        abilities?: string[];
        moves?: string[];
    }
}
