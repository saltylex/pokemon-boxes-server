import React, {useState} from 'react';
import {View, Text, TextInput, Button, Image, Switch} from 'react-native';
import { Pokemon } from '../models/Pokemon';


const PokemonForm: React.FC<{
    pokemon: Pokemon,
    onSave: (updatedPokemon: Pokemon) => void,
    onDelete?: () => void,
}> = ({ pokemon, onSave, onDelete }) => {
    const [name, setName] = useState(pokemon.name);
    const [type, setType] = useState(pokemon.type);
    const [sprite, setSprite] = useState(pokemon.sprite);
    const [date, setDate] = useState(pokemon.date);
    const [place, setPlace] = useState(pokemon.place);
    const [game, setGame] = useState(pokemon.game);
    const [notes, setNotes] = useState(pokemon.notes);
    const [caught, setCaught] = useState(pokemon.caught);
    const [dexNo, setDexNo] = useState(pokemon.dexNo.toString());

    const handleSave = () => {
        const updatedPokemon: Pokemon = {
            ...pokemon,
            name,
            type,
            sprite,
            date,
            place,
            game,
            notes,
            caught,
            dexNo: parseInt(dexNo),
        };
        onSave(updatedPokemon);
    };

    const handleDelete = () => {
        onDelete()
    };

    return (
        <View style={{ margin: 20 }}>
            <Image
                style={{ width: 100, height: 100, marginBottom: 10, left: 100 }}
                source={{ uri: sprite }}
                onError={()=>{}}
            />
            <Text style={{color: 'black'}}>Name:</Text>
            <TextInput
                value={name}
                onChangeText={setName}
                color={'black'}

                placeholder="Enter Name"
                style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
            />

            <Text style={{color: 'black'}}>Type:</Text>
            <TextInput
                value={type}
                onChangeText={setType}
                color={'black'}

                placeholder="Enter Type"
                style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
            />

            <Text style={{color: 'black'}}>Sprite (URL):</Text>
            <TextInput
                value={sprite}
                onChangeText={setSprite}
                color={'black'}

                placeholder="Enter Sprite URL"
                style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
            />

            <Text style={{color: 'black'}}>Date:</Text>
            <TextInput
                value={date}
                onChangeText={setDate}
                color={'black'}

                placeholder="Enter Date"
                style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
            />

            <Text style={{color: 'black'}}>Place:</Text>
            <TextInput
                value={place}
                onChangeText={setPlace}
                color={'black'}

                placeholder="Enter Place"
                style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
            />

            <Text style={{color: 'black'}}>Game:</Text>
            <TextInput
                value={game}
                onChangeText={setGame}
                color={'black'}

                placeholder="Enter Game"
                style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
            />

            <Text style={{color: 'black'}}>Notes:</Text>
            <TextInput
                value={notes}
                onChangeText={setNotes}
                color={'black'}
                placeholder="Enter Notes"
                style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
            />

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Text style={{color: 'black'}}>Caught:</Text>
            <Switch
                value={caught}
                onValueChange={(value) => setCaught(value)}
            />
            </View>

            <Text style={{color: 'black'}}>Dex No:</Text>
            <TextInput
                value={dexNo}
                onChangeText={setDexNo}
                color={'black'}
                placeholder="Enter Dex No"
                keyboardType="numeric"
                style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
            />

            <Button title="Save" onPress={handleSave} style={{color: 'black'}} />

            {onDelete && pokemon.id ? (
                <Button title="Delete" onPress={handleDelete} color="red" />
            ) : null}
        </View>
    );
};

export default PokemonForm;
