import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, DevSettings } from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import axios from 'axios';

const HOST = '192.168.0.100:40389';

const CountBubble = ({ radius, value }) => {
    return (
        <View style={{
            height: radius,
            borderRadius: radius / 2,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#ff3333',
            marginHorizontal: 10
        }}>
            <Text style={{
                color: 'white',
                fontFamily: 'avenir',
                marginHorizontal: 10,
                marginTop: 2
            }}>{value}</Text>
        </View>
    );
};

const DrawerMenu = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [adminUnanswered, setAdminUnanswered] = useState(null);

    const readUserInfo = async () => {
        var raw = await AsyncStorage.getItem('settings');
        var settings = JSON.parse(raw);

        console.log(settings);

        setUsername(settings.alias);
        setEmail(settings.email);

        console.log('Drawer user settings have been read successfully');
    };

    const getAdminInboxCount = async () => {
        var result = await axios.get(`http://${HOST}/unansweredCount`);
        //console.log(result.data[0]['UnansweredCount']);
        setAdminUnanswered(result.data[0]['UnansweredCount']);
    };

    const writeSettings = async () => {
        await AsyncStorage.setItem('settings',
            JSON.stringify({
                'alias': null,
                'email': null,
                'key': null
            }));

        console.log('User settings have been written successfully');

        DevSettings.reload();
        //throw 1;
    };

    useEffect(() => {
        readUserInfo();
        getAdminInboxCount();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerEmail}>{email}</Text>
                <Text style={styles.headerUsername}>@{username}</Text>
            </View>

            {(username.includes('admin')) ? (
                <View style={styles.menuSectionContainer}>
                    <Text style={styles.menuSectionTitle}>Admin</Text>

                    <TouchableOpacity onPress={() => navigation.navigate('CreatePost')} style={[styles.menuSectionEntry, styles.menuSectionFirstEntry]}>
                        <View style={styles.menuEntryIcon}>
                            <FontAwesome name="plus" size={24} color="#704270" />
                        </View>

                        <Text style={styles.menuEntryText}>Create post</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        navigation.navigate('CreateArticle', {screen: 'EnglishStep'});
                    }} style={[styles.menuSectionEntry]}>
                        <View style={styles.menuEntryIcon}>
                            <MaterialIcons name="article" size={24} color="#704270" />
                        </View>

                        <Text style={styles.menuEntryText}>Create article</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('AdminInbox', {updateDrawer: getAdminInboxCount})} style={[styles.menuSectionEntry, styles.menuSectionLastEntry]}>
                        <View style={styles.menuEntryIcon}>
                            <FontAwesome5 name="inbox" size={21} color="#704270" />
                        </View>

                        <Text style={styles.menuEntryText}>Inbox</Text>

                        {adminUnanswered ? (
                            <CountBubble
                                radius={25}
                                value={adminUnanswered}
                            />
                        ) : null}
                    </TouchableOpacity>
                </View>
            ) : null}

            <View style={styles.menuSectionContainer}>
                <Text style={styles.menuSectionTitle}>Stocks & Finance</Text>

                <TouchableOpacity onPress={() => navigation.navigate('CategoryList')} style={[styles.menuSectionEntry, styles.menuSectionFirstEntry]}>
                    <View style={styles.menuEntryIcon}>
                        <FontAwesome5 name="home" size={24} color="#704270" />
                    </View>

                    <Text style={styles.menuEntryText}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('UserInbox')} style={[styles.menuSectionEntry]}>
                    <View style={styles.menuEntryIcon}>
                        <FontAwesome5 name="inbox" size={21} color="#704270" />
                    </View>

                    <Text style={styles.menuEntryText}>Inbox</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Settings', {updateDrawer: readUserInfo})} style={[styles.menuSectionEntry]}>
                    <View style={styles.menuEntryIcon}>
                        <MaterialIcons name="settings" size={24} color="#704270" />
                    </View>

                    <Text style={styles.menuEntryText}>Settings</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('ContactUs')} style={[styles.menuSectionEntry, styles.menuSectionLastEntry]}>
                    <View style={styles.menuEntryIcon}>
                        <MaterialCommunityIcons name="message" size={24} color="#704270" />
                    </View>

                    <Text style={styles.menuEntryText}>Contact us</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.signOutContainer}>
                <TouchableOpacity onPress={writeSettings} style={styles.signOutBackground}>
                    <Text style={styles.signOutText}>Sign out</Text>
                    <Ionicons style={styles.signOutIcon} name="ios-exit-outline" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        width: '100%',
        height: 130,
        backgroundColor: '#a15ea1',
        flexDirection: 'column-reverse',
        paddingHorizontal: 20,
        paddingVertical: 15
    },
    headerUsername: {
        color: 'white',
        fontFamily: 'avenir-bolder',
        fontSize: 25,
        marginBottom: 5
    },
    headerEmail: {
        color: 'white',
        fontFamily: 'avenir',
        fontSize: 17
    },
    signOutContainer: {
        width: '100%',
        height: 50,
        paddingHorizontal: 20,
        position: 'absolute',
        bottom: 10
    },
    signOutBackground: {
        flex: 1,
        backgroundColor: '#ff6666',
        borderRadius: 10,
        alignItems: 'center',
        paddingHorizontal: 20,
        flexDirection: 'row'
    },
    signOutText: {
        color: 'white',
        fontFamily: 'avenir',
        fontSize: 20
    },
    signOutIcon: {
        position: 'absolute',
        right: 20
    },
    menuSectionContainer: {
        width: '100%',
        padding: 20
    },
    menuSectionTitle: {
        fontSize: 22,
        fontFamily: 'avenir-bolder',
        color: '#a15ea1'
    },
    menuSectionEntry: {
        width: '100%',
        height: 50,
        backgroundColor: '#d9bfd9',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: 'white',
    },
    menuSectionFirstEntry: {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    menuSectionLastEntry: {
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    },
    menuEntryText: {
        color: '#704270',
        fontFamily: 'avenir-bold',
        fontSize: 17
    },
    menuEntryIcon: {
        width: '17%',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default DrawerMenu;