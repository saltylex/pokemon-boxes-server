import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pokemon } from '../models/Pokemon';

const STORAGE_KEY = 'pokemonData';

export const getAllPokemon = async (): Promise<Pokemon[]> => {
    try {
        const storedData = await AsyncStorage.getItem(STORAGE_KEY);
        return storedData ? JSON.parse(storedData) : [];
    } catch (error) {
        console.error('Error retrieving Pokemon data:', error);
        return [];
    }
};

export const getPokemonById = async (id: number): Promise<Pokemon | undefined> => {
    try {
        const storedData = await AsyncStorage.getItem(STORAGE_KEY);
        const pokemonData: Pokemon[] = storedData ? JSON.parse(storedData) : [];
        return pokemonData.find(pokemon => pokemon.id === id);
    } catch (error) {
        console.error('Error retrieving Pokemon by ID:', error);
        return undefined;
    }
};

export const addPokemonService = async (pokemon: Pokemon): Promise<void> => {
    try {
        const storedData = await AsyncStorage.getItem(STORAGE_KEY);
        const pokemonData: Pokemon[] = storedData ? JSON.parse(storedData) : [];
        pokemon.id = pokemonData.length > 0 ? pokemonData[pokemonData.length - 1].id + 1 : 1;
        pokemonData.push(pokemon);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(pokemonData));
    } catch (error) {
        console.error('Error adding Pokemon:', error);
    }
};

export const updatePokemonService = async (updatedPokemon: Pokemon): Promise<void> => {
    try {
        const storedData = await AsyncStorage.getItem(STORAGE_KEY);
        let pokemonData: Pokemon[] = storedData ? JSON.parse(storedData) : [];
        pokemonData = pokemonData.map(pokemon => (pokemon.id === updatedPokemon.id ? updatedPokemon : pokemon));
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(pokemonData));
    } catch (error) {
        console.error('Error updating Pokemon:', error);
    }
};

export const deletePokemonService = async (id: number): Promise<void> => {
    try {
        const storedData = await AsyncStorage.getItem(STORAGE_KEY);
        let pokemonData: Pokemon[] = storedData ? JSON.parse(storedData) : [];
        pokemonData = pokemonData.filter(pokemon => pokemon.id !== id);

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(pokemonData));
    } catch (error) {
        console.error('Error deleting Pokemon:', error);
    }
};
