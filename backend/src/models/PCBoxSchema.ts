import mongoose from "mongoose";

const PCBoxSchema = new mongoose.Schema({
    id: { type: Number, required: true }, //este es el id de la pokékdex, el idpk es el id del registro como tal
    name: { type: String, required: true },
    image: { type: String, required: true },
    type: { type: String, required: true },
});

const PCBoxModel = mongoose.model("pokemons", PCBoxSchema);

export default PCBoxModel;
