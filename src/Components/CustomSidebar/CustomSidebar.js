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
            <View style={styles.Header}>
              <Image source={CNPLogo} style={styles.Logo} />
            </View>
            <View style={styles.allView}>
              <View style={styles.SupportView}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <QuestionMark />
                  <Text
                    style={[
                      styles.headingText,
                      {paddingHorizontal: 10, textAlign: 'center'},
                    ]}>
                    Help and Support
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(
                      'https://360.articulate.com/review/content/a8754d04-2a84-4552-87f9-46a3af5101b8/review',
                    );
                  }}>
                  <View style={styles.View1}>
                    <Text style={styles.TextForVideo}>
                      Interactive Training Video
                    </Text>
                    <Text style={styles.TextForArrow}>{'>'}</Text>
                  </View>
                </TouchableOpacity>
                <View accessible style={{width: 240}}>
                  <Text style={styles.TextForLink}>
                    Click on this link to access quick and user-friendly
                    tutorials on ‘how to’ perform various tasks with ease.
                  </Text>
                </View>
                <View accessible style={styles.View2}>
                  <Text style={styles.TextFor}>
                    Can’t find what you are looking for?
                  </Text>
                </View>
                <View accessible style={{width: 240}}>
                  <Text style={styles.Text1}>
                    Contact your Food Service Administrator for further
                    assistance.
                  </Text>
                </View>
              </View>

              <View>
                <View
                  accessible
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
                  <Text
                    style={{
                      alignSelf: 'flex-start',
                      marginHorizontal: 20,
                    }}>
                    {DeviceInfo.getVersion()
                      ? DeviceInfo.getVersion()
                      : '1.0.0'}
                  </Text>
                </View>
                <View
                  accessible
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginVertical: 10,
                  }}>
                  <Text
                    style={{
                      alignSelf: 'flex-start',
                      marginHorizontal: 20,
                    }}>
                    Environment :
                  </Text>
                  <Text
                    style={{
                      alignSelf: 'flex-start',
                      marginHorizontal: 20,
                    }}>
                    {apiConfigs.LOCAL_SERVER_API_URL ==
                    'https://cnpapidev.azurewebsites.net/api/v1.0'
                      ? 'Development'
                      : 'QA'}
                  </Text>
                </View>
                <TouchableOpacity
                  accessible
                  accessibilityLabel="Logout"
                  accessibilityRole="button"
                  accessibilityHint="Double tap to select"
                  style={styles.button}
                  onPress={() => {
                    setmodalVisible(true);
                  }}>
                  <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
      <LogoutModal
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
      />
    </Modal>
  );
};

export default CustomSidebar;

const styles = StyleSheet.create({
  Modal: {
    flex: 1,
    backgroundColor: COLORS.loaderBackground,
  },
  main: {
    backgroundColor: COLORS.white,
    width: '78%',
    height: '100%',
  },
  allView: {
    backgroundColor: COLORS.white,
    justifyContent: 'space-between',
    flex: 1,
  },
  Header: {
    height: '14%',
    backgroundColor: COLORS.green,
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
    fontFamily: FONTS.bold_700,
    color: COLORS.textBlack,
  },
  button: {
    backgroundColor: COLORS.green,
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
    fontFamily: FONTS.semiBold_600,
    color: COLORS.white,
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
    fontFamily: FONTS.bold_700,
    lineHeight: 20,
  },
  TextForArrow: {
    fontSize: scale(15),
    fontFamily: FONTS.bold_700,
    right: 5,
  },
  TextForLink: {
    fontSize: scale(12),
    fontStyle: 'italic',
    color: COLORS.textGray,
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
    fontFamily: FONTS.bold_700,
    lineHeight: 20,
  },
  Text1: {
    fontSize: scale(12),
    fontStyle: 'italic',
    color: COLORS.textGray,
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
    fontFamily: FONTS.bold_700,
    lineHeight: 20,
  },
  TextForArrow: {
    fontSize: scale(15),
    fontFamily: FONTS.bold_700,
    right: 5,
  },
  TextForLink: {
    fontSize: scale(12),
    fontStyle: 'italic',
    color: COLORS.textGray,
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
    fontFamily: FONTS.bold_700,
    lineHeight: 20,
  },
  Text1: {
    fontSize: scale(12),
    fontStyle: 'italic',
    color: COLORS.textGray,
    lineHeight: 25,
    paddingLeft: 30,
  },
});
