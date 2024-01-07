import React, {createContext, useState, useEffect} from 'react';
import {Pokemon} from '../models/Pokemon';
import {
    addPokemonToDatabase,
    createTable, deletePokemonFromDatabase,
    getDatabaseConnection,
    getPokemon,
    updatePokemonInDatabase
} from "../utils/PokemonDatabase";
import {SQLiteDatabase} from 'react-native-sqlite-storage';
import NetInfo from '@react-native-community/netinfo';
import {Alert} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

type PokemonContextType = {
    pokemonList: { list: Pokemon[], db };
    addPokemon: (pokemon: Pokemon) => void;
    updatePokemon: (updatedPokemon: Pokemon) => void;
    deletePokemon: (id: number) => void;
};

const PokemonContext = createContext<PokemonContextType>({
    pokemonList: {list: [], db: null},
    addPokemon: () => {
    },
    updatePokemon: () => {
    },
    deletePokemon: () => {
    },
});

export const PokemonProvider: React.FC = ({children}) => {
    const [pokemonList, setPokemonList] = useState<{ list: Pokemon[], db: SQLiteDatabase | null }>({
        list: [],
        db: null,
    });

    const checkConnectivity = async () => {
        const conn = await NetInfo.fetch();
        return conn.isConnected;
    }
    useEffect(() => {
        async function fetchData() {
            const db = await getDatabaseConnection();
            await createTable(db);
            if (await checkConnectivity()) {
                const storedPokemon = await AsyncStorage.getItem('storedPokemon');
                const parsedPokemon: Pokemon[] = storedPokemon ? JSON.parse(storedPokemon) : [];
                // for each pokemon, we add it to server, server assigns it an ID,
                // then we save the ID everywhere (UI, DB)
                for (const pkm1 of parsedPokemon) {
                    fetch("http://192.168.1.102:8000/pokemon/all/", {
                        method: "POST",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(pkm1),
                    })
                        .then(async (response) => {
                            return response.json().then(data => ({status: response.status, body: data}))
                        }).then((rep) => {
                        console.log('CREATED ENTITY FROM LOCAL STORAGE ' + rep.body.name + ' STATUS: ' + rep.status);
                        // in our UI we substitute the ID
                        pokemonList.list.find((pkmSaved) => pkmSaved.id === pkm1.id).id = rep.body.id;
                        // and then in our DB we do the same
                        const query = `UPDATE POKEMON
                                   SET id = ${rep.body.id}
                                   WHERE id = ${pkm1.id}`
                        if ("executeSql" in pokemonList.db) {
                            pokemonList.db.executeSql(query);
                        }

                    }).catch((e) => {
                        throw Error('Creating entity from local failed! ' + e);
                    })
                    ;
                    setPokemonList(prevState => ({
                        ...prevState,
                        list: [...prevState.list.filter((poke) => poke.id !== pkm1.id), pkm1],
                    }));
                    AsyncStorage.setItem('storedPokemon', JSON.stringify([]));
                }
                const response = await fetch('http://192.168.1.102:8000/pokemon/all/');
                const json = await response.json();
                console.log('Loading Pokemon...');
                for (const pkm of json) {
                    const newPkm: Pokemon = {
                        id: pkm.id as number,
                        caught: pkm.caught,
                        date: pkm.date,
                        dexNo: pkm.dexNo as number,
                        game: pkm.game,
                        notes: pkm.notes,
                        place: pkm.place,
                        sprite: pkm.sprite,
                        type: pkm.type,
                        name: pkm.name,
                    }
                    try {
                        setPokemonList(prevState => ({
                            ...prevState,
                            list: [...prevState.list.filter((poke) => poke.id !== newPkm.id), newPkm],
                            db: db
                        }))
                        const query = `SELECT *
                                                FROM POKEMON
                                                WHERE id = ${newPkm.id}`
                        const result = await db.executeSql(query);
                        if(result[0].rows.length == 0){
                            addPokemonToDatabase(db, newPkm).then();
                        }
                    } catch (e) {
                        throw Error('Load failed!');
                    }
                }
                console.log('Loaded!');

            } else {
                const pokemon = await getPokemon(db);
                setPokemonList({list: pokemon, db: db})

            }
        }

        fetchData().then();
    }, [])

    useEffect(() => {
        const ws = new WebSocket('ws://192.168.1.102:8000/ws/pokemon');

        ws.onopen = () => {
            console.log('WebSocket connected');
        };

        ws.onmessage = async (event) => {
            const message = JSON.parse(event.data);
            if (message.type == "update") {
                const messagePokemon = message.pokemon as Pokemon;
                updatePokemonInDatabase(pokemonList.db, messagePokemon).then();
                setPokemonList(prevState => ({
                    ...prevState,
                    list: prevState.list.map(p => (p.id === messagePokemon.id ? messagePokemon : p)),
                }));
            }
            if (message.type == "delete") {
                const messageId = message.id;
                    deletePokemonFromDatabase(pokemonList.db, messageId).then();
                    setPokemonList(prevState => ({
                        ...prevState,
                        list: prevState.list.filter(p => p.id !== messageId),
                    }))

            }
            if (message.type == "create") {
                const messagePokemon = message.pokemon as Pokemon;
                    const result = pokemonList.list.find(pokemon=>pokemon.id == messagePokemon.id)
                    if (!result) {
                        addPokemonToDatabase(pokemonList.db, messagePokemon).then();
                        setPokemonList(prevState => ({
                            ...prevState,
                            list: [...prevState.list.filter((poke) => poke.id !== messagePokemon.id), messagePokemon],
                        }));
                    }



            }

        };

        ws.onclose = () => {
            console.log('WebSocket disconnected');
        };

        return () => {
            ws.close();
        };
    }, []);


    const addPokemon = async (pokemon: Pokemon) => {
        if (!pokemon.id)
            pokemon.id = pokemonList.list.length > 0 ? pokemonList.list[pokemonList.list.length - 1].id + 1 : 1;
        if (await checkConnectivity()) {
            // internet: we add the items that were not added, and we reassign their id
            // based on the one provided by the server.
            // STEP 1: get pokemon from AsyncStorage

            // STEP 2: we add the current pokemon to the server and all.
            fetch("http://192.168.1.102:8000/pokemon/all/", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(pokemon),
            })
                .then(async (response) => {
                    return response.json().then(data => ({status: response.status, body: data}))
                }).then((rep) => {
                console.log('CREATED ENTITY ' + rep.body.name + ' STATUS: ' + rep.status)
            }).catch((e) => {
                throw Error('Entity creation failed! ' + e);
            })
            // then we add it to DB and UI
            addPokemonToDatabase(pokemonList.db, pokemon).then();
            setPokemonList(prevState => ({
                ...prevState,
                list: [...prevState.list, pokemon],
            }));
        } else {
            // IF THERE IS NO INTERNET, we allocate an internal ID that will later be updated
            // when we get internet connection.
            if (!pokemon.id) {
                pokemon.id = Math.random();
            }
            // and we store the Pokemon in local storage.
            const storedPokemon = await AsyncStorage.getItem('storedPokemon');
            const parsedPokemon: Pokemon[] = storedPokemon ? JSON.parse(storedPokemon) : [];

            await AsyncStorage.setItem('storedPokemon', JSON.stringify([...parsedPokemon, pokemon]));
            addPokemonToDatabase(pokemonList.db, pokemon).then();

            setPokemonList(prevState => ({
                ...prevState,
                list: [...prevState.list, pokemon],
            }));
        }
    };

    const updatePokemon = async (updatedPokemon: Pokemon) => {
        if (await checkConnectivity()) {
            fetch(`http://192.168.1.102:8000/pokemon/all/${updatedPokemon.id}/`, {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedPokemon),
            })
                .then(async (response) => {
                    return response.json().then(data => ({status: response.status, body: data}))
                }).then((rep) => {
                console.log('UPDATE ENTITY ' + rep.body.name + ' STATUS: ' + rep.status)
            })
            updatePokemonInDatabase(pokemonList.db, updatedPokemon).then();
            setPokemonList(prevState => ({
                ...prevState,
                list: prevState.list.map(p => (p.id === updatedPokemon.id ? updatedPokemon : p)),
            }));
        } else {
            Alert.alert(
                'Warning',
                'Internet connection off. Update unavailable!',
                [
                    {
                        text: 'OK', onPress: () => {
                        }
                    },
                ],
                {cancelable: true}
            );
            // updatePokemonInDatabase(pokemonList.db, updatedPokemon).then();
            // setPokemonList(prevState => ({
            //     ...prevState,
            //     list: prevState.list.map(p => (p.id === updatedPokemon.id ? updatedPokemon : p)),
            // }));
        }
    };

    const deletePokemon = async (id: number) => {
        if (await checkConnectivity()) {
            const res = await fetch(`http://192.168.1.102:8000/pokemon/all/${id}/`, {
                method: "DELETE",
            }).then((rep) => {
                console.log('DELETE ENTITY ' + id + ' STATUS: ' + rep.status)
            });
            deletePokemonFromDatabase(pokemonList.db, id).then(() => console.log('done'));
            setPokemonList(prevState => ({
                ...prevState,
                list: prevState.list.filter(p => p.id !== id),
            }));

        } else {
            Alert.alert(
                'Warning',
                'Internet connection off. Delete unavailable!',
                [
                    {
                        text: 'OK', onPress: () => {
                        }
                    },
                ],
                {cancelable: true}
            );
            // deletePokemonFromDatabase(pokemonList.db, id).then(() => console.log('done'));
            // setPokemonList(prevState => ({
            //     ...prevState,
            //     list: prevState.list.filter(p => p.id !== id),
            // }));
        }
    }


    return (
        <PokemonContext.Provider value={{pokemonList, addPokemon, updatePokemon, deletePokemon}}>
            {children}
        </PokemonContext.Provider>
    );
};

export default PokemonContext;
