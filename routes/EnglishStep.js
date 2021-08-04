import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Text,
    FlatList,
    Image,
    StatusBar
} from 'react-native';

import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';

import NewElementPrompt from '../components/NewElementPrompt';
import ControlElementPrompt from '../components/ControlElementPrompt';

import AsyncStorage from '@react-native-community/async-storage';

const TitleElement = ({ value, controlFunc }) => {
    return (
        <TouchableWithoutFeedback onLongPress={controlFunc}>
            <View style={titleStyle.container}>
                <Text style={titleStyle.text}>{value}</Text>
            </View>
        </TouchableWithoutFeedback>
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

const SubtitleElement = ({ value, controlFunc }) => {
    return (
        <TouchableWithoutFeedback onLongPress={controlFunc}>
            <View style={{
                paddingVertical: 5,
                paddingLeft: 20
            }}>
                <Text style={{
                    fontFamily: 'avenir-bolder',
                    fontSize: 17
                }}>{value}</Text>
            </View>
        </TouchableWithoutFeedback>
    );
};

const Paragraph = ({ value, controlFunc }) => {
    return (
        <TouchableWithoutFeedback onLongPress={controlFunc}>
            <View style={{
                width: '100%',
                paddingHorizontal: 20
            }}>
                <Text style={{
                    fontFamily: 'avenir',
                    fontSize: 17
                }}>{value}</Text>
            </View>
        </TouchableWithoutFeedback>
    );
};

const ImageElement = ({ type, url, controlFunc }) => {
    return (
        <View style={{
            width: 200,
            height: 200,
            marginLeft: 10
        }}>
            <TouchableWithoutFeedback onLongPress={controlFunc}>
                <Image
                    source={{ uri: url }}
                    style={{
                        width: '100%',
                        height: '100%'
                    }}
                />
            </TouchableWithoutFeedback>
        </View>
    );
};

const ImageSlideshow = ({ images, sourceType, description, controlFunc }) => {
    return (
        <View style={{
            paddingHorizontal: 20,
            paddingVertical: 10
        }}>
            <FlatList
                horizontal
                data={images}
                keyExtractor={(item, index) => String(index)}
                renderItem={({ item }) => {
                    if (item.type == 'default') {
                        return null;
                    }

                    return (
                        <ImageElement
                            type={sourceType}
                            url={item.url}
                            controlFunc={controlFunc}
                        />
                    );
                }}
            />

            <Text style={{
                textAlign: 'center',
                fontStyle: 'italic',
                marginTop: 5
            }}>{description}</Text>
        </View>
    );
};

const BulletList = ({ title, sentences, controlFunc }) => {
    return (
        <TouchableWithoutFeedback onLongPress={controlFunc}>
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
        </TouchableWithoutFeedback>
    );
};

const testElements = [
    {
        type: 'title',
        body: 'Thats a fresh article!'
    },
    {
        type: 'paragraph',
        body: 'I would like to begin this article by saying I am very thankful!'
    },
    {
        type: 'subtitle',
        body: 'Why did I decide to make an app?'
    },
    {
        type: 'paragraph',
        body: 'I always say that if you want a thing made the right way, you have to do it by yourself!'
    },
    {
        type: 'imageSlideshow',
        sourceType: 'test',
        description: 'As you can see, those photos are very relevant to the subject!',
        images: [
            require('../assets/img/shrek.jpeg'),
            require('../assets/img/sam.jpeg'),
            require('../assets/img/mcqueen.jpeg'),
            require('../assets/img/lgbt_fire.jpeg')
        ]
    },
    {
        type: 'bulletList',
        title: 'Advantages of being a programmer:',
        sentences: [
            'You fuck anything you want any time you want',
            'You are smart as fuck',
            'You cry everyday',
            'Joe Mama'
        ]
    }
];

const HOST = '192.168.0.100:40389';

const CreateArticle = ({ navigation }) => {
    const [currentElements, setElements] = useState([

    ]);

    const [promptVisible, setPromptVisible] = useState(false);
    const [controlVisible, setControlVisible] = useState(false);
    //const [thumbVisible, setThumbVisible] = useState(false);
    const [elementInfo, setElementInfo] = useState({});

    const lang = navigation.getParam('lang', null);

    const deleteElement = (id) => {
        var current = currentElements;

        for (var i in currentElements) {
            var obj = currentElements[i];
            if (obj.id == id) {
                delete current[i];
                setElements(current.filter(item => item != undefined));
                setControlVisible(false);
                return;
            }
        }
    };

    const appendElement = (newElement) => {
        setElements([...currentElements, newElement]);
    };

    const saveElement = (newElement) => {
        var current = currentElements;

        for (var i in currentElements) {
            var elem = currentElements[i];

            if (elem.id == newElement.id) {
                current[i] = newElement;
                setElements(current);
                return;
            }
        }
    };

    const launchElementControl = (info) => {
        setElementInfo(info);
        setControlVisible(true);
    };

    const handleRender = ({ item }) => {
        switch (item.type) {
            case 'title':
                return (<TitleElement
                    value={item.body}
                    controlFunc={() => {
                        launchElementControl({
                            id: item.id,
                            type: item.type,
                            body: item.body
                        });
                    }}
                />);
            case 'paragraph':
                return (
                    <Paragraph
                        value={item.body}
                        controlFunc={() => {
                            launchElementControl({
                                id: item.id,
                                type: item.type,
                                body: item.body
                            });
                        }}
                    />
                );
            case 'subtitle':
                return (
                    <SubtitleElement
                        value={item.body}
                        controlFunc={() => {
                            launchElementControl({
                                id: item.id,
                                type: item.type,
                                body: item.body
                            });
                        }}
                    />
                );
            case 'imageSlideshow':
                return (
                    <ImageSlideshow
                        description={item.description}
                        images={item.images}
                        type={item.sourceType}
                        controlFunc={() => {
                            launchElementControl({
                                id: item.id,
                                type: item.type,
                                sourceType: item.sourceType,
                                description: item.description,
                                images: item.images
                            });
                        }}
                    />
                );
            case 'bulletList':
                return (
                    <BulletList
                        title={item.title}
                        sentences={item.sentences}
                        controlFunc={() => {
                            launchElementControl({
                                id: item.id,
                                type: item.type,
                                title: item.title,
                                sentences: item.sentences
                            });
                        }}
                    />
                );
        }
    };

    // const sendArticle = (thumbUri, category) => {
    //     var postId = Date.now();

    //     var article = currentElements;
    //     var formData = new FormData();

    //     formData.append('photos', {
    //         uri: thumbUri,
    //         type: 'image/png',
    //         name: 'thumbnail.png'
    //     });

    //     var k = -1;
    //     var index = 0;

    //     var dict = new Array(25);

    //     for (var i in article) {
    //         var element = article[i];

    //         if (element.type == 'imageSlideshow') {
    //             k++;

    //             for (var j in element.images) {
    //                 index++;

    //                 var obj = element.images[j];

    //                 if (obj.type == 'default') continue;

    //                 formData.append('photos', {
    //                     uri: obj.url,
    //                     type: 'image/png',
    //                     name: 'photo.png'
    //                 });

    //                 dict[index] = k;
    //             }

    //             article[i].images = { id: postId, index: k };
    //         }
    //     }

    //     formData.append('postId', postId);
    //     formData.append('category', category);
    //     formData.append('dictionary', JSON.stringify(dict.filter(item => item != null)));
    //     formData.append('articleJson', JSON.stringify(article));

    //     fetch(`http://${HOST}/createArticle`, {
    //         method: 'post',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'multipart/form-data'
    //         },
    //         body: formData
    //     }).then(response => console.log(response));

    //     navigation.goBack();
    // };

    const writeTemp = async () => {
        await AsyncStorage.setItem('article', JSON.stringify(currentElements));
        navigation.navigate('RomanianStep');
    };

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

                    <Text style={styles.headerText}>English preview</Text>

                    <TouchableOpacity style={{
                        position: 'absolute',
                        right: 10,
                        backgroundColor: 'white',
                        flexDirection: 'row',
                        borderRadius: 15
                    }} onPress={() => setPromptVisible(true)}>
                        <Ionicons style={{
                            marginHorizontal: 5
                        }} name="add-circle-outline" size={30} color="#a15ea1" />
                        <Text style={{
                            alignSelf: 'center',
                            marginRight: 15,
                            fontFamily: 'avenir-bold',
                            fontSize: 17
                        }}>Add</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <NewElementPrompt
                visible={promptVisible}
                closeFunc={() => setPromptVisible(false)}
                returnElement={appendElement}
            />

            <ControlElementPrompt
                visible={controlVisible}
                info={elementInfo}
                saveFunc={saveElement}
                closeFunc={() => setControlVisible(false)}
                deleteFunc={deleteElement}
            />

            {/* <ThumbnailPrompt
                visibility={thumbVisible}
                closeCallback={() => setThumbVisible(false)}
                submitFunc={sendArticle}
            /> */}

            <FlatList
                style={{ flex: 1, backgroundColor: 'white' }}
                data={currentElements}
                keyExtractor={(item, index) => String(index)}
                renderItem={handleRender}
            />

            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => {
                    writeTemp();
                }} style={styles.button}>
                    <Text style={styles.buttonText}>Continue to the romanian version</Text>
                </TouchableOpacity>
            </View>

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
    buttonContainer: {
        width: '100%',
        height: 80,
        paddingHorizontal: 40,
        paddingVertical: 15,
        backgroundColor: 'white'
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#a15ea1',
        borderRadius: 15
    },
    buttonText: {
        fontFamily: 'avenir-bolder',
        color: 'white',
        fontSize: 20,
        textAlign: 'center'
    }
});

export default CreateArticle;