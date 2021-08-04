import React from 'react';
import {View, Text, StyleSheet, ImageBackground, TouchableOpacity} from 'react-native';

const CategoryItem = ({title, image, description, pressFunc}) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={pressFunc} style={styles.subContainer}>
                <ImageBackground
                    style={styles.image}
                    source={image}
                />
                
                <View style={styles.infoContainer}>
                    <Text style={styles.titleText}>{title}</Text>
                    <Text style={styles.descText}>{description}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );  
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 170,
        marginTop: 25,
        paddingHorizontal: 30
    },
    subContainer: {
        flex: 1,
        overflow: 'hidden',
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,

        elevation: 16,
    },
    image: {
        flex: 1
    },
    infoContainer: {
        width: '100%',
        height: 80,
        position: 'absolute',
        bottom: 0,
        paddingHorizontal: 20
    },
    titleText: {
        color: 'white',
        fontFamily: 'avenir-bolder',
        fontSize: 22
    },
    descText: {
        color: 'white',
        fontFamily: 'avenir',
        fontSize: 17
    }
});

export default CategoryItem;