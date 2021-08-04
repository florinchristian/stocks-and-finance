import React, {useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, ScrollView, StatusBar} from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';

import InputField from '../components/InputField';
import ImageSet from '../components/ImageSet';
import Picker from '../components/Picker';
import LoadingModal from '../components/LoadingModal';
import FinishPostPrompt from '../components/FinishPostPrompt';

const HOST = '192.168.0.100:40389';

const CreatePostRoute = ({navigation}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Crypto');
    const [attachment, setAttachment] = useState([]);

    const [descRef, setDescRef] = useState(null);

    const [modalVisibility, setModalVisibility] = useState(false);
    const [promptVisible, setPromptVisible] = useState(false);

    const sendPost = async (roTitle, roDescription) => {
        setModalVisibility(true);

        var photos = attachment.filter((obj) => {
            return obj.type != 'default';
        });

        var data = new FormData();
        data.append('title', JSON.stringify({
            en: title,
            ro: roTitle
        }));
        data.append('desc', JSON.stringify({
            en: description,
            ro: roDescription
        }));
        data.append('category', category);

        for (var i in photos) {
            data.append('photos', {
                uri: photos[i].url,
                type: 'image/png',
                name: 'photo.png'
            });
        }

        fetch(`http://${HOST}/createPost`, {
           method: 'post',
           headers: {
               'Accept': 'application/json',
               'Content-Type': 'multipart/form-data'
           },
           body: data
        }).then(response => {
            setModalVisibility(false);
            navigation.goBack();
        });
    };

    return (
        <View style={styles.container}>
            <FinishPostPrompt 
                visible={promptVisible}
                submitFunc={sendPost}
                handleClose={() => setPromptVisible(false)}
            />

            <LoadingModal
                text='Uploading post'
                visible={modalVisibility}
            />

            <View style={styles.header}>
                <View style={styles.headerItems}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{marginHorizontal: 10}}>
                        <AntDesign name="arrowleft" size={30} color="white" />
                    </TouchableOpacity>

                    <Text style={styles.headerText}>Create post</Text>
                </View>
            </View>

            <ScrollView
                style={{flex: 1, backgroundColor: '#F5F5F5', paddingHorizontal: 20}}
            >
                <InputField 
                    placeholder='Post title'
                    customStyle={{marginBottom: 0}}
                    value={title}
                    onEdit={(text) => setTitle(text)}
                    onFocus={() => {}}
                    onLostFocus={() => {}}
                    onDoneEditing={() => descRef.focus()}
                />

                <InputField 
                    placeholder='Description'
                    customStyle={{marginBottom: 0}}
                    giveRef={(ref) => setDescRef(ref)}
                    value={description}
                    multiLine={true}
                    onEdit={(text) => setDescription(text)}
                    onFocus={() => {}}
                    onLostFocus={() => {}}
                />

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

                <ImageSet 
                    giveImage={(data) => {
                        setAttachment(data);
                    }}
                />

                <View style={styles.btnContainer}>
                    <TouchableOpacity onPress={() => setPromptVisible(true)} style={styles.btnBackground}>
                        <Text style={styles.btnText}>Finish post</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
    picker: {
        height: 50
    },
    btnContainer: {
        width: '100%',
        height: 70,
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginTop: 20
    },
    btnBackground: {
        flex: 1,
        backgroundColor: '#a15ea1',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20
    },
    btnText: {
        color: 'white',
        fontFamily: 'avenir-bolder',
        fontSize: 20
    }
});

export default CreatePostRoute;