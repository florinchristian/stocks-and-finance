import React, { useState } from 'react';
import {
    Modal,
    View,
    TouchableOpacity,
    StyleSheet,
    Text,
    Image
} from 'react-native';


import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { launchImageLibrary } from 'react-native-image-picker';
import Picker from './Picker';

const ThumbnailPrompt = ({
    visibility,
    closeCallback,
    submitFunc
}) => {
    const [currentImage, setCurrentImage] = useState(null);
    const [category, setCategory] = useState('Crypto');

    const pickImage = async () => {
        // const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        // if (status != 'granted') {
        //     return;
        // }

        // var result = await ImagePicker.launchImageLibraryAsync();
        // if (!result.cancelled) {
        //     setCurrentImage(result.uri);
        // }

        launchImageLibrary({quality: 1, includeBase64: false}, result => {
            if (!result.didCancel) {
                setCurrentImage(result.assets[0].uri);
            }
        });
    };

    return (
        <Modal
            transparent
            visible={visibility}
        >
            <View style={styles.container}>
                <View style={styles.body}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => {
                            closeCallback();
                        }} style={styles.closeIcon}>
                            <AntDesign name="arrowleft" size={30} color="#a15ea1" />
                        </TouchableOpacity>

                        <Text style={{
                            fontFamily: 'avenir-bolder',
                            fontSize: 17
                        }}>Finish article</Text>
                    </View>

                    <View style={{
                        width: '100%',
                        height: 170,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        {!currentImage? (
                            <TouchableOpacity onPress={pickImage} style={{
                                width: 150,
                                height: 150,
                                backgroundColor: '#F0F0F0',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: 5
                            }}>
                                <FontAwesome name="camera" size={24} color="gray" />
                                <Text style={{
                                    color: 'gray',
                                    fontFamily: 'avenir'
                                }}>Select thumbnail</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={pickImage}>
                                <Image 
                                    source={{uri: currentImage}}
                                    style={{
                                        width: 150,
                                        height: 150,
                                        borderRadius: 10
                                    }}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                    
                    <View style={{
                        paddingHorizontal: 20
                    }}>
                        <Picker 
                            title='Category'
                            selectedValue={category}
                            values={[
                                'Crypto',
                                'Investing',
                                'Lifestyle',
                                'Stock market'
                            ]}
                            onChangeValue={(newValue) => setCategory(newValue)}  
                        />
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={() => {
                            if (currentImage) {
                                submitFunc(currentImage, category);
                            }
                        }} style={styles.button}>
                            <Text style={styles.buttonText}>Send article</Text>
                        </TouchableOpacity>
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
        backgroundColor: 'white',
        width: 250,
        borderRadius: 15,
        paddingTop: 10
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 30,
        flexDirection: 'row'
    },
    buttonContainer: {
        width: '100%',
        height: 80,
        paddingHorizontal: 20,
        paddingVertical: 15
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
        fontSize: 17
    },
    closeIcon: {
        position: 'absolute',
        left: 10
    }
});

export default ThumbnailPrompt;