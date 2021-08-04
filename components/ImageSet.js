import React, {useState} from 'react';
import {View, Text, StyleSheet, FlatList, Alert} from 'react-native';

import ImageSetItem from '../components/ImageSetItem';

import {launchImageLibrary} from 'react-native-image-picker';

// import * as ImagePicker from 'expo-image-picker';
// import * as Permissions from 'expo-permissions';

const ImageSet = ({giveImage, columnNumber, values}) => {
    const [images, setImages] = useState(
        (values)? values : [{
            type: 'default'
        }]
    );

    const removeImage = (id) => {
        setImages(images.filter((obj) => {
            return obj.url != id;
        }));

        giveImage(images.filter((obj) => {
            return obj.url != id;
        }));
    };

    const addImage = async () => {
        // const perm = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
        
        // if(perm.status != 'granted') {
        //     Alert.alert('Error', 'You must grant gallery access to upload a photo!');
        //     return;
        // }

        // var image = await ImagePicker.launchImageLibraryAsync({quality: 1, base64: false});

        // if (image.cancelled) {
        //     return;
        // } else {
        //     setImages([...images, {
        //         type: 'gallery',
        //         url: image.uri
        //     }]);

        //     giveImage([...images, {
        //         type: 'gallery',
        //         url: image.uri
        //     }]);
        // }

        launchImageLibrary({quality: 1, includeBase64: false}, result => {
            if (!result.didCancel) {
                setImages([...images, {
                    type: 'gallery',
                    url: result.assets[0].uri
                }]);

                giveImage([...images, {
                    type: 'gallery',
                    url: result.assets[0].uri
                }]);
            }
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Images</Text>
            <FlatList 
                data={images}
                numColumns={(columnNumber)? columnNumber : 3}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => {
                    return <ImageSetItem id={index} removeFunc={removeImage} url={item.url} type={item.type} addFunc={addImage}/>
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        minHeight: 70,
        maxHeight: 230
    },
    title: {
        fontSize: 22,
        fontFamily: 'avenir-bolder',
        color: '#a15ea1'
    }
});

export default ImageSet;

