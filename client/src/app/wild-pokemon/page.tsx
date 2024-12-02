"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../lib/hooks";
import {
    setWildPokemon,
    addToParty,
    setSelectedType,
    addToPCBox,
} from "../../lib/features/pokemonSlice";
import {
    Box,
    Typography,
    Button,
    Grid,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Card,
    CardContent,
    CardMedia,
    SelectChangeEvent,
} from "@mui/material";
import axios from "axios";
import Image from "next/image";

// Componente Wild
const Wild = () => {
    const dispatch = useAppDispatch();
    const wildPokemon = useAppSelector((state) => state.pokemon.wild); //Pokémon en Redux
    const selectedType = useAppSelector((state) => state.pokemon.selectedType);
    const [types, setTypes] = useState<string[]>([]);
    const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(
        null
    );
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        const fetchTypes = async () => {
            const response = await fetch("https://pokeapi.co/api/v2/type/");
            const data = await response.json();
            setTypes(data.results.map((type: { name: string }) => type.name));
        };

        fetchTypes();
    }, []);

    useEffect(() => {
        const fetchWildPokemon = async () => {
            const response = await fetch(
                `https://pokeapi.co/api/v2/type/${selectedType}`
            );
            const data = await response.json();
            const pokemon = await Promise.all(
                data.pokemon.map(
                    async (p: { pokemon: { url: string; name: string } }) => {
                        return {
                            id: p.pokemon.url.split("/").filter(Boolean).pop(),
                            name: p.pokemon.name,
                            image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.pokemon.url
                                .split("/")
                                .filter(Boolean)
                                .pop()}.png`,
                            type: selectedType,
                        };
                    }
                )
            );
            dispatch(setWildPokemon(pokemon));
        };

        fetchWildPokemon();
    }, [dispatch, selectedType]);

    const handlePokemonClick = (pokemon: Pokemon) => {
        // Obtener detalles del Pokémon
        const fetchPokemonDetails = async () => {
            const { data } = await axios.get(
                `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
            );
            setSelectedPokemon({
                id: data.id,
                name: data.name,
                image: data.sprites.other["official-artwork"].front_default,
                type: selectedType,
                description: "A wild Pokémon!",
                abilities: data.abilities.map(
                    (a: { ability: { name: string } }) => a.ability.name
                ),
                moves: data.moves
                    .slice(0, 5)
                    .map((m: { move: { name: string } }) => m.move.name),
            });

            setDialogOpen(true);
        };

        fetchPokemonDetails();
    };

    const handleCatchPokemon = async (pokemon: Pokemon) => {
        try {
            const savedPokemon = await window.db.getPokemon();
            const partyPokemonCount = savedPokemon.length;

            if (partyPokemonCount < 6) {
                dispatch(addToParty(pokemon));
                window.db.savePokemon(pokemon);
            } else {
                //Guardar en MongoDB si se alcanzó el límite...
                await axios.post("http://localhost:4000/api/pc-box", pokemon);
            }

            setDialogOpen(false);
        } catch (error) {
            console.error("Error al guardar el Pokémon:", error);
        }
    };

    const handleTypeChange = (event: SelectChangeEvent<string>) => {
        const type = event.target.value;
        dispatch(setSelectedType(type));
    };

    return (
        <Box sx={{ padding: "20px" }}>
            <Typography variant="h4" gutterBottom>
                Wild Pokémon
            </Typography>

            <Select
                value={selectedType}
                onChange={handleTypeChange}
                displayEmpty
                sx={{
                    marginBottom: "20px",
                    width: "200px",
                    backgroundColor: "#fff",
                }}
            >
                {types.map((type) => (
                    <MenuItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}{" "}
                    </MenuItem>
                ))}
            </Select>

            <Grid container spacing={3}>
                {wildPokemon.map((pokemon) => (
                    <Grid item xs={12} sm={6} md={4} key={pokemon.id}>
                        <Card
                            sx={{
                                maxWidth: 345,
                                borderRadius: "8px",
                                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                                cursor: "pointer",
                            }}
                            onClick={() => handlePokemonClick(pokemon)}
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
                                <Typography variant="h6" component="div">
                                    {pokemon.name.charAt(0).toUpperCase() +
                                        pokemon.name.slice(1)}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    ID: {pokemon.id}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                {selectedPokemon && (
                    <>
                        <DialogTitle>
                            {selectedPokemon.name.charAt(0).toUpperCase() +
                                selectedPokemon.name.slice(1)}{" "}
                            (ID: {selectedPokemon.id})
                        </DialogTitle>
                        <DialogContent>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                <Image
                                    src={selectedPokemon.image}
                                    alt={selectedPokemon.name}
                                    width={200}
                                    height={200}
                                />
                                <Typography variant="h6" gutterBottom>
                                    Abilities:
                                </Typography>
                                <Typography variant="body1">
                                    {selectedPokemon.abilities?.join(", ")}
                                </Typography>
                                <Typography
                                    variant="h6"
                                    gutterBottom
                                    sx={{ marginTop: "10px" }}
                                >
                                    Moves:
                                </Typography>
                                <Typography variant="body1">
                                    {selectedPokemon.moves?.join(", ")}
                                </Typography>
                            </Box>
                        </DialogContent>

                        <DialogActions>
                            <Button
                                onClick={() =>
                                    selectedPokemon &&
                                    handleCatchPokemon(selectedPokemon)
                                }
                                variant="contained"
                                color="primary"
                            >
                                Catch it!
                            </Button>
                            <Button
                                onClick={() => setDialogOpen(false)}
                                color="secondary"
                            >
                                Close
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
};

export default Wild;
