import React, { useEffect, useState } from "react";

const DownloadButton = () => {
    const [isElectron, setIsElectron] = useState<boolean | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined" && window.electronAPI) {
            setIsElectron(true); // Estamos en Electron
        } else {
            setIsElectron(false); // No estamos en Electron, por lo que se debe descargar el instalador
        }
    }, []);

    const handleDownload = () => {
        if (isElectron === false) {
            const electronAppUrl = "/installer/installer.exe";
            window.location.href = electronAppUrl;
        }
    };

    if (isElectron === null) {
        return <div>Loading...</div>;
    }

    return (
        <button onClick={handleDownload}>
            {isElectron ? "Estás en Electron" : "Descargar Aplicación"}
        </button>
    );
};

export default DownloadButton;
