import React, {useContext} from 'react';
import {View, Button, Alert, ScrollView} from 'react-native';
import {Pokemon} from '../models/Pokemon';
import PokemonForm from '../components/PokemonForm';
import PokemonContext from "../contexts/PokemonContext";

const PokemonDetailScreen: React.FC<any> = ({route, navigation}) => {
    const {pokemon} = route.params;
    const {addPokemon, updatePokemon, deletePokemon} = useContext(PokemonContext)
    const isEditMode = !!pokemon;


    const handleDelete = () => {
        Alert.alert(
            'Confirm Deletion',
            'Are you sure you want to delete this Pokemon?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        deletePokemon(pokemon.id);
                        navigation.goBack(); // Navigate back to the list screen
                    },
                },
            ],
            {cancelable: false}
        );
    };
    const initialPokemonState: Pokemon = pokemon || {
        id: 0,
        name: '',
        type: '',
        sprite: '',
        date: '',
        place: '',
        game: '',
        notes: '',
        caught: false,
        dexNo: 0,
    };

    const handleSave = (updatedPokemon: Pokemon) => {
        if (isEditMode) {
            updatePokemon(updatedPokemon); // Update Pokemon details
            navigation.goBack()
        } else {
            if (updatedPokemon.name !== "" && updatedPokemon.sprite !== "" && updatedPokemon.type !== "") {
                addPokemon(updatedPokemon); // Add new Pokemon
                navigation.goBack()
            }
        }
    };

    return (
        <ScrollView>
            <PokemonForm pokemon={isEditMode ? pokemon : initialPokemonState} onSave={handleSave}
                         onDelete={handleDelete}/>
        </ScrollView>
    );
};

export default PokemonDetailScreen;
