import React from 'react';
import {View, Text, Modal, StyleSheet, TouchableOpacity} from 'react-native';

const AlertModal = ({visible, title, text, closeFunc}) => {
    return(
        <Modal
            transparent
            animationType='fade'
            visible={visible}
        >
            <View style={styles.container}>
                <View style={styles.modalBody}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.text}>{text}</Text>

                    <TouchableOpacity onPress={closeFunc} style={styles.button}>
                        <Text style={styles.buttonText}>Okay</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    modalBody: {
        width: 300,
        height: 170,
        backgroundColor: 'white',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,

        elevation: 10,
    },
    title: {
        fontSize: 25,
        fontFamily: 'avenir-bold',
        color: '#a15ea1'
    },
    text: {
        fontFamily: 'avenir-bold',
        fontSize: 17,
        marginTop: 10
    },
    button: {
        position: 'absolute',
        bottom: 15,
        right: 25
    },
    buttonText: {
        fontSize: 18,
        fontFamily: 'avenir-bolder',
        color: '#a15ea1'
    }
});

export default AlertModal;