import React, {useContext} from 'react';
import {Text, Button, ScrollView} from 'react-native';
import {Pokemon} from '../models/Pokemon';
import PokemonCard from '../components/PokemonCard';
import PokemonContext from "../contexts/PokemonContext";

const PokemonListScreen: React.FC<any> = ({navigation}) => {

    const {pokemonList} = useContext(PokemonContext)

    const handlePokemonPress = (pokemon: Pokemon) => {
        // Navigate to detail/edit screen passing the Pokemon details
        navigation.navigate('PokemonDetail', {pokemon});
    };

    const handleAddPokemon = () => {
        navigation.navigate('PokemonDetail', {pokemon: null}); // Navigate to add mode
    };

    return (
        <ScrollView>
            {pokemonList.list.map(pokemon => (
                <PokemonCard
                    key={pokemon.id}
                    pokemon={pokemon}
                    onPress={() => handlePokemonPress(pokemon)}
                />
            ))}
            {pokemonList.list.length === 0 && (
                <Text style={{textAlign: 'center', marginTop: 20}}>No Pokemon!</Text>
            )}
            <Button title="Add Pokemon" onPress={handleAddPokemon}/>
        </ScrollView>
    );
};

export default PokemonListScreen;
