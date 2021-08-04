import React from 'react';
import {View, TextInput, StyleSheet, TouchableOpacity} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

const CommentInput = ({value, onChange, sendFunc}) => {
    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    value={value}
                    style={styles.input}
                    onChangeText={onChange}
                    placeholder='Aaa...'
                />
            </View>

            {(value.length == 0)? (null) : (
                <TouchableOpacity onPress={sendFunc} style={styles.icon}>
                    <Ionicons 
                        name="send" 
                        size={24} 
                        color="#a15ea1"
                    />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 65,
        flexDirection: 'row',
        borderColor: '#DCDCDC',
        borderTopWidth: 0.2
    },
    inputContainer: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 10
    },
    input: {
        flex: 1,
        backgroundColor: '#F0F0F0',
        borderRadius: 5,
        paddingHorizontal: 13
    },
    icon: {
        alignSelf: 'center',
        marginRight: 10
    }
});

export default CommentInput;