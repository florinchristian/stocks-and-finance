import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Switch
} from 'react-native';

const ValueToggle = ({title, value, onChangeValue}) => {
    return(
        <View style={styles.container}>
            <View style={styles.bodyContainer}>
                <Text style={styles.title}>{title}</Text>
                <Switch
                    trackColor={{
                        false: '#cccccc',
                        true: '#c69fc6'
                    }}
                    thumbColor={value? '#a15ea1': '#8c8c8c'}
                    style={styles.toggle}
                    value={value}
                    onValueChange={onChangeValue}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 20
    },
    bodyContainer: {
        paddingVertical: 15,
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: 'gray',
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        flexDirection: 'row',
    },
    title: {
        fontSize: 18,
        fontFamily: 'avenir-bold',
        paddingLeft: 10
    },
    toggle: {
        position: 'absolute',
        right: 0
    }
}); 

export default ValueToggle;