import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    FlatList,
    StatusBar
} from 'react-native';

import Entypo from 'react-native-vector-icons/Entypo';

import AdminQuestion from '../components/AdminQuestion';
import AnswerPrompt from '../components/AnswerPrompt';

import axios from 'axios';

const HOST = '192.168.0.100:40389';

const Inbox = ({questions, showPrompt}) => {
    if (questions.length == 0) {
        return (
            <View style={{
                alignItems: 'center'
            }}>
                <Text style={{
                    marginTop: 20,
                    fontSize: 17,
                    fontFamily: 'avenir-bold'
                }}>Your inbox is empty!</Text>
            </View>
        );
    } else {
        return (
            <FlatList 
                style={{flex: 1}}
                data={questions}
                keyExtractor={(item) => String(item.id)}
                renderItem={({item}) => {
                    return (
                        <AdminQuestion 
                            body={item.body}
                            username={item.username}
                            id={item.id}
                            showPrompt={showPrompt}
                        />
                    );
                }}
            />
        );
    }
};

const AdminInbox = ({navigation}) => {
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState(false);
    const [visible, setVisible] = useState(false);

    const [currentId, setCurrentId] = useState(null);

    const updateDrawer = navigation.getParam('updateDrawer', () => {});

    const removeQuestion = (id) => {
        var sorted = questions.filter((obj) => {
            return obj.id != id;
        });

        setQuestions(sorted);
    };

    const showPrompt = (id) => {
        setCurrentId(id);
        setVisible(true);
    };

    const getQuestions = async () => {
        var result = await axios.get(`http://${HOST}/getAdminQuestions`);

        setQuestions(result.data['questions']);

        setLoading(false);
    };

    useEffect(() => {
        getQuestions();
    }, []);

    return (
        <View style={styles.container}>
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

                    <Text style={styles.headerText}>Admin Inbox</Text>
                </View>
            </View>

            <AnswerPrompt 
                visibility={visible}
                closeFunc={() => {setVisible(false);}}
                id={currentId}
                removeFunc={removeQuestion}
                updateFunc={updateDrawer}
            />

            {loading? (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator 
                        size='large'
                        color='#a15ea1'
                    />
                </View>
            ) : (<Inbox showPrompt={showPrompt} questions={questions} />)}

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
    }
});

export default AdminInbox;