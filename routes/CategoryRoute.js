import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList, StatusBar} from 'react-native';

import Entypo from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-community/async-storage';
import messaging from '@react-native-firebase/messaging';

import CategoryItem from '../components/CategoryItem';
import axios from 'axios';

const HOST = '192.168.0.100:40389';


const categories = [
    {
        id: 1,
        title: 'Crypto',
        desc: 'How is blockchain gonna change our lifes',
        image: require('../assets/img/Crypto.png')
    },
    {
        id: 2,
        title: 'Investing',
        desc: 'Step by step for a great future. Invest!',
        image: require('../assets/img/Investing.jpg')
    },
    {
        id: 3,
        title: 'Lifestyle',
        desc: 'Learn to save money and use them wisely',
        image: require('../assets/img/Lifestyle.jpg')
    },
    {
        id: 4,
        title: 'Stock market',
        desc: 'Take your stock portfolio to the next level',
        image: require('../assets/img/Stock.jpg')
    }
];

const CategoryRoute = ({navigation}) => {
    const [currentUser, setUser] = useState(null);
    const [userLanguage, setUserLanguage] = useState(null);

    const seePosts = (category, user, language) => {
        navigation.navigate('PostList', {'category': category, 'user': user, 'language': language});
    };

    const readSettings = async () => {
        var rawSettings = await AsyncStorage.getItem('settings');
        var Settings = JSON.parse(rawSettings);
        setUser(Settings.alias);
        setUserLanguage(Settings.lang);

        sendToken(Settings.alias, Settings.lang);
    };

    const handleNotifOpen = (user, language) => {
        messaging().getInitialNotification().then(remoteData => {
            if (!remoteData) {
                return;
            } 

            var body = remoteData['notification']['body'];
            var title = remoteData['notification']['title'][language];

            if (title == 'Check your inbox') {
                if (user.includes('admin')){
                    navigation.navigate('AdminInbox');
                } else navigation.navigate('UserInbox');
                return;
            }

            var parts = body.split(' ');

            if (parts[parts.length - 1] == 'post') {
                return;
            }

            if (parts[parts.length - 1] == 'market') {
                seePosts('Stock market', user, language);
            } else seePosts(parts[parts.length - 1], user, language);
        });
    };

    const sendToken = async (username, language) => {
        var token = await messaging().getToken();

        var rawSettings = await AsyncStorage.getItem('settings');
        var Settings = JSON.parse(rawSettings);
        
        if (Settings.token != token) {
            Settings.token = token;

            await AsyncStorage.setItem('settings', JSON.stringify(Settings));

            var result = await axios.get(`http://${HOST}/registerToken`, {
                params: {
                    'user': username,
                    'token': token
                }
            });

            console.log('Token sent!');
        }

        handleNotifOpen(username, language);
    };

    useEffect(() => {
        readSettings();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerItems}>
                    <TouchableOpacity
                        style={styles.headerIcon}
                        onPress={() => navigation.openDrawer()}
                    >
                        <Entypo name="menu" size={30} color="white" />
                    </TouchableOpacity>

                    <Text style={styles.headerText}>Categories</Text>
                </View>
            </View>

            <FlatList 
               style={styles.categoryList}
               data={categories}
               keyExtractor={(item) => String(item.id)}
               renderItem={({item}) => {
                    return (
                        <CategoryItem 
                            image={item.image} 
                            title={item.title}
                            description={item.desc}
                            pressFunc={() => seePosts(item.title, currentUser, userLanguage)}
                        />
                    );
               }}
            />

            <StatusBar translucent backgroundColor="transparent" barStyle='light-content' />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
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
    categoryList: {

    }
});

export default CategoryRoute;