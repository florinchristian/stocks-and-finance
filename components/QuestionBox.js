import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const QuestionBox = ({body, response}) => {
    return (
        <View style={{
            width: '100%', 
            minHeight: 70, 
            paddingHorizontal: 20, 
            paddingVertical: 20,
            justifyContent: 'center'
        }}>
            <View style={styles.container}>
                <Text style={styles.body}>{body}</Text>
                {response? (
                    <View style={{
                        paddingLeft: 10
                    }}>
                        <Text style={{
                            fontSize: 18,
                            fontFamily: 'avenir-bolder'
                        }}>Answer: </Text>
                        <Text style={{
                            fontSize: 18,
                            fontStyle: 'italic'
                        }}>"{response}"</Text>
                    </View>
                ) : (null)}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: 'white',
        padding: 10,
        paddingVertical: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.37,
        shadowRadius: 7.49,
        
        elevation: 12,
    },
    body: {
        fontSize: 20,
        fontFamily: 'avenir'
    }
});

export default QuestionBox;