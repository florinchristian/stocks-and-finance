import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    TextInput
} from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';
import md5 from 'md5';

import axios from 'axios';

const HOST = '192.168.0.100:40389';

const DataChangePrompt = ({ 
    visibility,
    type, 
    closeFunc, 
    defaultValue,
    setAlertTitle,
    setAlertText,
    showAlert,
    oldPassword,

    currentUser,
    submitUsername,
    submitEmail,
    submitPassword
}) => {
    const [textValue, setTextValue] = useState(''); // normal input
    const [extraText, setExtraText] = useState(''); // password input

    const checkUsername = (newText) => {
        if (newText.includes(' ')) return false;
        else return true;
    };

    const checkEmail = (newText) => {
        if (newText.includes(' ')) {
            return false;
        }

        var providers = ['@gmail', '@icloud', '@yahoo', '@hotmail'];
        for (var i in providers) {
            if (!newText.includes(providers[i]) || newText.startsWith(providers[i])) {
                return false;
            } else {
                return true;
            }
        }
    };

    const checkPassword = (newText) => {
        var okDigit = false;
        var okLetter = false;
        var okLength = false;

        if (newText.match(new RegExp('[1-9]', 'g'))) {
            okDigit = true;
        } else {
            okDigit = false;
        }

        if (newText.match(new RegExp('[A-Z]', 'g'))) {
            okLetter = true;
        } else {
            okLetter = false;
        }

        if (newText.length >= 8) {
            okLength = true;
        } else {
            okLength = false;
        }

        return (okDigit && okLetter && okLength);
    };

    const passwordsMatch = (newText) => {
        return (md5(newText) == oldPassword);
    };

    const handleSubmit = async () => {
        if (type == 'username')
            if (!checkUsername(textValue)) {
                setAlertTitle('Error');
                setAlertText('Invalid username!\nIt should not contain any spaces!');
                showAlert();
                setTextValue('');
                setExtraText('');
            } else {
                var result = await axios.get(`http://${HOST}/usernameAvailable`, {
                    params: {
                        'username': textValue
                    }
                });

                if (result.data['available']) {
                    submitUsername(defaultValue, textValue);
                    setTextValue('');
                    setExtraText('');
                } else {
                    setAlertTitle('Error');
                    setAlertText('The entered username is already in use!');
                    showAlert();
                }
            }
        else if (type == 'email')
            if (!checkEmail(textValue)) {
                setAlertTitle('Error');
                setAlertText('Invalid email!\nIt should not contain any special characters or spaces!');
                showAlert();
                setTextValue('');
                setExtraText('');
            } else {
                var result = await axios.get(`http://${HOST}/emailAvailable`, {
                    params: {
                        'email': textValue
                    }
                });

                if (result.data['available']) {
                    submitEmail(defaultValue, textValue);
                    setTextValue('');
                    setExtraText('');
                } else {
                    setAlertTitle('Error');
                    setAlertText('The entered email is already in use!');
                    showAlert();
                }
            }
        else if (type == 'password') {
            if (!passwordsMatch(textValue)) {
                setAlertTitle('Error');
                setAlertText('Invalid current password!\nPlease check it again!');
                showAlert();
                setTextValue('');
                setExtraText('');
                return;
            }

            if (textValue == '' || extraText == '') {
                setAlertTitle('Error');
                setAlertText('Both fields are necessary!');
                showAlert();
                setTextValue('');
                setExtraText('');
                return;
            }

            if (!checkPassword(extraText)) {
                setAlertTitle('Error');
                setAlertText('Invalid new password!\nIt should contain at least 8 alphanumeric characters!');
                showAlert();
                setTextValue('');
                setExtraText('');
                return;
            }

            // console.log(currentUser, extraText);
            submitPassword(currentUser, extraText);
        }
    };

    const handleClose = () => {
        setTextValue('');
        setExtraText('');
        closeFunc();
    };

    useEffect(() => {

    }, [defaultValue]);

    return (
        <Modal
            transparent
            visible={visibility}
        >
            <View style={styles.container}>
                <View style={styles.body}>
                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: 30
                    }}>
                        <TouchableOpacity onPress={handleClose} style={styles.icon}>
                            <AntDesign name="arrowleft" size={24} color="#a15ea1" />
                        </TouchableOpacity>

                        <Text style={{
                            fontFamily: 'avenir-bold',
                            fontSize: 17
                        }}>Edit {type}</Text>
                    </View>

                    <View style={{
                        paddingVertical: 5,
                        paddingHorizontal: 10
                    }}>
                        {(type == 'password') ? (
                            <View>
                                <View
                                    style={styles.inputContainer}
                                >
                                    <TextInput
                                        style={{ flex: 1, fontFamily: 'avenir' }}
                                        placeholder='Current password'
                                        placeholderTextColor='gray'
                                        value={textValue}
                                        onChangeText={(newText) => setTextValue(newText)}
                                    />
                                </View>

                                <View
                                    style={styles.inputContainer}
                                >
                                    <TextInput
                                        style={{ flex: 1, fontFamily: 'avenir' }}
                                        placeholder={`New ${type}`}
                                        placeholderTextColor='gray'
                                        value={extraText}
                                        onChangeText={(newText) => setExtraText(newText)}
                                    />
                                </View>
                            </View>
                        ) : (
                            <View
                                style={styles.inputContainer}
                            >
                                <TextInput
                                    style={{ flex: 1, fontFamily: 'avenir' }}
                                    placeholder={`New ${type}`}
                                    placeholderTextColor='gray'
                                    value={textValue}
                                    onChangeText={(newText) => setTextValue(newText)}
                                />
                            </View>
                        )}
                    </View>

                    <View style={{
                        width: '100%',
                        height: 50,
                        paddingHorizontal: 10,
                        marginVertical: 10
                    }}>
                        <TouchableOpacity onPress={handleSubmit} style={{
                            flex: 1,
                            backgroundColor: '#a15ea1',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 10
                        }}>
                            <Text style={{
                                color: 'white',
                                fontFamily: 'avenir-bold',
                                fontSize: 17
                            }}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    body: {
        width: 300,
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 5
    },
    inputContainer: {
        width: '100%',
        height: 50,
        backgroundColor: '#E8E8E8',
        borderRadius: 10,
        paddingHorizontal: 10,
        marginVertical: 10
    },
    icon: {
        position: 'absolute',
        left: 5
    }
});

export default DataChangePrompt;