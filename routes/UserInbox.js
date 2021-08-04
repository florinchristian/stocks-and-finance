import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    FlatList,
    StatusBar
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import Entypo from 'react-native-vector-icons/Entypo';

import QuestionBox from '../components/QuestionBox';

import axios from 'axios';

const HOST = '192.168.0.100:40389';

const Inbox = ({ pending, answered }) => {
    if (pending.length + answered.length == 0) {
        return (
            <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{
                    marginTop: 20,
                    fontSize: 17,
                    fontFamily: 'avenir-bold'
                }}>Your inbox is empty!</Text>
            </View>
        );
    } else {
        return (
            <ScrollView style={{ flex: 1 }}>
                {(pending.length == 0) ? (null) : (
                    <View>
                        <View style={styles.titleContainer}>
                            <Text style={styles.boxTitle}>Pending</Text>
                        </View>

                        <FlatList
                            scrollEnabled={false}
                            data={pending}
                            keyExtractor={(item) => String(item.id)}
                            renderItem={({ item }) => {
                                return (
                                    <QuestionBox
                                        body={item.body}
                                    />
                                );
                            }}
                        />
                    </View>
                )}

                {(answered.length == 0) ? (null) : (
                    <View>
                        <View style={styles.titleContainer}>
                            <Text style={styles.boxTitle}>Answered</Text>
                        </View>

                        <FlatList
                            scrollEnabled={false}
                            data={answered}
                            keyExtractor={(item) => String(item.id)}
                            renderItem={({ item }) => {
                                return (
                                    <QuestionBox
                                        body={item.body}
                                        response={item.response}
                                    />
                                );
                            }}
                        />
                    </View>
                )}
            </ScrollView>
        );
    }
};

const UserInbox = ({ navigation }) => {
    const [answered, setAnswered] = useState([]);
    const [pending, setPending] = useState([]);

    const [username, setUsername] = useState(null);

    const [loading, setLoading] = useState(false);

    const loadQuestions = async (_username) => {
        var result = await axios.get(`http://${HOST}/getUserQuestions`, {
            params: {
                'username': _username
            }
        });

        setAnswered(result.data['answered']);
        setPending(result.data['pending']);

        setLoading(false);
    };

    const readSettings = async () => {
        setLoading(true);

        var raw_settings = await AsyncStorage.getItem('settings');

        var Settings = JSON.parse(raw_settings);
        setUsername(Settings.alias);

        loadQuestions(Settings.alias);
    };

    useEffect(() => {
        readSettings();
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                <View style={styles.headerItems}>
                    <TouchableOpacity
                        style={styles.headerIcon}
                        onPress={() => {
                            navigation.openDrawer();
                        }}
                    >
                        <Entypo name="menu" size={30} color="white" />
                    </TouchableOpacity>

                    <Text style={styles.headerText}>Your inbox</Text>
                </View>
            </View>

            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size='large' color='#a15ea1' />
                </View>
            ) : (<Inbox answered={answered} pending={pending} />)}

            <StatusBar translucent backgroundColor="transparent" barStyle='light-content' />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: 80,
        backgroundColor: '#a15ea1',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,

        elevation: 16,
    },
    headerItems: {
        width: '100%',
        height: 55,
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerText: {
        fontFamily: 'avenir-bold',
        color: 'white',
        fontSize: 23
    },
    headerIcon: {
        marginHorizontal: 10
    },
    boxTitle: {
        fontSize: 25,
        fontFamily: 'avenir-bolder',
        color: '#a15ea1'
    },
    titleContainer: {
        marginTop: 10,
        paddingHorizontal: 20
    }
});

export default UserInbox;