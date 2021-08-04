import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    StatusBar
} from 'react-native';

import Entypo from 'react-native-vector-icons/Entypo';

import AsyncStorage from '@react-native-community/async-storage';

import InfoContainer from '../components/InfoContainer';
import DataChangePrompt from '../components/DataChangePrompt';
import AlertModal from '../components/AlertModal';
import Picker from '../components/Picker';

import axios from 'axios';
import md5 from 'md5';

const HOST = '192.168.0.100:40389';

const SettingsRoute = ({ navigation }) => {
    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);

    const [language, setLanguage] = useState('Loading...');

    const [usernamePromptVis, setUserVis] = useState(false);

    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState('');
    const [alertText, setAlertText] = useState('');

    const [currentType, setType] = useState(null);
    const [defaultValue, setDefaultValue] = useState(null);

    const updateDrawer = navigation.getParam('updateDrawer', () => {});

    const languages = {
        'English': 'en',
        'Romanian': 'ro'
    };

    const invert = {
        'ro': 'Romanian',
        'en': 'English'
    };

    const loadSettings = async () => {
        var rawData = await AsyncStorage.getItem('settings');
        var settings = JSON.parse(rawData);
        setUsername(settings.alias);
        setEmail(settings.email);
        setPassword(settings.key);
        setLanguage(invert[settings.lang]);
    };

    const preparePrompt = type => {
        setType(type);

        switch (type) {
            case 'username':
                setDefaultValue(username);
                break;
            case 'email':
                setDefaultValue(email);
                break;
            default:
                setDefaultValue(null);
        }

        setUserVis(true);
    };

    const saveUsername = async (oldUsername, newUsername) => {
        var result = await axios.get(`http://${HOST}/changeUsername`, {
            params: {
                old: oldUsername,
                new: newUsername
            }
        });


        if (result.data['ok']) {
            var rawData = await AsyncStorage.getItem('settings');
            var settings = JSON.parse(rawData);
            settings.alias = newUsername;
            setUsername(newUsername);
            await AsyncStorage.setItem('settings', JSON.stringify(settings));
            updateDrawer();
        }

        setUserVis(false);
    };

    const saveEmail = async (oldEmail, newEmail) => {
        var result = await axios.get(`http://${HOST}/changeEmail`, {
            params: {
                old: oldEmail,
                new: newEmail
            }
        });

        if (result.data['ok']) {
            var rawData = await AsyncStorage.getItem('settings');
            var settings = JSON.parse(rawData);
            settings.email = newEmail;
            setEmail(newEmail);
            await AsyncStorage.setItem('settings', JSON.stringify(settings));
            updateDrawer();
        }

        setUserVis(false);
    };

    const savePassword = async (username, newPassword) => {
        var result = await axios.get(`http://${HOST}/changePassword`, {
            params: {
                user: username,
                'newPass': newPassword
            }
        });

        if (result.data['ok']) {
            var rawData = await AsyncStorage.getItem('settings');
            var settings = JSON.parse(rawData);
            settings.key = md5(newPassword);
            await AsyncStorage.setItem('settings', JSON.stringify(settings));
            navigation.goBack();
        }

        setUserVis(false);
    };

    const saveLanguage = async (newLanguage) => {
        var raw = await AsyncStorage.getItem('settings');
        var settings = JSON.parse(raw);
        settings.lang = languages[newLanguage];
        await AsyncStorage.setItem('settings', JSON.stringify(settings));

        setLanguage(newLanguage);
    };

    useEffect(() => {
        loadSettings();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerItems}>
                    <TouchableOpacity
                        style={styles.headerIcon}
                        onPress={() => {
                            navigation.openDrawer();
                        }}
                    >
                        <Entypo name="menu" size={30} color="white" />
                    </TouchableOpacity>

                    <Text style={styles.headerText}>Settings</Text>
                </View>
            </View>

            <InfoContainer
                title='Username'
                value={username}
                onPress={() => preparePrompt('username')}
            />

            <InfoContainer
                title='Email'
                value={email}
                onPress={() => preparePrompt('email')}
            />

            <InfoContainer
                title='Password'
                value='********'
                onPress={() => preparePrompt('password')}
            />


            <AlertModal
                visible={alertVisible}
                title={alertTitle}
                text={alertText}
                closeFunc={() => setAlertVisible(false)}
            />

            <DataChangePrompt
                type={currentType}
                visibility={usernamePromptVis}
                defaultValue={defaultValue}
                showAlert={() => setAlertVisible(true)}
                setAlertTitle={setAlertTitle}
                setAlertText={setAlertText}
                oldPassword={password}
                closeFunc={() => {
                    setUserVis(false);
                }}

                currentUser={username}

                submitUsername={saveUsername}
                submitEmail={saveEmail}
                submitPassword={savePassword}
            />

            <View style={{
                paddingHorizontal: 20
            }}>
                <Picker 
                    title="Posts' language"
                    selectedValue={language}
                    values={['English', 'Romanian']}
                    onChangeValue={saveLanguage}
                />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Delete my account</Text>
                </TouchableOpacity>
            </View>

            <StatusBar translucent backgroundColor="transparent" barStyle='light-content' />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        width: '100%',
        height: 80,
        backgroundColor: '#a15ea1',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,

        elevation: 16,
    },
    headerItems: {
        width: '100%',
        height: 55,
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerText: {
        fontFamily: 'avenir-bold',
        color: 'white',
        fontSize: 23
    },
    headerIcon: {
        marginHorizontal: 10
    },
    buttonContainer: {
        width: '100%',
        height: 70,
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#a15ea1',
        borderRadius: 15
    },
    buttonText: {
        color: 'white',
        fontFamily: 'avenir-bolder',
        fontSize: 17
    }
});

export default SettingsRoute;