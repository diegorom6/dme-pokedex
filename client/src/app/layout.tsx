"use client";

import "./globals.css";
import { Provider } from "react-redux";
import { store } from "../lib/store";
import { useEffect } from "react";
import { loadPartyFromDB } from "../lib/features/pokemonSlice";
import { useAppDispatch } from "../lib/hooks";

function AppInitializer({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();

    useEffect(() => {
        // Cargar Pokémon desde SQLite al iniciar la aplicación
        dispatch(loadPartyFromDB());
    }, [dispatch]);

    return <>{children}</>;
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html>
            <body>
                <Provider store={store}>
                    <AppInitializer>{children}</AppInitializer>
                </Provider>
            </body>
        </html>
    );
}
