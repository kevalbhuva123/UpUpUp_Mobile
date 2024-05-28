import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {ScreenWithCustomBackBehavior} from '../../Components/Backhandler/Backhandler';
import CustomHeader from '../../Components/CustomHeader';
import Color from '../../Constants/Color';

const HotOfferScreen = ({navigation}) => {
  return (
    <View style={styles.main}>
      <ScreenWithCustomBackBehavior />
      <CustomHeader
        heading={'Hot Offers'}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.master}></View>
    </View>
  );
};

export default HotOfferScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  master: {
    flex: 1,
    backgroundColor: Color.background,
  },
});
