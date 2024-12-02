"use client";

import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../lib/hooks";
import { loadPartyFromDB } from "../../lib/features/pokemonSlice";
import Image from "next/image";

const Party = () => {
    const dispatch = useAppDispatch();
    const partyPokemon = useAppSelector((state) => state.pokemon.party);

    useEffect(() => {
        dispatch(loadPartyFromDB());
    }, [dispatch]);

    return (
        <div>
            <h1>Party Pokémon</h1>
            {partyPokemon.length === 0 ? (
                <p>No Pokémon in your party.</p>
            ) : (
                <ul>
                    {partyPokemon.map((p) => (
                        <li key={p.id}>
                            <Image
                                src={p.image}
                                alt={p.name}
                                width={200}
                                height={200}
                            />
                            <p>{p.name}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Party;
