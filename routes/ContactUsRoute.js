import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Keyboard, TouchableWithoutFeedback, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import axios from 'axios';

import Entypo from 'react-native-vector-icons/Entypo';

import InputField from '../components/InputField';

const HOST = '192.168.0.100:40389';

const ContactUsRoute = ({ navigation }) => {
    const [message, setMessage] = useState('');
    const [username, setUsername] = useState(null);

    const readSettings = async () => {
        // try {
        //     var raw_settings = await FileSystem.readAsStringAsync(
        //         FileSystem.documentDirectory + 'settings.json'
        //     );

        //     var Settings = JSON.parse(raw_settings);
        //     setUsername(Settings.alias);
        // } catch (err) {
        //     console.log(err);
        // }

        var raw_settings = await AsyncStorage.getItem('settings');
        var Settings = JSON.parse(raw_settings);
        setUsername(Settings.alias);
    };

    const sendQuestion = async () => {
        var result = await axios.get(`http://${HOST}/sendQuestion`, {
            params: {
                'username': username,
                'body': message
            }
        });

        setMessage('');
    };

    useEffect(() => {
        readSettings();
    }, []);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerItems}>
                        <TouchableOpacity
                            style={styles.headerIcon}
                            onPress={() => {
                                Keyboard.dismiss();
                                navigation.openDrawer();
                            }}
                        >
                            <Entypo name="menu" size={30} color="white" />
                        </TouchableOpacity>

                        <Text style={styles.headerText}>Contact us</Text>
                    </View>
                </View>

                <View style={{ paddingHorizontal: 20 }}>
                    <InputField
                        multiLine={true}
                        value={message}
                        placeholder='Your message...'
                        onEdit={(newText) => setMessage(newText)}
                        onFocus={() => { }}
                        onLostFocus={() => { }}
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={sendQuestion} style={styles.buttonBackground}>
                        <Text style={styles.buttonText}>Send message</Text>
                    </TouchableOpacity>
                </View>

                <StatusBar translucent backgroundColor="transparent" barStyle='light-content' />
            </View>
        </TouchableWithoutFeedback>
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
        height: 100,
        paddingVertical: 15,
        paddingHorizontal: 50
    },
    buttonBackground: {
        flex: 1,
        backgroundColor: '#a15ea1',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    buttonText: {
        color: 'white',
        fontFamily: 'avenir-bold',
        fontSize: 20
    }
});

export default ContactUsRoute;
