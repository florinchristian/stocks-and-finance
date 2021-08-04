import React from 'react';
import {View, ImageBackground, StyleSheet, TouchableOpacity} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

const ImageSetItem = ({type, addFunc, url, removeFunc, id}) => {
    return (
        <View 
            style={[styles.container, (type=='default'? (
                {
                    justifyContent: 'center',
                    alignItems: 'center',
                }
            ) : null)]}
        >
            {type=='default'? (
                <TouchableOpacity onPress={addFunc}>
                    <FontAwesome name="plus" size={30} color="#a15ea1" />
                </TouchableOpacity>
            ) : (
               <TouchableOpacity onPress={() => removeFunc(url)} style={{flex: 1}}>
                    <ImageBackground
                        style={{flex: 1}}
                        source={{uri: url}}
                    />
               </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 120,
        height: 120,
        padding: 5,
    }
});

export default ImageSetItem;