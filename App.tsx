import {View, Text, StatusBar, LogBox} from 'react-native';
import React from 'react';
import Navigator from './src/Navigation/Navigator';
import Color from './src/Constants/Color';
import 'react-native-gesture-handler';
import {ToastProvider} from 'react-native-toast-notifications';

const App = () => {
  LogBox.ignoreAllLogs(); //Ignore all log notifications

  return (
    <View style={{flex: 1}}>
      <StatusBar backgroundColor={Color.main} barStyle={'light-content'} />
      <ToastProvider>
        <Navigator />
      </ToastProvider>
    </View>
  );
};

export default App;
