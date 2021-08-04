import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Platform, StatusBar} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';

import AlertModal from '../components/AlertModal';

import axios from 'axios';
import md5 from 'md5';

const HOST = '192.168.0.100:40389';

const LoginScreen = ({ navigation , successLogin}) => {
    const [passwordInput, setPasswordInput] = useState(null);

    const [username, setUsername] = useState('');
    const [password, setPasssword] = useState('');

    const [eyeIcon, setEyeIcon] = useState('eye');
    const [passwordVisible, setPasswordVisible] = useState(false);

    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('Error');
    const [modalText, setModalText] = useState('da');

    const eyeTypes = {
        'eye': 'eye-with-line',
        'eye-with-line': 'eye'
    };

    const login = async () => {
        try {
            var response = await axios.get(`http://${HOST}/login`, {
                params: {
                    'username': username,
                    'password': md5(password)
                }
            });

            if (!response.data['ok']) {
                setModalText('Error');
                setModalText(response.data['message']);
                setModalVisible(true);
            } else {
                successLogin(username, md5(password), response.data['email']);
            }
        } catch (err) {
            console.log(err);
        }
    };

    if (true) {
        return (
            <View style={styles.container}>
                <AlertModal 
                    visible={modalVisible}
                    title={modalTitle}
                    text={modalText}
                    closeFunc={() => {
                        setModalVisible(false);
                    }}
                />

                <View style={styles.logoContainer}>
                    <Image
                        style={styles.logo}
                        source={require('../assets/img/StocksFinanceLogo2.png')}
                    />
                </View>

                <View style={{
                    flex: 1,
                }}>
                    <View style={styles.inputFieldsContainer}>
                        <View style={styles.inputFieldsBackground}>
                            <View style={styles.inputFieldBackground}>
                                <View style={styles.iconContainer}>
                                    <FontAwesome name="user-circle-o" size={24} color="#A9A9A9" />
                                </View>

                                <TextInput
                                    value={username}
                                    spellCheck={false}
                                    autoCapitalize='none'
                                    autoCompleteType='off'
                                    onChangeText={(newText) => setUsername(newText)}
                                    placeholder='Username'
                                    style={styles.input}
                                    onSubmitEditing={() => {
                                        passwordInput.focus();
                                    }}
                                />
                            </View>

                            <View
                                style={{
                                    borderColor: '#D3D3D3',
                                    width: '70%',
                                    alignSelf: 'center',
                                    borderWidth: 1,
                                    borderRadius: 2
                                }}
                            ></View>

                            <View style={styles.inputFieldBackground}>
                                <View style={styles.iconContainer}>
                                    <FontAwesome5 name="key" size={24} color="#A9A9A9" />
                                </View>

                                <TextInput
                                    ref={(ref) => setPasswordInput(ref)}
                                    value={password}
                                    onChangeText={(newText) => setPasssword(newText)}
                                    placeholder='Password'
                                    style={styles.input}
                                    secureTextEntry={!passwordVisible}
                                />

                                <TouchableOpacity
                                    style={styles.eyeIcon}
                                    onPress={() => {
                                        setEyeIcon(eyeTypes[eyeIcon]);
                                        setPasswordVisible(!passwordVisible);
                                    }}
                                >
                                    <Entypo name={eyeIcon} size={30} color="#A9A9A9" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View style={styles.loginBtnContainer}>
                        <TouchableOpacity
                            onPress={login}
                            style={styles.loginBtnBackground}
                        >
                            <Text style={styles.loginBtnText}>Login</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{
                        width: '100%',
                        height: 50,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{
                            fontFamily: (Platform.OS == 'android' ? 'avenir' : 'Avenir'),
                            fontSize: 17
                        }}>Haven't registered yet?</Text>

                        <TouchableOpacity
                            style={{
                                marginLeft: 5
                            }}
                            onPress={() => navigation.navigate('Register')}
                        >
                            <Text style={{
                                fontFamily: (Platform.OS == 'android' ? 'avenir' : 'Avenir'),
                                fontSize: 17,
                                color: '#1E90FF'
                            }}>Create an account</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <StatusBar translucent backgroundColor="transparent" barStyle='dark-content' />
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    logoContainer: {
        width: '100%',
        height: 220,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        width: '100%',
        height: 130,
        resizeMode: 'contain',
    },
    inputFieldsContainer: {
        width: '100%',
        height: 170,
        padding: 20
    },
    inputFieldsBackground: {
        flex: 1,
        backgroundColor: '#F0F0F0',
        borderRadius: 20,
        paddingVertical: 5,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4,
    },
    inputFieldBackground: {
        flex: 1,
        flexDirection: 'row',
    },
    iconContainer: {
        width: '15%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        flex: 1,
        fontFamily: (Platform.OS == 'android' ? 'avenir' : 'Avenir'),
        fontSize: 20
    },
    loginBtnContainer: {
        width: '100%',
        height: 75,
        paddingHorizontal: 20,
        marginVertical: 15
    },
    loginBtnBackground: {
        flex: 1,
        backgroundColor: 'rgb(200, 162, 200)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 40
    },
    loginBtnText: {
        color: 'white',
        fontFamily: (Platform.OS == 'android' ? 'avenir' : 'Avenir'),
        fontWeight: 'bold',
        fontSize: 20
    },
    eyeIcon: {
        width: '15%',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default LoginScreen;