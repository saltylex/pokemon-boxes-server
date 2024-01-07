import {SafeAreaView, StyleSheet, Text, View, Image, YellowBox} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PokemonListScreen from './src/screens/PokemonListScreen';
import PokemonDetailScreen from './src/screens/PokemonDetailScreen';
import PokemonContext, {PokemonProvider} from "./src/contexts/PokemonContext";
import {LogBox} from 'react-native';

LogBox.ignoreLogs(['ReactImageView:', 'source.uri', 'Failed prop type', 'Possible', 'Encountered']);

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <PokemonProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="PokemonList">
                    <Stack.Screen
                        name="PokemonList"
                        component={PokemonListScreen}
                        options={{title: 'Pokemon List'}}
                    />
                    <Stack.Screen
                        name="PokemonDetail"
                        component={PokemonDetailScreen}
                        options={{title: 'Pokemon Detail'}}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </PokemonProvider>
    );
}

const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
        },
        title:
            {
                width: 300, height: 90, position: "absolute", top: 20,

            },
    }
);
