import React, {useState} from 'react';
import {
    View, 
    Text, 
    Modal,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';

import axios from 'axios';

const HOST = '192.168.0.100:40389';

const AnswerPrompt = ({visibility, closeFunc, id, removeFunc, updateFunc}) => {
    const [value, setValue] = useState('');

    const sendAnswer = async () => {
        var result = await axios.get(`http://${HOST}/sendAnswer`, {
            params: {
                'id': id,
                'body': value
            }
        });

        setValue('');
        updateFunc();
        removeFunc(id);
        closeFunc();
    };

    return (
        <Modal
            visible={visibility}
            animationType='slide'
            transparent
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <View style={styles.body}>
                        <View style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row'
                        }}>
                            <TouchableOpacity
                                onPress={() => {
                                    setValue('');
                                    closeFunc();
                                }}
                                style={styles.closeIcon}
                            >
                                <AntDesign name="arrowleft" size={30} color="#a15ea1" />
                            </TouchableOpacity>

                            <Text style={styles.title}>Your answer:</Text>
                        </View>

                        <View style={{
                            flex: 1,
                            backgroundColor: '#F5F5F5',
                            borderRadius: 10
                        }}>
                            <TextInput 
                                multiline
                                value={value}
                                onChangeText={(newText) => setValue(newText)}
                                placeholder='Aaa...'
                                style={{
                                    padding: 10,
                                    fontSize: 17,
                                    fontFamily: 'avenir'
                                }}
                            />
                        </View>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={sendAnswer} style={styles.button}>
                                <Text style={styles.buttonText}>Send answer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
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
        height: 250,
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 15
    },
    title: {
        fontSize: 17,
        fontFamily: 'avenir-bolder',
        marginBottom: 10
    },
    buttonContainer: {
        width: '100%',
        height: 50,
        padding: 5,
        marginTop: 10
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#a15ea1',
        borderRadius: 10
    },
    buttonText: {
        fontFamily: 'avenir-bolder',
        color: 'white',
        fontSize: 16
    },
    closeIcon: {
        position: 'absolute',
        left: 0,
        top: -4
    }
});

export default AnswerPrompt;