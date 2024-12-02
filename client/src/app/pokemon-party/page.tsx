"use client";

import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../lib/hooks";
import {
    loadPartyFromDB,
    removeFromParty,
} from "../../lib/features/pokemonSlice";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Grid,
    Typography,
} from "@mui/material";

const Party = () => {
    const dispatch = useAppDispatch();
    const partyPokemon = useAppSelector((state) => state.pokemon.party);

    useEffect(() => {
        dispatch(loadPartyFromDB());
    }, [dispatch]);

    const handleRemoveFromParty = async (pokemonId: number) => {
        window.db
            .deletePokemon(pokemonId)
            .then(() => {
                dispatch(removeFromParty(pokemonId));
            })
            .catch((error) => {
                console.error(error);
            });
    };

    if (partyPokemon.length === 0) {
        return (
            <Box sx={{ padding: "20px", textAlign: "center" }}>
                <Typography variant="h6">
                    Your party is empty. Catch some Pokémon to store them here!
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ padding: "20px" }}>
            <Typography variant="h4" gutterBottom>
                Pokémon Party
            </Typography>
            <Grid container spacing={2} justifyContent="center">
                {partyPokemon.map((pokemon) => (
                    <Grid item xs={4} sm={3} md={2} key={pokemon.id}>
                        <Card sx={{ maxWidth: 200 }}>
                            <CardMedia
                                component="img"
                                alt={pokemon.name}
                                image={pokemon.image}
                                title={pokemon.name}
                                sx={{ height: 140, objectFit: "contain" }}
                            />
                            <CardContent>
                                <Typography variant="h6" align="center">
                                    {pokemon.name}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    fullWidth
                                    onClick={() =>
                                        handleRemoveFromParty(pokemon.id)
                                    }
                                >
                                    Delete
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Party;
