import {View, Text, StatusBar} from 'react-native';
import React from 'react';
import Navigator from './src/Navigation/Navigator';
import Color from './src/Constants/Color';
import 'react-native-gesture-handler';

const App = () => {
  return (
    <View style={{flex: 1}}>
      <StatusBar backgroundColor={Color.main} barStyle={'light-content'} />

      <Navigator />
    </View>
  );
};

export default App;
