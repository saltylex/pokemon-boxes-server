import {Pokemon} from "./Pokemon";

export type RootStackParamList = {
    PokemonList: undefined;
    PokemonDetail: { pokemon: Pokemon };
};
