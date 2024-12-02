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
}

const initialState: PokemonState = {
    wild: [],
    party: [],
    pcBox: [],
    selectedType: "fire", //Test
};

export const loadPartyFromDB = createAsyncThunk<Pokemon[]>(
    "pokemon/loadParty",
    async () => {
        const savedPokemon: Pokemon[] = await window.db.getPokemon();
        return savedPokemon;
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
        loadPartyFromDB: (state, action) => {
            state.party = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(loadPartyFromDB.fulfilled, (state, action) => {
            state.party = action.payload;
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
} = pokemonSlice.actions;

export default pokemonSlice.reducer;
