import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    StyleSheet,
    TouchableOpacity,
    Text,
    TextInput
} from 'react-native';

import InputField from './InputField';
import ImageSet from './ImageSet';

const ControlElementPrompt = ({ visible, info, saveFunc, closeFunc, deleteFunc }) => {
    const [textValue, setTextValue] = useState(
        (info.body) ? info.body : ''
    );
    const [title, setTitle] = useState(
        (info.title) ? info.title : ''
    );
    const [sentences, setSentences] = useState(
        (info.sentences) ? info.sentences.join('\n') : ''
    );
    const [description, setDescription] = useState(
        (info.description) ? info.description : ''
    );
    const [images, setImages] = useState(
        (info.images) ? info.images : [{ type: 'default' }]
    );

    const [currentBorderColor, setBorderColor] = useState('gray');

    const extractUrl = () => {
        var result = [];

        for (var i in images) {
            let obj = images[i];
            if(obj.type != 'default') {
                result.push(obj.url)
            }
        }

        return result;
    };

    const saveElement = () => {
        if (info.type == 'title') {
            saveFunc({
                id: info.id,
                type: 'title',
                body: textValue
            });
            closeFunc();
            return;
        }
        if (info.type == 'subtitle') {
            saveFunc({
                id: info.id,
                type: 'subtitle',
                body: textValue
            });
            closeFunc();
            return;
        }
        if (info.type == 'paragraph') {
            saveFunc({
                id: info.id,
                type: 'paragraph',
                body: textValue
            });
            closeFunc();
            return;
        }
        if (info.type == 'imageSlideshow') {
            saveFunc({
                id: info.id,
                type: 'imageSlideshow',
                sourceType: 'test',
                description: description,
                'images': images
            });
            closeFunc();
            return;
        }
        if (info.type == 'bulletList') {
            saveFunc({
                id: info.id,
                type: 'bulletList',
                title: title,
                sentences: sentences.split('\n')
            });
            closeFunc();
            return;
        }
    };

    useEffect(() => {
        if (info.body) {
            setTextValue(info.body);
        }
        if (info.title) {
            setTitle(info.title);
        }
        if (info.sentences) {
            setSentences(info.sentences.join('\n'));
        }
        if (info.images) {
            setImages(info.images);
        }
        if (info.description) {
            setDescription(info.description);
        }
    }, [info]);

    return (
        <Modal
            transparent
            visible={visible}
            animationType='fade'
        >
            <View style={styles.container}>
                <View style={styles.body}>
                    {(info.type == 'title') ? (
                        <View style={{ height: 80 }}>
                            <Text style={{
                                fontSize: 22,
                                fontFamily: 'avenir-bolder',
                                color: '#a15ea1'
                            }}>Title component</Text>

                            <InputField
                                customStyle={{
                                    position: 'absolute'
                                }}
                                value={textValue}
                                placeholder='Value'
                                onEdit={(newValue) => setTextValue(newValue)}
                                onFocus={() => { }}
                                onLostFocus={() => { }}
                            />
                        </View>
                    ) : null}

                    {(info.type == 'subtitle') ? (
                        <View style={{ height: 80 }}>
                            <Text style={{
                                fontSize: 22,
                                fontFamily: 'avenir-bolder',
                                color: '#a15ea1'
                            }}>Subtitle component</Text>

                            <InputField
                                customStyle={{
                                    position: 'absolute'
                                }}
                                value={textValue}
                                placeholder='Value'
                                onEdit={(newValue) => setTextValue(newValue)}
                                onFocus={() => { }}
                                onLostFocus={() => { }}
                            />
                        </View>
                    ) : null}

                    {(info.type == 'paragraph') ? (
                        <View style={{ height: 80 }}>
                            <Text style={{
                                fontSize: 22,
                                fontFamily: 'avenir-bolder',
                                color: '#a15ea1'
                            }}>Paragraph component</Text>

                            <InputField
                                customStyle={{
                                    position: 'absolute'
                                }}
                                value={textValue}
                                placeholder='Value'
                                onEdit={(newValue) => setTextValue(newValue)}
                                onFocus={() => { }}
                                onLostFocus={() => { }}
                            />
                        </View>
                    ) : null}

                    {(info.type == 'imageSlideshow') ? (
                        <View style={{ height: 230 }}>
                            <View style={{
                                width: '100%',
                                height: 40,
                                borderBottomColor: currentBorderColor,
                                borderBottomWidth: 2,
                                marginBottom: 5
                            }}>
                                <TextInput
                                    style={{
                                        flex: 1,
                                        fontFamily: 'avenir',
                                        fontSize: 17
                                    }}
                                    value={description}
                                    onChangeText={setDescription}
                                    placeholder='Description'
                                    onFocus={() => setBorderColor('#a15ea1')}
                                    onBlur={() => setBorderColor('gray')}
                                />
                            </View>

                            <View style={{ flex: 1 }}>
                                <ImageSet
                                    values={images}
                                    giveImage={(newImages) => setImages(newImages)}
                                    columnNumber={2}
                                />
                            </View>

                            <View style={{height: 20}}>
                            </View>
                        </View>
                    ) : null}

                    {(info.type == 'bulletList') ? (
                        <View style={{ height: 150 }}>
                            <Text style={{
                                fontSize: 22,
                                fontFamily: 'avenir-bolder',
                                color: '#a15ea1'
                            }}>Bullet component</Text>

                            <InputField
                                customStyle={{
                                    position: 'absolute'
                                }}
                                value={title}
                                placeholder='Title'
                                onEdit={(newValue) => setTitle(newValue)}
                                onFocus={() => { }}
                                onLostFocus={() => { }}
                            />

                            <View style={{
                                marginTop: 60,
                                borderBottomWidth: 2,
                                borderColor: currentBorderColor,
                                marginBottom: 20
                            }}>
                                <TextInput
                                    multiline
                                    style={{
                                        fontFamily: 'avenir',
                                        fontSize: 17,
                                        paddingVertical: 10
                                    }}
                                    value={sentences}
                                    onChangeText={setSentences}
                                    onFocus={() => setBorderColor('#a15ea1')}
                                    onBlur={() => setBorderColor('gray')}
                                    placeholder='Sentences, on different lines'
                                />
                            </View>
                        </View>
                    ) : null}

                    <View style={styles.controlsContainer}>
                        <View style={styles.buttonBackground}>
                            <TouchableOpacity onPress={() => deleteFunc(info.id)}>
                                <Text
                                    style={[styles.buttonText, {
                                        color: '#ff4d4d',
                                        fontSize: 15
                                    }]}
                                >Delete element</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.buttonBackground}>
                            <TouchableOpacity style={{
                                backgroundColor: '#a15ea1',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: 100,
                                height: 30,
                                borderRadius: 10
                            }} onPress={saveElement}>
                                <Text
                                    style={[styles.buttonText, {
                                        color: 'white'
                                    }]}
                                >Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    body: {
        width: 300,
        backgroundColor: 'white',
        borderRadius: 15,
        paddingHorizontal: 20,
        paddingTop: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,
        
        elevation: 16,
    },
    controlsContainer: {
        width: '100%',
        height: 60,
        flexDirection: 'row'
    },
    buttonBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        fontFamily: 'avenir-bolder',
        fontSize: 17
    }
});

export default ControlElementPrompt;