import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    FlatList,
    Image,
    StatusBar
} from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import axios from 'axios';
import CommentBottom from '../components/CommentBottom';

const HOST = '192.168.0.100:40389';

const TitleElement = ({ value }) => {
    return (
        <View>
            <View style={titleStyle.container}>
                <Text style={titleStyle.text}>{value}</Text>
            </View>
        </View>
    );
};

const titleStyle = StyleSheet.create({
    container: {
        width: '100%',
        height: 70,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        fontFamily: 'avenir-bolder',
        fontSize: 25,
        textAlign: 'center'
    }
});

const SubtitleElement = ({ value }) => {
    return (
        <View>
            <View style={{
                paddingVertical: 5,
                paddingLeft: 20
            }}>
                <Text style={{
                    fontFamily: 'avenir-bolder',
                    fontSize: 17
                }}>{value}</Text>
            </View>
        </View>
    );
};

const Paragraph = ({ value }) => {
    return (
        <View>
            <View style={{
                width: '100%',
                paddingHorizontal: 20
            }}>
                <Text style={{
                    fontFamily: 'avenir',
                    fontSize: 17
                }}>{value}</Text>
            </View>
        </View>
    );
};

const ImageElement = ({ url }) => {
    console.log(url);

    return (
        <View style={{
            width: 200,
            height: 200,
            marginLeft: 10
        }}>
            <View>
                <Image
                    source={{ uri: url }}
                    style={{
                        width: '100%',
                        height: '100%'
                    }}
                />
            </View>
        </View>
    );
};

const ImageSlideshow = ({ images, sourceType, description }) => {
    return (
        <View style={{
            paddingHorizontal: 20,
            paddingVertical: 10
        }}>
            {(images.length == 1) ? (
                <View style={{
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <ImageElement
                        url={images[0]}
                    />
                </View>
            ) : (
                <FlatList
                    horizontal
                    data={images}
                    keyExtractor={(item, index) => String(index)}
                    renderItem={({ item }) => {
                        return (
                            <ImageElement
                                url={item}
                            />
                        );
                    }}
                />
            )}

            <Text style={{
                textAlign: 'center',
                fontStyle: 'italic',
                marginTop: 5
            }}>{description}</Text>
        </View>
    );
};

const BulletList = ({ title, sentences }) => {
    return (
        <View>
            <View style={{
                paddingHorizontal: 20
            }}>
                <Text style={{
                    fontFamily: 'avenir-bolder',
                    fontSize: 17
                }}>{title}</Text>
                <FlatList
                    scrollEnabled={false}
                    data={sentences}
                    keyExtractor={(item, index) => String(index)}
                    renderItem={({ item }) => {
                        return (
                            <Text style={{
                                fontSize: 18,
                                fontFamily: 'avenir',
                                paddingLeft: 20,
                                paddingVertical: 5
                            }}>• {item}</Text>
                        );
                    }}
                />
            </View>
        </View>
    );
};

const ArticleViewRoute = ({ navigation }) => {
    const [article, setArticle] = useState(null);
    const [noLikes, setLikes] = useState(null);
    const [userLiked, setUserLiked] = useState(null);

    const [comments, setComments] = useState([]);
    const [commentVisible, setCommentVisible] = useState(false);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [commentExtraType, setCommentExtra] = useState('btn');
    const [commentIndex, setCommentIndex] = useState(-1);

    const id = navigation.getParam('id', null);
    const title = navigation.getParam('title', null);
    const user = navigation.getParam('currentUser', null);
    const language = navigation.getParam('language', 'en');

    const ToBool = (value) => {
        if (value == 0) return false;
        else return true;
    };

    const getLikes = async () => {
        var result = await axios.get(`http://${HOST}/getLikes`, {
            params: {
                'id': id,
                'user': user
            }
        });

        setLikes(result.data['likes']);
        setUserLiked(ToBool(result.data['isLiked']));

        console.log(result.data);
    };

    const loadArticle = async () => {
        var result = await axios.get(`http://${HOST}/getArticle`, {
            params: {
                'id': id
            }
        });

        var rawData = result.data[language];

        for (let i in rawData) {
            let obj = rawData[i];

            if (obj.type == 'imageSlideshow') {
                var imgInfo = obj.images;

                var images = await axios.get(`http://${HOST}/getSlideshowImages`, {
                    params: {
                        id: imgInfo.id,
                        index: imgInfo.index
                    }
                });

                obj.images = images.data;
                rawData[i] = obj;
            }
        }

        setArticle(rawData);
    };

    const handleRender = ({ item }) => {
        switch (item.type) {
            case 'title':
                return (<TitleElement
                    value={item.body}
                />);
            case 'paragraph':
                return (
                    <Paragraph
                        value={item.body}
                    />
                );
            case 'subtitle':
                return (
                    <SubtitleElement
                        value={item.body}
                    />
                );
            case 'imageSlideshow':
                return (
                    <ImageSlideshow
                        description={item.description}
                        images={item.images}
                        type={item.sourceType}
                    />
                );
            case 'bulletList':
                return (
                    <BulletList
                        title={item.title}
                        sentences={item.sentences}
                    />
                );
        }
    };

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

    const likePost = async () => {
        var result = await axios.get(`http://${HOST}/likePost`, {
            params: {
                'user': user,
                'postId': id
            }
        });

        getLikes();
    };

    useEffect(() => {
        loadArticle();
        getLikes();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerItems}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginHorizontal: 10 }}>
                        <AntDesign name="arrowleft" size={30} color="white" />
                    </TouchableOpacity>

                    <Text style={styles.headerText}>{title}</Text>
                </View>
            </View>

            <ScrollView style={{
                flex: 1
            }}>
                <FlatList
                    data={article}
                    keyExtractor={(item, index) => String(index)}
                    renderItem={handleRender}
                />

                <View style={{
                    width: '100%',
                    paddingHorizontal: 20
                }}>
                    {(noLikes == 0) ? (
                        <Text style={{
                            fontFamily: 'avenir-bold'
                        }}>
                            Be the first one that likes this post!
                        </Text>
                    ) : (
                        <Text style={{
                            fontFamily: 'avenir-bold'
                        }}>
                            {noLikes} {(noLikes > 1) ? 'likes' : 'like'}
                        </Text>
                    )}

                    <View style={{
                        width: '100%',
                        height: 50,
                        borderTopColor: 'gray',
                        borderTopWidth: 1.2,
                        borderBottomColor: 'gray',
                        borderBottomWidth: 1.2,
                        flexDirection: 'row',
                        borderRadius: 5
                    }}>
                        <View style={styles.controlContainer}>
                            <TouchableOpacity onPress={likePost} style={styles.button}>
                                <AntDesign
                                    style={styles.buttonIcon}
                                    name={userLiked ? "like1" : "like2"}
                                    size={24}
                                    color={userLiked ? "#a15ea1" : "black"}
                                />
                                <Text
                                    style={[styles.buttonText, {
                                        marginTop: 5,
                                        color: (userLiked ? "#a15ea1" : "black")
                                    }]}
                                >
                                    Like
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.controlContainer}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => {
                                    setCommentVisible(true);
                                    loadComments('init', id, commentIndex)
                                }}
                            >
                                <FontAwesome5
                                    style={styles.buttonIcon}
                                    name="comment" size={24}
                                    color="black"
                                />
                                <Text style={styles.buttonText}>Comment</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <CommentBottom
                visibility={commentVisible}
                currentId={id}
                currentIndex={commentIndex}
                refreshComments={loadComments}
                data={comments}
                extraType={commentExtraType}
                loading={commentsLoading}
                username={user}
                closeCallback={() => {
                    setCommentVisible(false);
                    setComments([]);
                    setCommentIndex(-1);
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
        backgroundColor: '#a15ea1'
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
        fontSize: 23,
        flex: 1
    },
    controlContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        flexDirection: 'row'
    },
    buttonIcon: {
        marginHorizontal: 10
    },
    buttonText: {
        alignSelf: 'center',
        fontFamily: 'avenir-bold',
        fontSize: 17
    }
});

export default ArticleViewRoute;