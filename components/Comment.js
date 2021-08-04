import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const Comment = ({username, body}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.username}>@{username}</Text>
            <Text style={styles.body}>{body}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomColor: 'gray',
        borderBottomWidth: 1
    },
    username: {
        fontFamily: 'avenir-bolder',
        fontSize: 17,
    },
    body: {
        fontFamily: 'avenir-bold',
        paddingLeft: 20,
    }
});

export default Comment;