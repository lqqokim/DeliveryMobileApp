import React, {useCallback, useState} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {LoggedInParamList} from '../../AppInner';
import ImagePicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';
import axios, {AxiosError, AxiosResponse} from 'axios';
import Config from 'react-native-config';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import orderSlice from '../slices/order';
import {useAppDispatch} from '../store';

function Complete() {
  const dispatch = useAppDispatch();
  const route = useRoute<RouteProp<LoggedInParamList>>();
  const navigation = useNavigation<NavigationProp<LoggedInParamList>>();
  const [image, setImage] = useState<{
    uri: string;
    name: string;
    type: string;
  }>();
  const [preview, setPreview] = useState<{uri: string}>();
  const accessToken = useSelector((state: RootState) => state.user.accessToken);

  const onResponse = useCallback(async response => {
    console.log(
      '[onResponse] ',
      response.width,
      response.height,
      response.exif,
    );
    setPreview({uri: `data:${response.mime};base64,${response.data}`});
    const orientation = (response.exif as any)?.Orientation;
    console.log('orientation', orientation);

    return ImageResizer.createResizedImage(
      response.path, // 파일의 경로 file://안드로이드 경로
      600,
      600,
      response.mime.includes('jpeg') ? 'JPEG' : 'PNG',
      100,
      0,
    ).then(r => {
      console.log(r.uri, r.name);

      // 해당 객체의 정보를 formData 로 업로드하면 된다.
      setImage({
        uri: r.uri,
        name: r.name,
        type: response.mime,
      });
    });
  }, []);

  const onTakePhoto = useCallback(() => {
    return ImagePicker.openCamera({
      includeBase64: true,
      // includeExif: true, // 이미지 회전 대응: Orientation
      saveToPhotos: true,
      // cropping: true, // 이미지 편집
    })
      .then(onResponse)
      .catch(console.log);
  }, [onResponse]);

  const onChangeFile = useCallback(() => {
    return ImagePicker.openPicker({
      includeExif: true,
      includeBase64: true,
      mediaType: 'photo',
    })
      .then(onResponse)
      .catch(console.log);
  }, [onResponse]);

  const orderId = route.params?.orderId;
  const onComplete = useCallback(async () => {
    if (!image) {
      Alert.alert('알림', '파일을 업로드해주세요.');
      return;
    }

    if (!orderId) {
      Alert.alert('알림', '유효하지 않은 주문입니다.');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('orderId', orderId);

    try {
      await axios.post(`${Config.API_URL}/complete`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // 추가 필요
          authorization: `Bearer ${accessToken}`,
        },
      });

      Alert.alert('알림', '완료처리 되었습니다.');
      navigation.goBack(); // 다시 돌아왔을 때 Complete 화면과 이미지 정보가 그대로 남아 있는 것을 방지하기 위해
      navigation.navigate('Settings');
      dispatch(orderSlice.actions.rejectOrder(orderId));
    } catch (error) {
      const errorResponse = (error as AxiosError).response as AxiosResponse;

      if (errorResponse) {
        Alert.alert('알림', errorResponse.data.message);
      }
    }
  }, [dispatch, navigation, image, orderId, accessToken]);

  return (
    <View>
      <View style={styles.orderId}>
        <Text>주문번호: {orderId}</Text>
      </View>
      <View style={styles.preview}>
        {preview && <Image style={styles.previewImage} source={preview} />}
      </View>
      <View style={styles.buttonWrapper}>
        <Pressable style={styles.button} onPress={onTakePhoto}>
          <Text style={styles.buttonText}>이미지 촬영</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={onChangeFile}>
          <Text style={styles.buttonText}>이미지 선택</Text>
        </Pressable>
        <Pressable
          style={
            image
              ? styles.button
              : StyleSheet.compose(styles.button, styles.buttonDisabled)
          }
          onPress={onComplete}>
          <Text style={styles.buttonText}>완료</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  orderId: {
    padding: 20,
  },
  preview: {
    marginHorizontal: 10,
    width: Dimensions.get('window').width - 20,
    height: Dimensions.get('window').height / 3,
    backgroundColor: '#D2D2D2',
    marginBottom: 10,
  },
  previewImage: {
    height: Dimensions.get('window').height / 3,
    resizeMode: 'cover', // 원래 비율 유지하면서 꽉 차게 ('cover' 사용하면 영역에 가득 차지만 잘린다)
  },
  buttonWrapper: {flexDirection: 'row', justifyContent: 'center'},
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: 120,
    alignItems: 'center',
    backgroundColor: 'yellow',
    borderRadius: 5,
    margin: 5,
  },
  buttonText: {
    color: 'black',
  },
  buttonDisabled: {
    backgroundColor: 'gray',
  },
});

export default Complete;
