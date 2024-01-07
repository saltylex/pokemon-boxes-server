import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {Pokemon} from '../models/Pokemon';

const typeColors = {
    Normal: 'rgba(181, 183, 166, 0.5)',
    Psychic: 'rgba(248, 96, 178, 0.5)',
    Poison: 'rgba(168, 93, 161, 0.5)',
    Grass: 'rgba(140, 216, 80, 0.5)',
    Ground: 'rgba(232, 200, 87, 0.5)',
    Ice: 'rgba(149, 241, 255, 0.5)',
    Fire: 'rgba(250, 85, 67, 0.5)',
    Rock: 'rgba(205, 189, 115, 0.5)',
    Dragon: 'rgba(137, 117, 255, 0.5)',
    Water: 'rgba(92, 171, 252, 0.5)',
    Bug: 'rgba(195, 210, 31, 0.5)',
    Dark: 'rgba(101, 68, 52, 0.5)',
    Fighting: 'rgba(178, 82, 72, 0.5)',
    Ghost: 'rgba(122, 117, 220, 0.5)',
    Steel: 'rgba(195, 194, 218, 0.5)',
    Flying: 'rgba(121, 164, 255, 0.5)',
    Electric: 'rgba(249, 227, 59, 0.5)',
    Fairy: 'rgba(249, 173, 255, 0.5)',
};

const PokemonCard: React.FC<{ pokemon: Pokemon, onPress: () => void }> = ({pokemon, onPress}) => {
    const opacity = pokemon.caught ? '1)' : '0.5)';
    const backgroundColor = typeColors[pokemon.type] ? typeColors[pokemon.type] + opacity : 'gray';

    return (
        <TouchableOpacity onPress={onPress}>
            <View style={{
                backgroundColor: backgroundColor,
                opacity: pokemon.caught ? 1 : 0.5,
            }}>
                <Image source={{uri: pokemon.sprite}} style={{width: 100, height: 100}}/>
                <Text>{pokemon.name}</Text>
                <Text>Type: {pokemon.type}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default PokemonCard;
