import mongoose from "mongoose";

const PCBoxSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    type: { type: String, required: true },
});

const PCBoxModel = mongoose.model("pokemons", PCBoxSchema);

export default PCBoxModel;
