import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AdminQuestion = ({username, body, id, showPrompt}) => {
    return (
        <View style={styles.container}>
            <View style={{
                flex: 1,
                backgroundColor: 'white',
                padding: 10,
                borderRadius: 10,
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 6,
                },
                shadowOpacity: 0.37,
                shadowRadius: 7.49,
                
                elevation: 12
            }}>
                <Text style={styles.username}>@{username}</Text>
                <Text style={styles.body}>{body}</Text>

                <View style={{
                    borderTopWidth: 2,
                    width: '100%',
                    borderColor: '#C0C0C0',
                    borderRadius: 10
                }}></View>

                <View style={styles.buttonContainer}>
                    <View style={styles.buttonBackground}>
                        <TouchableOpacity
                            onPress={() => {
                                showPrompt(id)
                            }}
                            style={styles.button}
                        >
                            <MaterialCommunityIcons
                                style={{marginHorizontal: 5}}
                                name="comment-question-outline" 
                                size={24} color="black" />
                            
                            <Text style={{
                                fontSize: 16,
                                color: 'black',
                                fontFamily: 'avenir-bolder'
                            }}>Answer</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.buttonBackground}>
                        <TouchableOpacity style={styles.button}>
                            <Ionicons style={{marginHorizontal: 5}} name="trash-outline" size={24} color="#ff4d4d" />
                            
                            <Text style={{
                                fontSize: 16,
                                color: '#ff4d4d',
                                fontFamily: 'avenir-bolder'
                            }}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 30,
        paddingVertical: 20
    },
    username: {
        fontSize: 20,
        fontFamily: 'avenir-bolder'
    },
    body: {
        fontSize: 15,
        fontFamily: 'avenir',
        paddingBottom: 5
    },
    buttonContainer: {
        width: '100%',
        height: 30,
        flexDirection: 'row'
    },
    buttonBackground: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5
    }
});

export default AdminQuestion;