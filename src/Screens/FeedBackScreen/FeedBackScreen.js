import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import Color from '../../Constants/Color';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import {scale} from '../../utlis/Scale';
import IMAGES from '../../Assets/Icons/index';

const FeedBackScreen = ({navigation}) => {
  const [value, setValue] = useState('');
  return (
    <View style={styles.main}>
      <CustomHeader
        heading={'Feedback'}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.master}>
        <View>
          <View style={styles.heading}>
            <Image source={IMAGES.LogoText} style={styles.logo} />
          </View>
          <Text style={styles.headingText}>
            Your feedback helps us to understand,{'\n'}what we do well and where
            we can improve.
          </Text>
          <TextInput
            value={value}
            onChangeText={text => {
              setValue(text);
            }}
            multiline
            style={styles.input}
            placeholder={'Please enter your feedback here.'}
          />
        </View>
        <TouchableOpacity onPress={() => {}} style={styles.loginBtn}>
          <Text style={styles.btnText}>SEND FEEDBACK</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FeedBackScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  master: {
    flex: 1,
    backgroundColor: Color.background,
    paddingHorizontal: scale(20),
    justifyContent: 'space-between',
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: scale(20),
    paddingVertical: scale(20),
  },
  headingText: {
    fontSize: scale(14),
    color: Color.black,
    fontWeight: '600',
  },
  logo: {
    height: scale(60),
    width: scale(90),
    resizeMode: 'contain',
    tintColor: Color.icon,
  },
  loginBtn: {
    backgroundColor: Color.icon,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(12),
    borderRadius: scale(10),
    alignSelf: 'center',
    marginVertical: scale(20),
  },
  btnText: {
    color: Color.background,
    fontSize: scale(14),
    fontWeight: '800',
    letterSpacing: 2,
  },
  input: {
    color: Color.black,
    fontSize: scale(14),
    fontWeight: '500',
    height: scale(200),
    borderRadius: 10,
    backgroundColor: Color.white,
    textAlignVertical: 'top',
    padding: scale(10),
    elevation: 6,
    marginTop: scale(15),
  },
});
