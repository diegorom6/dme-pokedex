import { Avatar, Box, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import WildPokemon from "../wild-pokemon/page";
import PokemonParty from "../pokemon-party/page";
import PcBox from "../pc-box/page";
import { Close, CropSquare, Minimize } from "@mui/icons-material";
import "../replace.css";

const CustomFrame = () => {
    const [value, setValue] = useState(0);

    const handleMinimize = () => {
        window.electronAPI.minimizeWindow();
    };

    const handleMaximize = () => {
        window.electronAPI.maximizeWindow();
    };

    const handleClose = () => {
        window.electronAPI.closeWindow();
    };

    const handleChange = (_: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <>
            <div className="frame">
                <div className="topBar">
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        aria-label="Pokémon Tabs"
                        sx={{
                            color: "white",
                            flexGrow: 1,
                            paddingLeft: "16px",
                        }}
                    >
                        <Tab
                            label="Wild Pokémon"
                            icon={
                                <Avatar
                                    alt="test avatar"
                                    src={
                                        "https://cdn.prod.website-files.com/66ed2b2f0ffcd3826ed47b93/66f19a77ecc00f3e28267e6a_logosolo.png"
                                    }
                                    style={{ width: "24px", height: "24px" }}
                                />
                            }
                            style={{ display: "flex", alignItems: "center" }}
                        />
                        <Tab
                            label="Pokémon Party"
                            icon={
                                <Avatar
                                    alt="test avatar"
                                    src={
                                        "https://cdn.prod.website-files.com/66ed2b2f0ffcd3826ed47b93/66f19a77ecc00f3e28267e6a_logosolo.png"
                                    }
                                    style={{ width: "24px", height: "24px" }}
                                />
                            }
                            style={{ display: "flex", alignItems: "center" }}
                        />
                        <Tab
                            label="PC Box"
                            icon={
                                <Avatar
                                    alt="test avatar"
                                    src={
                                        "https://cdn.prod.website-files.com/66ed2b2f0ffcd3826ed47b93/66f19a77ecc00f3e28267e6a_logosolo.png"
                                    }
                                    style={{ width: "24px", height: "24px" }}
                                />
                            }
                            style={{ display: "flex", alignItems: "center" }}
                        />
                    </Tabs>

                    <div className="controls">
                        <button className="button" onClick={handleMinimize}>
                            <Minimize />
                        </button>
                        <button className="button" onClick={handleMaximize}>
                            <CropSquare />
                        </button>
                        <button className="button" onClick={handleClose}>
                            <Close />
                        </button>
                    </div>
                </div>

                <main>
                    <Box
                        sx={{
                            width: "100%",
                        }}
                    >
                        <Box sx={{ padding: "20px" }}>
                            {value === 0 && <WildPokemon />}
                            {value === 1 && <PokemonParty />}
                            {value === 2 && <PcBox />}
                        </Box>
                    </Box>
                </main>
            </div>
        </>
    );
};

export default CustomFrame;
