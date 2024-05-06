import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Color from '../../Constants/Color';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import {ScreenWithCustomBackBehavior} from '../../Components/Backhandler/Backhandler';

const BookNowScreen = ({navigation}) => {
  return (
    <View style={styles.main}>
      <ScreenWithCustomBackBehavior />
      <CustomHeader
        heading={'Book Now'}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.master}></View>
    </View>
  );
};

export default BookNowScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  master: {
    flex: 1,
    backgroundColor: Color.background,
  },
});
