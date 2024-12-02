## dME Tech Challenge (PokeAPI)

¡Hola! Bienvenido a mi repositorio con el Tech Challenge de la Pokédex. Este repositorio contiene el código completo del challenge, tanto su frontend y su backend.

Este proyecto fue construido utilizando las siguientes tecnologías:

PokeAPI (https://pokeapi.co/)

# Frontend

-   React (18.2.0)
-   Next.js (15.0.3)
-   Redux (5.0.1)
-   TypeScript (5.7.2)
-   Axios (1.7.8)
-   SQLite (BetterSQLite 7.6.12)
-   ElectronJS (33.2.1)
-   MUI (11.13.5)
-   Eslint 8

# Backend

-   Node.js (22.11.0 LTS)
-   Express (4.21.1)
-   Mongoose (8.8.3)
-   MongoDB Atlas (Free Tier en AWS)

## Pasos para empezar

1. Clona este proyecto en tu carpeta de repositorios preferida (git clone https://github.com/diegorom6/dme-pokedex)
2. Entra a la carpeta backend y ejecuta npm install para instalar las dependencias del backend
3. En esta misma carpeta, crea un archivo .env con la URI "MONGO_URI" que contenga tu string de conexión de MongoDB Atlas. Ej: MONGO_URI=mongodb+srv://<user>:<password>@xxxxxxxxxxxxxxx/xxxxxxxxxxxxxxx&appName=<nombreCluster><
4. Ejecuta npm run dev para iniciar el entorno de desarrollo

5. Entra en la carpeta client y ejecuta npm install para instalar las dependencias del frontend + electron
6. Ejecuta npm run dev para iniciar el entorno de desarrollo
7. Adicionalmente puedes consultar el package.json y ver los scripts disponibles para ejecutar, construir builds y otros extras

## Flujo de trabajo

Al iniciar el proyecto, se desplegará una ventana de Electron en donde se podrá visualizar la Pokédex. Mientras esto se ejecuta, se crearán dos bases de datos: pokemon.sqlite, la cual guardará y leerá los datos de la Pokémon Party (máximo hasta 6) y pokemon-wild.sqlite, la cual guardará y leerá el estado del Dropdownlist de los tipos de Pokémon, además de la lista entera de Pokémons en Wild Pokémons. Esto permitirá que cuando se cierre la aplicación o el servicio backend no esté disponible, se mantenga lo mismo que estaba antes.

Se pueden agregar duplicados en PCBox (Database de Mongo).

## Extras

Todo este proyecto fue construido utilizando la documentación oficial de Next.js 15.0.3 (https://nextjs.org/docs/app/getting-started/project-structure)

También, me basé en la documentación oficial de Redux.js para implementar Redux y Next (https://redux.js.org/usage/nextjs)
