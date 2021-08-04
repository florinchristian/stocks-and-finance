import React from 'react';
import {View, Image, StyleSheet} from 'react-native';

const PostImagePreview = ({src}) => {
    return (
        <View style={styles.container}>
            <Image 
                style={{flex: 1, resizeMode: 'cover'}}
                source={{uri: src}}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 323,
        height: '100%'
    }
});

export default PostImagePreview;