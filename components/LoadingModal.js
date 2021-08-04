import React from 'react';
import {View, Text, ActivityIndicator, Modal, StyleSheet} from 'react-native';

const LoadingModal = ({visible, text}) => {
    return (
        <Modal
            transparent
            visible={visible}
            animationType='fade'
        >
            <View style={styles.container}>
               <View style={styles.body}>
                    <Text style={styles.text}>{text}</Text>
                    <ActivityIndicator 
                        size='large'
                        color='#a15ea1'
                    />
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
        width: 150,
        height: 150,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15
    },
    text: {
        fontSize: 19,
        fontFamily: 'avenir-bold',
        marginBottom: 10
    }
});

export default LoadingModal;