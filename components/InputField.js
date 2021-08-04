import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native';

import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';

const InputField = ({title, multiLine, customStyle, type, placeholder, icon, value, onEdit, giveRef, onDoneEditing, onFocus, onLostFocus}) => {
    const [letterValid, setLetterValid] = useState(false);
    const [digitValid, setDigitValid] = useState(false);
    const [lengthValid, setLengthValid] = useState(false);

    const [nicknameValid, setNicknameValid] = useState(true);
    const [emailValid, setEmailValid] = useState(true);

    const [passwordVisible, setPasswordVisible] = useState(false);

    const [currentBorderColor, setCurrentBorderColor] = useState('gray');

    const [eyeIcon, setEyeIcon] = useState('eye');

    const warnings = {
        'nickname': ' • invalid nickname',
        'email' : ' • invalid email'
    };

    const eyeTypes = {
        'eye': 'eye-with-line',
        'eye-with-line': 'eye'
    };

    const handleText = (newText) => {
        onEdit(newText);

        if (type=='password') {
            if (newText.match(new RegExp('[1-9]', 'g'))) {
                setDigitValid(true);
            } else {
                setDigitValid(false);
            }

            if (newText.match(new RegExp('[A-Z]', 'g'))) {
                setLetterValid(true);
            } else {
                setLetterValid(false);
            }

            if (newText.length >= 8) {
                setLengthValid(true);
            } else {
                setLengthValid(false);
            }
        }

        if (type=='email') {
            if (newText.includes(' ')) {
                setEmailValid(false);
                return;
            }

            var providers = ['@gmail', '@icloud', '@yahoo', '@hotmail'];
            for (var i in providers) {
                if (!newText.includes(providers[i]) || newText.startsWith(providers[i])) {
                    setEmailValid(false);
                } else {
                    setEmailValid(true);
                    break;
                }
            }
        }

        if (type=='nickname'){
            if (newText.includes(' ')) {
                setNicknameValid(false);
            } else {
                setNicknameValid(true);
            }
        }
    };

    return (
        <View style={[styles.container, customStyle]}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.title}>{title}</Text>
                {(type=='nickname' && !nicknameValid)? (
                    <Text style={{fontSize: 15, marginLeft: 5, color: 'red', fontFamily:'avenir'}}>{warnings[type]}</Text>
                ) : null}
                {(type=='email' && !emailValid)? (
                    <Text style={{fontSize: 15, marginLeft: 5, color: 'red', fontFamily:'avenir'}}>{warnings[type]}</Text>
                ) : null}
            </View>

            <View style={[styles.inputBackground, {borderBottomColor: currentBorderColor}]}>
                {icon}
                <TextInput
                    ref={giveRef}
                    onFocus={() => {
                        onFocus();
                        setCurrentBorderColor('#a15ea1');
                    }}
                    onBlur={() => {
                        setCurrentBorderColor('gray');
                        onLostFocus();
                    }}
                    multiline={multiLine}
                    autoCapitalize='none'
                    autoCorrect={false}
                    spellCheck={false}
                    onSubmitEditing={onDoneEditing}
                    value={value}
                    onChangeText={handleText}
                    secureTextEntry={(type=='password' && !passwordVisible)}
                    style={styles.input}
                    placeholder={placeholder}
                />
                {type!='password'? null : (
                    <TouchableOpacity 
                        style={styles.eyeIcon}
                        onPress={() => {
                            setEyeIcon(eyeTypes[eyeIcon]);
                            setPasswordVisible(!passwordVisible)
                        }}
                    >
                        <Entypo name={eyeIcon} size={30} color="#A9A9A9" />
                    </TouchableOpacity>
                )}
            </View>

            {type=='password'? (
                <View style={{
                    width: '100%',
                    marginTop: 15
                }}>
                    <View style={{
                        flexDirection: 'row'
                    }}>
                        {letterValid? (
                            <Feather style={styles.icon} name="check" size={24} color="#00b300" />
                        ) : (
                            <AntDesign style={styles.icon} name="close" size={24} color="red" />
                        )}
                        <Text>contains at least one capital letter</Text>
                    </View>

                    <View style={{
                        flexDirection: 'row'
                    }}>
                        {digitValid? (
                            <Feather style={styles.icon} name="check" size={24} color="#00b300" />
                        ) : (
                            <AntDesign style={styles.icon} name="close" size={24} color="red" />
                        )}
                        <Text>contains at least one digit</Text>
                    </View>

                    <View style={{
                        flexDirection: 'row'
                    }}>
                        {lengthValid? (
                            <Feather style={styles.icon} name="check" size={24} color="#00b300" />
                        ) : (
                            <AntDesign style={styles.icon} name="close" size={24} color="red" />
                        )}
                        <Text>has at least 8 characters</Text>
                    </View>
                </View>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 25
    },
    inputBackground: {
        width: '100%',
        minHeight: 50,
        maxHeight: 100,
        flexDirection: 'row',
        borderBottomWidth: 2
    },
    input: {
        flex: 1,
        fontFamily: 'avenir',
        fontSize: 17
    },
    title: {
        fontFamily: 'avenir',
        fontSize: 20,
        color: '#a15ea1'
    },
    icon: {
        marginRight: 10
    },
    eyeIcon: {
        alignSelf: 'center',
        marginLeft: 10
    }
});

export default InputField;