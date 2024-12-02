"use client";

import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
} from "@mui/material";
import axios from "axios";

export default function PcBox() {
    const [pcBoxPokemon, setPcBoxPokemon] = useState<Pokemon[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch de Pokémon en la PC Box desde el backend
    useEffect(() => {
        const fetchPcBoxPokemon = async () => {
            try {
                const { data } = await axios.get(
                    "http://localhost:4000/api/pc-box"
                );
                setPcBoxPokemon(data);
            } catch (error) {
                console.error("Failed to fetch PC Box Pokemon:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPcBoxPokemon();
    }, []);

    // Mensaje mientras carga
    if (loading) {
        return (
            <Box sx={{ padding: "20px" }}>
                <Typography variant="h6">Loading your PC Box...</Typography>
            </Box>
        );
    }

    // Mensaje si no hay Pokémon en la PC Box
    if (pcBoxPokemon.length === 0) {
        return (
            <Box sx={{ padding: "20px", textAlign: "center" }}>
                <Typography variant="h6">
                    Your PC Box is empty. Catch more Pokémon to store them here!
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ padding: "20px" }}>
            <Typography variant="h4" gutterBottom>
                PC Box
            </Typography>
            <Grid container spacing={3}>
                {pcBoxPokemon.map((pokemon) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={pokemon.id}>
                        <Card
                            sx={{
                                maxWidth: 345,
                                borderRadius: "8px",
                                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <CardMedia
                                component="img"
                                height="140"
                                image={pokemon.image}
                                alt={pokemon.name}
                                sx={{
                                    objectFit: "contain",
                                    backgroundColor: "#f4f4f4",
                                }}
                            />
                            <CardContent>
                                <Typography
                                    variant="h6"
                                    component="div"
                                    gutterBottom
                                >
                                    {pokemon.name.charAt(0).toUpperCase() +
                                        pokemon.name.slice(1)}{" "}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Type:{" "}
                                    {pokemon.type.charAt(0).toUpperCase() +
                                        pokemon.type.slice(1)}{" "}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
