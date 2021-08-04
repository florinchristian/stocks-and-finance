import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const InfoContainer = ({title, value, onPress}) => {
    return(
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>

            <View style={styles.valueContainer}>
                <Text style={styles.value}>{value}</Text>

                <TouchableOpacity onPress={onPress} style={styles.button}>
                    <Text style={styles.buttonText}>Change</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    valueContainer: {
        paddingVertical: 5,
        borderTopWidth: 1,
        borderTopColor: 'gray',
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        flexDirection: 'row',
        paddingHorizontal: 10
    },
    title: {
        fontSize: 23,
        fontFamily: 'avenir-bolder',
        color: '#a15ea1'
    },
    value: {
        fontSize: 18,
        fontFamily: 'avenir-bold'
    },
    button: {
        position: 'absolute',
        right: 10,
        alignSelf: 'center'
    },
    buttonText: {
        fontSize: 18,
        fontFamily: 'avenir-bold',
        color: '#a15ea1'
    }
});

export default InfoContainer;