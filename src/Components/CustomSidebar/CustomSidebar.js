import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Image,
  Linking,
} from 'react-native';
import React, {useState} from 'react';
import Color from '../../Constants/Color';
import {scale, verticalScale} from '../../utlis/Scale';
import {useNavigation} from '@react-navigation/native';
import Fonts from '../../Constants/Fonts';

const CustomSidebar = props => {
  const navigation = useNavigation();
  const {hamburgerVisible, onClose} = props;

  return (
    <Modal animationType="none" transparent visible={hamburgerVisible}>
      <TouchableOpacity
        style={styles.Modal}
        activeOpacity={1}
        onPress={() => {
          onClose();
        }}>
        <TouchableWithoutFeedback>
          <View style={styles.main}>
            <View style={styles.Header}></View>
            <View style={styles.allView}>
              <View style={styles.SupportView}></View>

              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      alignSelf: 'flex-start',
                      marginHorizontal: 20,
                    }}>
                    Version :
                  </Text>
                  {/* <Text
                    style={{
                      alignSelf: 'flex-start',
                      marginHorizontal: 20,
                    }}>
                    {DeviceInfo.getVersion()
                      ? DeviceInfo.getVersion()
                      : '1.0.0'}
                  </Text> */}
                </View>

                <TouchableOpacity
                  accessible
                  accessibilityLabel="Logout"
                  accessibilityRole="button"
                  accessibilityHint="Double tap to select"
                  style={styles.button}
                  onPress={() => {
                    // setmodalVisible(true);
                  }}>
                  <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
      {/* <LogoutModal
        title={CONSTANTS.LogoutMessageTitle}
        description={CONSTANTS.LogoutMessageDescription}
        modalVisible={modalVisible}
        onCancel={() => {
          setmodalVisible(false);
          onClose();
        }}
        onYes={() => {
          setmodalVisible(false);
          onClose();
          logoutUser();
        }}
      /> */}
    </Modal>
  );
};

export default CustomSidebar;

const styles = StyleSheet.create({
  Modal: {
    flex: 1,
    backgroundColor: Color.modalBG,
  },
  main: {
    backgroundColor: Color.white,
    width: '78%',
    height: '100%',
  },
  allView: {
    backgroundColor: Color.white,
    justifyContent: 'space-between',
    flex: 1,
  },
  Header: {
    height: '14%',
    backgroundColor: Color.subBg,
  },
  Logo: {
    height: scale(40),
    width: scale(114),
    position: 'absolute',
    marginLeft: scale(16),
    marginTop: verticalScale(35),
  },
  headingText: {
    fontSize: scale(14),
    fontFamily: Fonts.bold,
    color: Color.textBlack,
  },
  button: {
    backgroundColor: Color.green,
    borderRadius: scale(100),
    padding: scale(10),
    paddingBottom: scale(10),
    justifyContent: 'center',
    width: '90%',
    alignSelf: 'center',
    marginBottom: scale(20),
    marginTop: scale(15),
  },
  buttonText: {
    fontSize: scale(16),
    fontFamily: Fonts.semibold,
    color: Color.white,
    textAlign: 'center',
  },
  SupportView: {
    paddingHorizontal: scale(10),
    paddingTop: scale(28),
  },
  View1: {
    flexDirection: 'row',
    marginTop: 20,
    marginLeft: 30,
    justifyContent: 'space-between',
  },
  TextForVideo: {
    fontSize: scale(12),
    fontFamily: Fonts.bold,
    lineHeight: 20,
  },
  TextForArrow: {
    fontSize: scale(15),
    fontFamily: Fonts.bold,
    right: 5,
  },
  TextForLink: {
    fontSize: scale(12),
    fontStyle: 'italic',
    color: Color.textGray,
    lineHeight: 25,
    paddingLeft: 30,
  },
  View2: {
    flexDirection: 'row',
    marginTop: 20,
    marginLeft: 25,
    justifyContent: 'space-between',
  },
  TextFor: {
    fontSize: scale(12),
    fontFamily: Fonts.bold,
    lineHeight: 20,
  },
  Text1: {
    fontSize: scale(12),
    fontStyle: 'italic',
    color: Color.textGray,
    lineHeight: 25,
    paddingLeft: 30,
  },
  View1: {
    flexDirection: 'row',
    marginTop: 20,
    marginLeft: 30,
    justifyContent: 'space-between',
  },
  TextForVideo: {
    fontSize: scale(12),
    fontFamily: Fonts.bold,
    lineHeight: 20,
  },
  TextForArrow: {
    fontSize: scale(15),
    fontFamily: Fonts.bold,
    right: 5,
  },
  TextForLink: {
    fontSize: scale(12),
    fontStyle: 'italic',
    color: Color.textGray,
    lineHeight: 25,
    paddingLeft: 30,
  },
  View2: {
    flexDirection: 'row',
    marginTop: 20,
    marginLeft: 25,
    justifyContent: 'space-between',
  },
  TextFor: {
    fontSize: scale(12),
    fontFamily: Fonts.bold,
    lineHeight: 20,
  },
  Text1: {
    fontSize: scale(12),
    fontStyle: 'italic',
    color: Color.textGray,
    lineHeight: 25,
    paddingLeft: 30,
  },
});
