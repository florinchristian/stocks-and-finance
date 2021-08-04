import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import PostImagePreview from '../components/PostImagePreview';

import axios from 'axios';

const HOST = '192.168.0.100:40389';

const Post = ({title, body, id, currentUser, showCallback}) => {
    const [images, setImages] = useState([]);
    const [noLikes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);

    const ToBool = (value) => {
        if (value >= 1) {
            return true;
        } else return false;
    };

    const getLikes = async () => {
        var result = await axios.get(`http://${HOST}/getLikes`, {
            params: {
                'id': id,
                'user': currentUser
            }
        });

        var response = result.data;

        setIsLiked(ToBool(response.isLiked));
        setLikes(response.likes);
    };

    const getImages = async () => {
        var result = await axios.get(`http://${HOST}/getPhotos`, {
            params: {
                id: id
            }
        });

        setImages(result.data);
    };

    const likePost = async () => {
        var result = await axios.get(`http://${HOST}/likePost`, {
            params: {
                'user': currentUser,
                'postId': id
            }
        });

        setIsLiked(result.data['liked']);

        var result = await axios.get(`http://${HOST}/getLikes`, {
            params: {
                'id': id,
                'user': currentUser
            }
        });

        setLikes(result.data['likes']);
    };

    useEffect(() => {
        getLikes();
        getImages();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.postBackground}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.body}>{body}</Text>

                {(images.length == 0)? null : (
                    <View style={styles.imgContainer}>
                        <FlatList 
                            horizontal
                            data={images}
                            keyExtractor={(item, index) => String(index)}
                            snapToAlignment='start'
                            decelerationRate='fast'
                            snapToInterval={323}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({item}) => {
                                return (
                                    <PostImagePreview 
                                        src={item}
                                    />
                                );
                            }}
                        />
                    </View>
                )}

                <View>
                    {(noLikes == 0)? (
                        <Text style={{
                            fontFamily: 'avenir-bold'
                        }}>
                            Be the first one that likes this post!
                        </Text>
                    ) : (
                        <Text style={{
                            fontFamily: 'avenir-bold'
                        }}>
                            {noLikes} {(noLikes > 1)? 'likes': 'like'}
                        </Text>
                    )}
                </View>

                <View
                    style={{
                        borderWidth: 1,
                        width: '100%',
                        borderColor: '#C0C0C0',
                        marginVertical: 5
                    }}
                >

                </View>

                <View style={styles.controlsContainer}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={likePost} style={{flexDirection: 'row',}}>
                            <AntDesign 
                                style={styles.buttonIcon} 
                                name={isLiked? "like1" : "like2"} 
                                size={24} 
                                color={isLiked? "#a15ea1" : "black"} 
                            />
                            <Text 
                                style={[styles.buttonText, {marginTop: 5,
                                color: (isLiked? "#a15ea1" : "black")}]}
                            >
                                Like
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity 
                            style={{flexDirection: 'row'}}
                            onPress={() => showCallback(id)}
                        >
                            <FontAwesome5 
                                style={styles.buttonIcon} 
                                name="comment" size={24} 
                                color="black" 
                            />
                            <Text 
                                style={styles.buttonText}
                            >
                                Comment
                            </Text>
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
        paddingVertical: 20,
        paddingHorizontal: 25
    },
    postBackground: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,

        elevation: 10,
    },
    title: {
        fontSize: 20,
        fontFamily: 'avenir-bold'
    },
    body: {
        fontSize: 17,
        fontFamily: 'avenir',
        marginTop: 5
    },
    controlsContainer: {
        width: '100%',
        height: 30,
        flexDirection: 'row'
    },
    buttonContainer: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonIcon: {
        marginRight: 10
    },
    buttonText: {
        fontFamily: 'avenir',
        fontSize: 17
    },
    imgContainer: {
        width: '100%',
        height: 323,
        borderRadius: 10,
        overflow: 'hidden',
        marginVertical: 7
    }
});

export default Post;