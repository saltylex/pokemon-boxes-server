import {Pokemon} from "../models/Pokemon";
import {enablePromise, openDatabase, SQLiteDatabase } from 'react-native-sqlite-storage'

enablePromise(true);

export const getDatabaseConnection = async () => {
    return openDatabase({name: 'pokemon.db', location: 'default'});
}

export const createTable = async (db: SQLiteDatabase | undefined) => {
    const query = `CREATE TABLE IF NOT EXISTS POKEMON
                   (
                       id
                       INTEGER
                       PRIMARY
                       KEY,
                       name
                       TEXT
                       NOT
                       NULL,
                       type
                       TEXT
                       NOT
                       NULL,
                       sprite
                       TEXT,
                       date
                       TEXT,
                       place
                       TEXT,
                       game
                       TEXT,
                       notes
                       TEXT,
                       caught
                       INTEGER,
                       dexNo
                       INTEGER
                   );`;
    if ("executeSql" in db) {
        await db.executeSql(query);
    }

}

export const getPokemon = async (db: SQLiteDatabase | null): Promise<Pokemon[]> => {
    try {
        const pokemon: Pokemon[] = [];
        let result;
        if ("executeSql" in db) {
            result = await db.executeSql('SELECT * FROM POKEMON;');
        }
        result.forEach(p => {
            for (let i = 0; i < p.rows.length; i++) pokemon.push(p.rows.item(i))
        })
        return pokemon;
    } catch (e) {
        console.log(e);
        throw Error('Failed to get Pokemon from db!');
    }
}

export const addPokemonToDatabase = async (db: SQLiteDatabase | null, pkm: Pokemon) => {
    const query = `INSERT INTO POKEMON(id,
                                       name,
                                       type,
                                       sprite,
                                       date,
                                       place,
                                       game,
                                       notes,
                                       caught,
                                       dexNo)
                   VALUES ('${pkm.id}', '${pkm.name}', '${pkm.type}', '${pkm.sprite}', '${pkm.date}', '${pkm.place}',
                           '${pkm.game}', '${pkm.notes}', '${pkm.caught}', '${pkm.dexNo}');`;
    if ("executeSql" in db) {
        await db.executeSql(query);
    }
}


export const updatePokemonInDatabase = async (db: SQLiteDatabase | null, pkm: Pokemon) => {
    const query = `UPDATE Pokemon
                   SET name='${pkm.name}',
                       type='${pkm.type}',
                       sprite='${pkm.sprite}',
                       date='${pkm.date}',
                       place='${pkm.place}',
                       game='${pkm.game}',
                       notes='${pkm.notes}',
                       caught='${pkm.caught}',
                       dexNo='${pkm.dexNo}'
                   WHERE id = ${pkm.id};
    `;
    if ("executeSql" in db) {
        await db.executeSql(query);
    }
}

export const deletePokemonFromDatabase = async (db: SQLiteDatabase | null, pkm: number) => {
    const query = `DELETE FROM POKEMON WHERE id = ${pkm};`;
    if ("executeSql" in db) {
        await db.executeSql(query);
    }
}
