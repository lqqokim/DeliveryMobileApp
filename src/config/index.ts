import {Platform} from 'react-native';
import Config from 'react-native-config';

const API_URL =
  Platform.OS === 'android' ? Config.ANDROID_API_URL : Config.IOS_API_URL;

export {API_URL};
