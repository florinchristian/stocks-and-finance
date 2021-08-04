import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

import Feather from 'react-native-vector-icons/Feather';

const CheckBox = ({text, color, value, pressFunc}) => {
    return (
        <View style={{flexDirection:'row', alignItems: 'center', marginVertical: 10}}>
            <TouchableOpacity 
                style={{
                    width: 25,
                    height: 25,
                    marginRight: 10,
                    borderWidth: 1,
                    borderColor: '#a15ea1',
                    borderRadius: 6,
                    backgroundColor: (value? color : null),
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                onPress={pressFunc}
            >
                {value? (<Feather name="check" size={20} color={value? 'white' : color} />): null}
            </TouchableOpacity>

            <Text style={{fontFamily: 'avenir', fontSize: 15}}>{text}</Text>
        </View>
    );
};

export default CheckBox;