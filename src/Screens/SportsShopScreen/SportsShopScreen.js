import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {ScreenWithCustomBackBehavior} from '../../Components/Backhandler/Backhandler';
import CustomHeader from '../../Components/CustomHeader';
import Color from '../../Constants/Color';

const SportsShopScreen = ({navigation}) => {
  return (
    <View style={styles.main}>
      <ScreenWithCustomBackBehavior />
      <CustomHeader
        heading={'Sports Shops'}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.master}></View>
    </View>
  );
};

export default SportsShopScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  master: {
    flex: 1,
    backgroundColor: Color.background,
  },
});
