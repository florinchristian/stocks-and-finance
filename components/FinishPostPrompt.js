import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Modal,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard
} from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';

import InputField from './InputField';

const FinishPostPrompt = ({
    visible,
    submitFunc,
    handleClose
}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const [descRef, setDescRef] = useState(null);

    return (
        <Modal
            transparent
            visible={visible}
            animationType='fade'
        >
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.body}>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={handleClose} style={styles.icon}>
                                <AntDesign name="arrowleft" size={24} color="#a15ea1" />
                            </TouchableOpacity>

                            <Text style={styles.headerText}>Finish post</Text>
                        </View>

                        <View style={{
                            paddingHorizontal: 10
                        }}>
                            <InputField
                                placeholder='Romanian title'
                                customStyle={{ marginBottom: 0 }}
                                value={title}
                                onEdit={(text) => setTitle(text)}
                                onFocus={() => { }}
                                onLostFocus={() => { }}
                                onDoneEditing={() => descRef.focus()}
                            />

                            <InputField
                                placeholder='Romanian description'
                                customStyle={{ marginBottom: 0 }}
                                giveRef={(ref) => setDescRef(ref)}
                                value={description}
                                multiLine={true}
                                onEdit={(text) => setDescription(text)}
                                onFocus={() => { }}
                                onLostFocus={() => { }}
                            />
                        </View>

                        <View style={styles.btnContainer}>
                            <TouchableOpacity onPress={() => submitFunc(title, description)} style={styles.btnBackground}>
                                <Text style={styles.btnText}>Send post</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerText: {
        fontFamily: 'avenir-bolder',
        fontSize: 17
    },
    icon: {
        position: 'absolute',
        left: 0
    },
    body: {
        width: 250,
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,
        elevation: 16,
        padding: 5,
        borderRadius: 10
    },
    btnContainer: {
        width: '100%',
        height: 70,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 20
    },
    btnBackground: {
        flex: 1,
        backgroundColor: '#a15ea1',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20
    },
    btnText: {
        color: 'white',
        fontFamily: 'avenir-bolder',
        fontSize: 19
    }
});

export default FinishPostPrompt;