import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

interface Pokemon {
    id: number;
    name: string;
    image: string;
    type: string;
    description: string;
}

interface PokemonState {
    wild: Pokemon[];
    party: Pokemon[];
    pcBox: Pokemon[];
    selectedType: string;
    wildResults: Pokemon[];
}

const initialState: PokemonState = {
    wild: [],
    party: [],
    pcBox: [],
    selectedType: "fire", //Test
    wildResults: [],
};

export const loadWildPokemonState = createAsyncThunk<{
    selectedType: string;
    wildResults: Pokemon[];
}>("pokemon/loadWildPokemonState", async () => {
    const state = await window.wildPokemonAPI.getWildPokemonState();

    if (state) {
        return {
            selectedType: state.selectedType,
            wildResults: JSON.parse(state.results),
        };
    }
    return { selectedType: "fire", wildResults: [] };
});

export const saveWildPokemonState = createAsyncThunk(
    "pokemon/saveWildPokemonState",
    async (state: { selectedType: string; wildResults: Pokemon[] }) => {
        if (!state.wildResults || state.wildResults.length === 0) {
            return;
        }
        await window.wildPokemonAPI.saveWildPokemonState(state);
    }
);

export const loadPartyFromDB = createAsyncThunk<Pokemon[]>(
    "pokemon/loadParty",
    async () => {
        const savedPokemon: Pokemon[] = await window.db.getPokemon();
        return savedPokemon;
    }
);

export const deletePokemonFromDB = createAsyncThunk(
    "pokemon/deletePokemon",
    async (pokemonId: number) => {
        await window.db.deletePokemon(pokemonId);
        return pokemonId;
    }
);

const pokemonSlice = createSlice({
    name: "pokemon",
    initialState,
    reducers: {
        setWildPokemon: (state, action: PayloadAction<Pokemon[]>) => {
            state.wild = action.payload;
        },
        addToParty: (state, action: PayloadAction<Pokemon>) => {
            if (
                state.party.length < 6 &&
                !state.party.some((p) => p.id === action.payload.id)
            ) {
                state.party.push(action.payload);
            } else if (!state.pcBox.some((p) => p.id === action.payload.id)) {
                state.pcBox.push(action.payload);
            }
        },
        removeFromParty: (state, action: PayloadAction<number>) => {
            state.party = state.party.filter((p) => p.id !== action.payload);
        },
        setPCBox: (state, action: PayloadAction<Pokemon[]>) => {
            state.pcBox = action.payload;
        },
        addToPCBox: (state, action: PayloadAction<Pokemon>) => {
            state.pcBox.push(action.payload);
        },
        setSelectedType: (state, action: PayloadAction<string>) => {
            state.selectedType = action.payload;
        },
        setWildResults: (state, action: PayloadAction<Pokemon[]>) => {
            state.wildResults = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loadPartyFromDB.fulfilled, (state, action) => {
            state.party = action.payload;
        });

        builder.addCase(deletePokemonFromDB.fulfilled, (state, action) => {
            state.party = state.party.filter(
                (pokemon) => pokemon.id !== action.payload
            );
        });

        builder.addCase(loadWildPokemonState.fulfilled, (state, action) => {
            state.selectedType = action.payload.selectedType || "fire";
            state.wildResults = action.payload.wildResults || [];
        });
    },
});

export const {
    setWildPokemon,
    addToParty,
    removeFromParty,
    setPCBox,
    addToPCBox,
    setSelectedType,
    setWildResults,
} = pokemonSlice.actions;

export default pokemonSlice.reducer;
