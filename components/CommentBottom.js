import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    FlatList,
    ScrollView
} from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';

import Comment from '../components/Comment';
import CommentInput from '../components/CommentInput';
import axios from 'axios';

const HOST = '192.168.0.100:40389';

const testComments = [
    {
        id: 1,
        username: 'catlover21',
        body: 'im dying <3'
    },
    {
        id: 2,
        username: 'whyareugae',
        body: 'CAT ABUSE! GO VEGAN'
    }
];

const CommentBottom = ({
    visibility,
    closeCallback,
    currentId,
    username,
    loading,
    data,
    commentIndex,
    refreshComments,
    extraType
}) => {
    const [currentMsg, setCurrentMsg] = useState('');

    const handleText = (newText) => {
        setCurrentMsg(newText);
    };

    const sendComment = async () => {
        var result = await axios.get(`http://${HOST}/sendComment`, {
            params: {
                postId: currentId,
                'username': username,
                'msg': currentMsg
            }
        });

        setCurrentMsg('');

        closeCallback();
    };

    return (
        <Modal
            transparent
            animationType='slide'
            visible={visibility}
        >
            <View style={styles.container}>
                <View style={styles.modalBody}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => {
                            setCurrentMsg('');
                            closeCallback();
                        }} style={styles.closeIcon}>
                            <AntDesign name="arrowleft" size={30} color="#a15ea1" />
                        </TouchableOpacity>

                        <Text style={styles.modalTitle}>Comments</Text>
                    </View>

                    {loading ? (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size='large' color='#a15ea1' />
                        </View>
                    ) : (
                        <View style={styles.commentsContainer}>
                            <ScrollView style={{ flex: 1 }}>
                                <FlatList
                                    scrollEnabled={false}
                                    style={{ flex: 1 }}
                                    showsVerticalScrollIndicator={false}
                                    data={data}
                                    keyExtractor={(item) => String(item.id)}
                                    renderItem={({ item }) => {
                                        return (
                                            <Comment
                                                username={item.username}
                                                body={item.body}
                                            />
                                        );
                                    }}
                                />

                                {(data.length && extraType != 'none') ? (
                                    <View style={{
                                        width: '100%',
                                        height: 60,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        {(extraType == 'btn') ? (
                                            <TouchableOpacity
                                                onPress={() => {
                                                    refreshComments('extra', currentId, commentIndex);
                                                }}
                                            >
                                                <Text style={{
                                                    fontFamily: 'avenir-bolder',
                                                    fontSize: 19,
                                                    color: '#a15ea1'
                                                }}>Load more comments</Text>
                                            </TouchableOpacity>
                                        ) : null}

                                        {(extraType == 'loading') ? (
                                            <ActivityIndicator
                                                size='large'
                                                color='#a15ea1'
                                            />
                                        ) : null}
                                    </View>
                                ) : null}
                            </ScrollView>

                            <CommentInput
                                value={currentMsg}
                                onChange={handleText}
                                sendFunc={sendComment}
                            />
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalBody: {
        width: '100%',
        height: '80%',
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 0,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    modalHeader: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalTitle: {
        fontFamily: 'avenir-bolder',
        fontSize: 20
    },
    closeIcon: {
        position: 'absolute',
        left: 20
    },
    commentsContainer: {
        flex: 1
    }
});

export default CommentBottom;