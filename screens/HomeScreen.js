import React from 'react';

import LoadingScreen from '../screens/LoadingScreen';
import LoginScreen from '../screens/LoginScreen';
import MainScreen from '../screens/MainScreen';

import AsyncStorage from '@react-native-community/async-storage';

class HomeScreen extends React.Component {
    state = {
        currentScreen: <LoadingScreen />
    };

    writeSettings = async (username, password, email) => {
        await AsyncStorage.setItem('settings', JSON.stringify({
            'alias': username,
            'email': email,
            'key': password,
            'lang': 'en'
        }));

        console.log('User settings have been written successfully');
    };

    loginCallback = async (username, password, email) => {
        await this.writeSettings(username, password, email);
        this.setState({ currentScreen: <MainScreen /> });
    };

    checkSettings = async () => {
        var rawSettings = await AsyncStorage.getItem('settings');

        if (rawSettings == null) {
            console.log('No settings file. Writing one.');

            await AsyncStorage.setItem('settings', JSON.stringify({
                'alias': null,
                'email': null,
                'key': null
            }));

            console.log('Default settings have been written successfully.');

            rawSettings = await AsyncStorage.getItem('settings');
        }

        var settings = JSON.parse(rawSettings);

        console.log('Settings have been read successfully.');

        if (settings.alias == null) {
            console.log('No user found. Setting the login screen.');
            this.setState(
                {
                    currentScreen: <LoginScreen
                        navigation={this.props.navigation}
                        successLogin={this.loginCallback}
                    />
                }
            );
        } else {
            this.setState({currentScreen: <MainScreen />});
        }
    };

    componentDidMount() {
        this.checkSettings();
    }

    render() {
        return this.state.currentScreen;
    }
};

export default HomeScreen;