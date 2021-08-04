import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
} from 'react-native';

import Picker from './Picker';
import InputField from './InputField';
import ImageSet from './ImageSet';

const NewElementPrompt = ({ visible, closeFunc, returnElement }) => {
    const [selectedString, setSelectedString] = useState('Title');

    const [images, setImages] = useState([]);

    const [textValue, setTextValue] = useState('');
    const [extraSentence, setExtra] = useState('');

    const [currentBorderColor, setBorderColor] = useState('gray');

    const extractUrl = () => {
        var result = [];

        for (var i in images) {
            let obj = images[i];
            if (obj.type != 'default') {
                result.push(obj.url)
            }
        }

        return result;
    };

    const sendNewElement = () => {
        var elemId = Date.now();
        if (selectedString == 'Title') {
            returnElement({
                id: elemId,
                type: 'title',
                body: textValue
            });
            setTextValue('');
            closeFunc();
            return;
        }
        if (selectedString == 'Subtitle') {
            returnElement({
                id: elemId,
                type: 'subtitle',
                body: textValue
            });
            setTextValue('');
            closeFunc();
            return;
        }
        if (selectedString == 'Paragraph') {
            returnElement({
                id: elemId,
                type: 'paragraph',
                body: textValue
            });
            setTextValue('');
            closeFunc();
            return;
        }
        if (selectedString == 'Image Slideshow') {
            returnElement({
                id: elemId,
                type: 'imageSlideshow',
                sourceType: 'test',
                description: textValue,
                'images': images
            });
            setTextValue('');
            setImages([]);
            closeFunc();
            return;
        }
        if (selectedString == 'Bullet List') {
            returnElement({
                id: elemId,
                type: 'bulletList',
                title: textValue,
                sentences: extraSentence.split('\n')
            });
            setTextValue('');
            setExtra('');
            closeFunc();
            return;
        }
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType='fade'
        >
            <View style={styles.container}>
                <View style={styles.body}>
                    <View>
                        <Picker
                            title='Component to add'
                            selectedValue={selectedString}
                            values={[
                                'Title',
                                'Subtitle',
                                'Paragraph',
                                'Image Slideshow',
                                'Bullet List'
                            ]}
                            onChangeValue={(newValue) => {
                                setSelectedString(newValue);
                                setTextValue('');
                                setExtra('');
                                setImages([]);
                                setBorderColor('gray');
                            }}
                        />
                    </View>

                    {(selectedString == 'Title') ? (
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

                    {(selectedString == 'Subtitle') ? (
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

                    {(selectedString == 'Paragraph') ? (
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

                    {(selectedString == 'Image Slideshow') ? (
                        <View style={{ height: 200 }}>
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
                                    value={textValue}
                                    onChangeText={setTextValue}
                                    placeholder='Description'
                                    onFocus={() => setBorderColor('#a15ea1')}
                                    onBlur={() => setBorderColor('gray')}
                                />
                            </View>

                            <View style={{ flex: 1 }}>
                                <ImageSet
                                    columnNumber={2}
                                    giveImage={(images) => setImages(images)}
                                />
                            </View>
                        </View>
                    ) : null}

                    {(selectedString == 'Bullet List') ? (
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
                                value={textValue}
                                placeholder='Title'
                                onEdit={(newValue) => setTextValue(newValue)}
                                onFocus={() => { }}
                                onLostFocus={() => { }}
                            />

                            <View style={{
                                marginTop: 60,
                                borderBottomWidth: 2,
                                borderColor: currentBorderColor,
                                marginBottom: 5
                            }}>
                                <TextInput
                                    multiline
                                    style={{
                                        fontFamily: 'avenir',
                                        fontSize: 17,
                                        paddingVertical: 10
                                    }}
                                    value={extraSentence}
                                    onChangeText={setExtra}
                                    onFocus={() => setBorderColor('#a15ea1')}
                                    onBlur={() => setBorderColor('gray')}
                                    placeholder='Sentences, on different lines'
                                />
                            </View>
                        </View>
                    ) : null}

                    <View style={styles.buttonContainer}>
                        <View style={styles.buttonBackground}>
                            <TouchableOpacity onPress={() => {
                                setTextValue('');
                                setExtra('');
                                setImages([]);
                                closeFunc();
                            }}>
                                <Text style={{
                                    fontFamily: 'avenir-bolder',
                                    fontSize: 17,
                                    color: '#ff4d4d'
                                }}>Close</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.buttonBackground}>
                            <TouchableOpacity style={{
                                width: 80,
                                height: 40,
                                backgroundColor: '#a15ea1',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 10
                            }} onPress={sendNewElement}>
                                <Text style={{
                                    color: 'white',
                                    fontFamily: 'avenir-bolder',
                                    fontSize: 17
                                }}>Add</Text>
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
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,

        elevation: 16,
    },
    buttonContainer: {
        width: '100%',
        height: 60,
        flexDirection: 'row',
        marginTop: 20
    },
    buttonBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default NewElementPrompt;