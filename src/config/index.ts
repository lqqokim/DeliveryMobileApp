import {Platform} from 'react-native';
import Config from 'react-native-config';

const {ANDROID_API_URL, IOS_API_URL} = Config;
const API_URL = Platform.OS === 'android' ? ANDROID_API_URL : IOS_API_URL;

export {API_URL};
