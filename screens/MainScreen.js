import {createAppContainer} from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import {createDrawerNavigator} from 'react-navigation-drawer';

import PostListRoute from '../routes/PostListRoute';
import CategoryRoute from '../routes/CategoryRoute';
import CreatePostRoute from '../routes/CreatePostRoute';
import ContactUsRoute from '../routes/ContactUsRoute';
import UserInbox from '../routes/UserInbox';
import AdminInbox from '../routes/AdminInbox';
import SettingsRoute from '../routes/SettingsRoute';
import EnglishStep from '../routes/EnglishStep';
import RomanianStep from '../routes/RomanianStep';
import ArticleViewRoute from '../routes/ArticleViewRoute';

import DrawerMenu from '../menus/DrawerMenu';

const MainScreen = createDrawerNavigator({
    'CategoryList': CategoryRoute,
    'PostList': PostListRoute,
    'CreatePost': CreatePostRoute,
    'ContactUs': ContactUsRoute,
    'UserInbox': UserInbox,
    'AdminInbox': AdminInbox,
    'Settings': SettingsRoute,
    'CreateArticle': createStackNavigator({
        'EnglishStep': EnglishStep,
        'RomanianStep': RomanianStep
    }, {
        initialRouteName: 'EnglishStep',
        defaultNavigationOptions: {
            headerShown: false
        }
    }),
    'ViewArticle': ArticleViewRoute
}, {
    contentComponent: DrawerMenu,
    unmountInactiveRoutes: true
});

export default createAppContainer(MainScreen);