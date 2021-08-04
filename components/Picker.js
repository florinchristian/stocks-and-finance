import React, {useState} from 'react';
import {View, Text, StyleSheet, Modal, TouchableOpacity, FlatList} from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';

const Picker = ({title, selectedValue, values, onChangeValue}) => {
    const [modalVisibility, setModalVisibility] = useState(false);

    const handleChange = (value) => {
        onChangeValue(value);
        setModalVisibility(false);
    };

    return(
        <View style={styles.container}>
            <Modal
                transparent
                animationType='fade'
                visible={modalVisibility}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalBody}>
                        <FlatList 
                            scrollEnabled={false}
                            keyExtractor={(item, index) => String(index)}
                            data={values}
                            renderItem={({item}) => {
                                return (
                                    <TouchableOpacity onPress={() => handleChange(item)} style={styles.itemBackground}>
                                        <Text style={styles.itemText}>{item}</Text>
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    </View>
                </View>
            </Modal>

            <Text 
                style={{
                    marginTop: 10,
                    fontSize: 22,
                    fontFamily: 'avenir-bolder',
                    color: '#a15ea1'
                }}
            >
                {title}
            </Text>
            
            <TouchableOpacity onPress={() => setModalVisibility(true)} activeOpacity={1} style={styles.body}>
                <Text style={styles.text}>{selectedValue}</Text>
                <AntDesign style={styles.icon} name="caretdown" size={14} color="gray" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: 5
    },
    body: {
        height: 50,
        borderWidth: 2.5,
        borderColor: 'gray',
        borderRadius: 10,
        alignItems: 'center',
        paddingHorizontal: 10,
        marginTop: 5,
        flexDirection: 'row'
    },
    text: {
        fontSize: 17,
        fontFamily: 'avenir-bold'
    },
    icon: {
        position: 'absolute',
        right: 10
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalBody: {
        width: 300,
        backgroundColor: 'white',
        borderRadius: 10
    },
    itemBackground: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    itemText: {
        fontFamily: 'avenir',
        fontSize: 20
    }
});

export default Picker;