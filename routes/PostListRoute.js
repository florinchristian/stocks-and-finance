import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    Image,
    StatusBar,
    ScrollView
} from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';

import Post from '../components/Post';
import CommentBottom from '../components/CommentBottom';

import axios from 'axios';

const HOST = '192.168.0.100:40389';

const ArticlePreview = ({ id, title, pressCallback }) => {
    return (
        <View style={{
            width: '100%',
            height: 120,
            paddingVertical: 20,
            paddingHorizontal: 25
        }}>
            <TouchableOpacity onPress={() => pressCallback(id, title)} activeOpacity={0.8} style={{
                flex: 1,
                flexDirection: 'row',
                backgroundColor: 'white',
                alignItems: 'center',
                paddingHorizontal: 20,
                borderRadius: 10,
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 5,
                },
                shadowOpacity: 0.34,
                shadowRadius: 6.27,

                elevation: 10
            }}>
                <Image
                    style={{
                        width: 50,
                        height: 50,
                        marginRight: 20,
                        borderRadius: 5
                    }}
                    source={{ uri: `http://${HOST}/getArticleThumbnail?id=${id}` }}
                />
                <Text style={{
                    fontFamily: 'avenir-bolder',
                    fontSize: 17,
                    flex: 1
                }}>{title}</Text>

                <AntDesign name="right" size={24} color="gray" />
            </TouchableOpacity>
        </View>
    );
};

const PostList = ({ language, posts, user, navig, showCallback, commentReceiver, articleCallback, getMorePosts, addType }) => {
    // const detectEnd = ({ layoutMeasurement, contentOffset, contentSize }) => {
    //     return (layoutMeasurement.height + contentOffset.y >=
    //         contentSize.height);
    // }

    console.log(posts);

    if (posts.length == 0) {
        return (
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 50
                }}
            >
                <Text style={styles.noPosts}>There are no posts!</Text>
            </View>
        );
    } else {
        return (
            <ScrollView
                style={{ flex: 1 }}
            >
                <FlatList
                    scrollEnabled={false}
                    data={posts}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => {
                        if (item.post_type == 'article') {
                            return (
                                <ArticlePreview
                                    id={item.imgfolder}
                                    title={item.title[language]}
                                    pressCallback={articleCallback}
                                />
                            );
                        }

                        return (
                            <Post
                                showCallback={showCallback}
                                navigation={navig}
                                currentUser={user}
                                title={item.title[language]}
                                body={item.body[language]}
                                id={item.imgfolder}
                                commentReceiveFunc={commentReceiver}
                            />
                        );
                    }}
                />

                <View style={{
                    width: '100%',
                    height: 60,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    {(addType == 'btn') ? (
                        <TouchableOpacity
                            onPress={() => {
                                getMorePosts();
                            }}
                        >
                            <Text style={{
                                fontFamily: 'avenir-bolder',
                                fontSize: 19,
                                color: '#a15ea1'
                            }}>Load more posts</Text>
                        </TouchableOpacity>
                    ) : null}

                    {(addType == 'loading') ? (
                        <ActivityIndicator
                            size='large'
                            color='#a15ea1'
                        />
                    ) : null}

                    {(addType == 'no-content') ? (
                        <Text style={{
                            fontFamily: 'avenir-bolder',
                            fontSize: 19,
                            color: 'black'
                        }}>There are no posts left!</Text>
                    ) : null}
                </View>
            </ScrollView>
        );
    }
};

const PostListRoute = ({ navigation }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentId, setCurrentId] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const [commentsLoading, setCommentsLoading] = useState(true);

    const [comments, setComments] = useState([]);
    const [commentExtraType, setCommentExtra] = useState('btn');
    const [commentIndex, setCommentIndex] = useState(-1);

    const [postIndex, setPostIndex] = useState(-1);
    const [addType, setAddType] = useState('btn');

    const category = navigation.getParam('category', 'default');
    const currentUser = navigation.getParam('user', 'default');
    const language = navigation.getParam('language', 'en');

    const loadComments = async (type, id, index) => {
        if (type == 'init') setCommentsLoading(true);
        else setCommentExtra('loading');

        var result = await axios.get(`http://${HOST}/getComments`, {
            params: {
                postId: id,
                'index': index
            }
        });

        if (result.data.length == 0) {
            if (type == 'init') setCommentsLoading(false);
            else setCommentExtra('none');

            return;
        }

        var old = comments;
        var j = null;

        for (var i in result.data['comments']) {
            var item = result.data['comments'][i];
            old = [...old, item];
            j = item['id'];
        }

        setCommentIndex(j);
        setComments(old);

        if (type == 'init') setCommentsLoading(false);
        else setCommentExtra('btn');
    };

    const loadPosts = async () => {
        setAddType('loading');

        var result = await axios.get(`http://${HOST}/getPosts`, {
            params: {
                'category': category,
                'index': postIndex
            }
        });

        var oldIndex = postIndex;

        if (result.data.length == 0 && posts.length == 0) {
            setPosts([]);
        } else {
            var old = posts;

            for (var i in result.data) {
                //old = [...old, result.data[i]];
                var item = result.data[i];
                item['title'] = JSON.parse(item['title']);
                if (item['body']) item['body'] = JSON.parse(item['body']);
                old = [...old, item];
            }

            setPostIndex(old[old.length - 1]['id']);
            console.log('Last index', old[old.length - 1]['id']);

            setPosts(old);
        }

        setLoading(false);

        if (old[old.length - 1]['id'] == oldIndex) {
            setAddType('no-content');
        } else {
            setAddType('btn');
        }
    };

    const showModal = (id) => {
        setModalVisible(true);
        setCurrentId(id);
        setCommentIndex(-1);
        loadComments('init', id, commentIndex);
    };

    const loadArticle = (id, title) => {
        navigation.navigate('ViewArticle', {
            'id': id,
            'title': title,
            'currentUser': currentUser,
            'language': language
        });
    };

    useEffect(() => {
        loadPosts();
    }, [currentUser]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerItems}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginHorizontal: 10 }}>
                        <AntDesign name="arrowleft" size={30} color="white" />
                    </TouchableOpacity>

                    <Text style={styles.headerText}>{category}</Text>
                </View>
            </View>

            <CommentBottom
                visibility={modalVisible}
                closeCallback={() => {
                    setModalVisible(false);
                    setComments([]);
                    setCommentIndex(-1);
                }}
                extraType={commentExtraType}
                currentId={currentId}
                commentIndex={commentIndex}
                refreshComments={loadComments}
                loading={commentsLoading}
                data={comments}
                username={currentUser}
            />

            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator
                        size='large'
                        color='#a15ea1'
                    />
                </View>
            ) : (
                <PostList
                    showCallback={showModal}
                    posts={posts}
                    language={language}
                    user={currentUser}
                    navig={navigation}
                    getMorePosts={loadPosts}
                    addType={addType}
                    commentReceiver={loadComments}
                    articleCallback={loadArticle}
                />
            )}

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
        shadowOffset:{
        width: 0,
        height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 24
    },
    headerItems: {
        width: '100%',
        height: 55,
        position: 'absolute',
        bottom: 0,
        alignItems: 'center',
        flexDirection: 'row'
    },
    headerText: {
        fontFamily: 'avenir-bold',
        color: 'white',
        fontSize: 23
    },
    noPosts: {
        fontFamily: 'avenir-bold',
        fontSize: 17
    }
});

export default PostListRoute;