import React from 'react';
import {
  TouchableWithoutFeedback,
  Keyboard,
  StyleProp,
  ViewStyle,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';

const DismissKeyboardView: React.FC<{style?: StyleProp<ViewStyle>}> = ({
  children,
  ...props
}) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAwareScrollView {...props} style={props.style}>
        {children}
      </KeyboardAwareScrollView>
      {/* <KeyboardAvoidingView
        // {...props}
        // style={props.style}
        behavior={Platform.OS === 'android' ? undefined : 'padding'}>
        {children}
      </KeyboardAvoidingView> */}
    </TouchableWithoutFeedback>
  );
};

export default DismissKeyboardView;

/**
 * - function 으로 선언하면 React.FC 사용하지 않아도 추론된다.
 * - children 이 있으면 React.FC 타입 선언이 가능한 arrow 로 선언하고 children 이 없으면 function 으로 선언하는게 좋다.
 * - props 로 내려오는 StyleSheet 에 대한 타입 추론을 제대로 하기 위해서는 style 을 StyleProp<ViewStyle> or StyleProp<TextStyle> 로 선언.
 */
