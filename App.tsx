import {View, Text, StatusBar, LogBox, TouchableOpacity} from 'react-native';
import React from 'react';
import Navigator from './src/Navigation/Navigator';
import Color from './src/Constants/Color';
import 'react-native-gesture-handler';
import {ToastProvider} from 'react-native-toast-notifications';
import {scale} from './src/utlis/Scale';
import Fonts from './src/Constants/Fonts';

const App = () => {
  LogBox.ignoreAllLogs(); //Ignore all log notifications

  return (
    <View style={{flex: 1}}>
      <StatusBar backgroundColor={Color.main} barStyle={'light-content'} />
      <ToastProvider
        placement="bottom"
        offset={10}
        // Custom type example
        renderType={{
          custom_toast: toast => (
            <View
              style={{
                width: '65%',
                paddingHorizontal: scale(15),
                paddingVertical: scale(10),
                backgroundColor: Color.white,
                marginVertical: scale(4),
                borderRadius: scale(10),
                borderLeftColor: Color.red,
                borderLeftWidth: scale(6),
                justifyContent: 'center',
                paddingLeft: scale(16),
              }}>
              <Text
                style={{
                  fontSize: scale(14),
                  color: Color.main,
                  fontFamily: Fonts.bold,
                }}>
                {toast.data.title}
              </Text>
              <Text
                style={{
                  color: Color.grey,
                  marginTop: scale(2),
                  fontFamily: Fonts.regular,
                  fontSize: scale(12),
                }}>
                {toast.message}
              </Text>
            </View>
          ),
          custom_toast_success: toast => (
            <View
              style={{
                width: '65%',
                paddingHorizontal: scale(15),
                paddingVertical: scale(10),
                backgroundColor: Color.white,
                marginVertical: scale(4),
                borderRadius: scale(10),
                borderLeftColor: Color.green,
                borderLeftWidth: scale(6),
                justifyContent: 'center',
                paddingLeft: scale(16),
              }}>
              <Text
                style={{
                  fontSize: scale(14),
                  color: Color.main,
                  fontFamily: Fonts.bold,
                }}>
                {toast.data.title}
              </Text>
              <Text
                style={{
                  color: Color.grey,
                  marginTop: scale(2),
                  fontFamily: Fonts.regular,
                  fontSize: scale(12),
                }}>
                {toast.message}
              </Text>
            </View>
          ),
        }}>
        <Navigator />
      </ToastProvider>
    </View>
  );
};

export default App;
