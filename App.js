import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import HomeScreen from './screens/HomeScreen';
import RegisterScreen from './screens/RegisterScreen';

const nav = createStackNavigator({
    Home: HomeScreen,
    Register: RegisterScreen
},{
    defaultNavigationOptions: {
        headerShown: false
    }
});

export default createAppContainer(nav);