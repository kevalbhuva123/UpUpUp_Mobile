import React from 'react';
import {Text, View, ActivityIndicator, StyleSheet} from 'react-native';
import {scale} from '../../utlis/Scale';
import Color from '../../Constants/Color';
import Fonts from '../../Constants/Fonts';

export const ActivityLoader = ({loading, color}) => {
  return (
    <>
      {loading && (
        <View style={styles.container}>
          <View style={styles.subView}>
            <ActivityIndicator
              size={'large'}
              animating
              color={color || Color.subBg}
            />
            <Text style={styles.text}>Please Wait</Text>
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignSelf:'center',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    backgroundColor: Color.modalBG,
    position:'absolute',
    width:'100%',
    height:'100%'
  },
  subView: {
    alignItems: 'center',
    alignSelf:'center',
    justifyContent: 'center',
    backgroundColor: Color.white,
    padding: scale(20),
  },
  text: {
    fontSize: scale(14),
    color: Color.subBg,
    marginTop: scale(5),
    fontFamily: Fonts.regular,
  },
});
