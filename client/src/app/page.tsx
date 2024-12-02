"use client";

import { useState } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import WildPokemon from "./wild-pokemon/page";
import PokemonParty from "./pokemon-party/page";
import PcBox from "./pc-box/page";

export default function Home() {
    const [value, setValue] = useState(0);

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <main style={{ width: "100vw", height: "100vh" }}>
            <Box
                sx={{
                    width: "100%",
                    backgroundColor: "#f4f4f9",
                    borderRadius: "8px",
                }}
            >
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="Pokémon Tabs"
                    centered
                    variant="fullWidth"
                    sx={{
                        borderBottom: 1,
                        borderColor: "divider",
                        backgroundColor: "#1976d2",
                        color: "white",
                    }}
                >
                    <Tab label="Wild Pokémon" />
                    <Tab label="Pokémon Party" />
                    <Tab label="PC Box" />
                </Tabs>

                <Box sx={{ padding: "20px" }}>
                    {value === 0 && <WildPokemon />}
                    {value === 1 && <PokemonParty />}
                    {value === 2 && <PcBox />}
                </Box>
            </Box>
        </main>
    );
}
