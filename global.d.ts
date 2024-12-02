export {};

declare global {
    interface Window {
        db: {
            savePokemon: (pokemon: Pokemon) => void;
            getPokemon: () => Promise<Pokemon[]>;
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
