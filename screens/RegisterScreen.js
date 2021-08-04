import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';

import InputField from '../components/InputField';
import CheckBox from '../components/CheckBox';
import AlertModal from '../components/AlertModal';

import axios from 'axios';

const HOST = '192.168.0.100:40389';

const RegisterScreen = ({navigation}) => {
    const [nickname, setNickname] = useState('');
    const [nicknameStatus, setNicknameStatus] = useState(false);

    const [email, setEmail] = useState('');
    const [emailStatus, setEmailStatus] = useState(false);

    const [password, setPassword] = useState('');
    const [passwordStatus, setPwdStatus] = useState(false);

    const [emailRef, setEmailRef] = useState(null);
    const [passwordRef, setPasswordRef] = useState(null);

    const [checkValue, setCheckValue] = useState(false);

    const [alertVisibility, setAlertVisibility] = useState(false);
    const [alertTitle, setAlertTitle] = useState('Error');
    const [alertText, setAlertText] = useState('The entered username is already taken');

    const [canGoBack, setCanGoBack] = useState(false);

    const [nickIconColor, setNickIconColor] = useState('#A9A9A9');
    const [emailIconColor, setEmailIconColor] = useState('#A9A9A9');
    const [passwordIconColor, setPasswordIconColor] = useState('#A9A9A9');

    const verifyPwd = (newText) => {
        var digit = false;
        var letter = false;
        var length = false;

        if (newText.match(new RegExp('[1-9]', 'g'))) {
            digit = true;
        } else {
            digit = false;
        }

        if (newText.match(new RegExp('[A-Z]', 'g'))) {
            letter = true;
        } else {
            letter = false;
        }

        if (newText.length >= 8) {
            length = true;
        } else {
            length = false;
        }

        setPwdStatus(digit && letter && length);
    };

    const verifyEmail = (newText) => {
        if (newText.includes(' ')) {
            setEmailStatus(false);
            return;
        }

        var providers = ['@gmail', '@icloud', '@yahoo', '@hotmail'];
        for (var i in providers) {
            if (!newText.includes(providers[i]) || newText.startsWith(providers[i])) {
                setEmailStatus(false);
            } else {
                setEmailStatus(true);
                break;
            }
        }
    };

    const verifyNickname = (newText) => {
        if (newText.includes(' ')) {
            setNicknameStatus(false);
        } else {
            setNicknameStatus(true);
        }
    };

    const register = async () => {
        if (!(nicknameStatus && emailStatus && passwordStatus && checkValue)) {
            return;
        }

        var result = await axios.get(`http://${HOST}/register`, {
            params: {
                'username': nickname,
                'email': email,
                'password': password
            }
        });

        if (!result.data['ok']) {
            setAlertText(result.data['message']);
            setAlertVisibility(true);
        } else {
            setAlertTitle('Success');
            setAlertText('You account have been successfully created!\n\nYou may now log in.');
            setAlertVisibility(true);

            setCanGoBack(true);
        }
    };

    const parseBool = (value) => {
        if (value) {
            return 1;
        } else {
            return 0;
        }
    };

    return (
        <View style={styles.container}>
            <AlertModal 
                visible={alertVisibility} 
                title={alertTitle} 
                text={alertText}
                closeFunc={() => {
                    setAlertVisibility(false);
                    if (canGoBack) {
                        navigation.goBack();
                    }
                }}
            />

            <View style={styles.header}>
                <View style={styles.headerItems}>
                    <TouchableOpacity 
                        style={styles.icon}
                        onPress={() => {
                            navigation.goBack();
                        }}
                    >
                        <AntDesign name="arrowleft" size={25} color="#a15ea1" />
                    </TouchableOpacity>
                    
                    <Text style={styles.headerText}>Register</Text>
                </View>
            </View>

            <ScrollView style={{flex: 1, backgroundColor: '#F5F5F5', padding: 20}}>
                <InputField 
                    onEdit={(text) => {
                        setNickname(text);
                        verifyNickname(text);
                    }}
                    onFocus={() => {
                        setNickIconColor('#a15ea1');
                    }}
                    onLostFocus={() => {
                        setNickIconColor('#A9A9A9');
                    }}
                    onDoneEditing={() => emailRef.focus()}
                    giveRef={(ref) => {}}
                    value={nickname}
                    type='nickname'
                    icon={<FontAwesome style={{alignSelf: 'center', marginRight: 10}} name="user-circle-o" size={24} color={nickIconColor} />} 
                    title='Enter a nickname' 
                    placeholder='Your nickname...'
                />
                
                <InputField 
                    onEdit={(text) => {
                        setEmail(text);
                        verifyEmail(text);
                    }}
                    onFocus={() => {
                        setEmailIconColor('#a15ea1');
                    }}
                    onLostFocus={() => {
                        setEmailIconColor('#A9A9A9');
                    }}
                    onDoneEditing={() => passwordRef.focus()}
                    giveRef={(ref) => {
                        setEmailRef(ref);
                    }}
                    value={email}
                    type='email'
                    icon={<Entypo style={{alignSelf: 'center', marginRight: 10}} name="email" size={24} color={emailIconColor} />} 
                    title='Enter an email' 
                    placeholder='Your email...'
                />

                <InputField 
                    onEdit={(text) => {
                        setPassword(text);
                        verifyPwd(text);
                    }}
                    onFocus={() => {
                        setPasswordIconColor('#a15ea1');
                    }}
                    onLostFocus={() => {
                        setPasswordIconColor('#A9A9A9');
                    }}
                    onDoneEditing={() => {}}
                    giveRef={(ref) => {
                        setPasswordRef(ref);
                    }}
                    value={password} 
                    type='password' 
                    icon={<FontAwesome5 style={{alignSelf: 'center', marginRight: 10}} name="key" size={24} color={passwordIconColor} />} 
                    title='Enter a password' 
                    placeholder='Your password...'
                />
                
                <CheckBox pressFunc={() => setCheckValue(!checkValue)} color='#a15ea1' value={checkValue} text='I agree to the Terms and Conditions'/>

                <View style={styles.regBtnContainer}>
                    <TouchableOpacity 
                        activeOpacity={parseBool(!(nicknameStatus && emailStatus && passwordStatus && checkValue))}
                        style={[styles.regBtnBackground, 
                            {backgroundColor: ((nicknameStatus && emailStatus && passwordStatus && checkValue)? 'rgb(200, 162, 200)' : 'gray')}
                        ]}

                        onPress={() => {
                            register();
                        }}
                    >
                        <Text style={styles.regBtnText}>Register</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <StatusBar translucent backgroundColor="transparent" barStyle='dark-content' />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        width: '100%',
        height: 70,
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,

        elevation: 9,
    },
    headerItems: {
        alignItems: 'center',
        flexDirection: 'row',
        position: 'absolute',
        bottom: 13
    },
    headerText: {
        fontSize: 20,
        color: '#a15ea1',
        fontFamily: 'avenir',
    },
    icon: {
        marginHorizontal: 13
    },
    regBtnContainer: {
        width: '100%',
        height: 60,
        paddingHorizontal: 40,
    },
    regBtnBackground: {
        flex: 1,
        backgroundColor: 'rgb(200, 162, 200)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 40
    },
    regBtnText: {
        color: 'white',
        fontFamily: 'avenir',
        fontWeight: 'bold',
        fontSize: 20
    }
});

export default RegisterScreen;