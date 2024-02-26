import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import Color from '../../Constants/Color';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import {scale} from '../../utlis/Scale';
import IMAGES from '../../Assets/Icons/index';

const MyAreaScreen = ({navigation}) => {
  const options = [
    {id: 1, label: 'Kaloor'},
    {id: 2, label: 'Nettoor'},
    {id: 3, label: 'Kadavantra'},
    {id: 4, label: 'Palluruthy'},
    {id: 5, label: 'Ernakulam'},
    {id: 6, label: 'Fort Kochi'},
    {id: 7, label: 'Thrissur'},
    {id: 8, label: 'Munnar'},
    {id: 9, label: 'Ernakulam'},
    {id: 10, label: 'Fort Kochi'},
    {id: 11, label: 'Thrissur'},
    {id: 12, label: 'Munnar'},
  ];
  const [selectedOptions, setSelectedOptions] = useState([]);

  const toggleOption = optionId => {
    if (selectedOptions.includes(optionId)) {
      setSelectedOptions(selectedOptions.filter(id => id !== optionId));
    } else {
      setSelectedOptions([...selectedOptions, optionId]);
    }
  };

  const renderItem = ({item}) => {
    const isSelected = selectedOptions.includes(item.id);

    return (
      <TouchableOpacity
        style={[styles.optionItem]}
        onPress={() => toggleOption(item.id)}>
        <Text style={styles.optionLabel}>{item.label}</Text>
        <Image
          source={isSelected ? IMAGES.Checked : IMAGES.Unchecked}
          style={isSelected ? styles.checkedIcon : styles.unCheckedIcon}
        />
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.main}>
      <CustomHeader
        heading={'My Areas'}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.master}>
        <Text style={styles.headingText}>Choose Area/Place</Text>
        <FlatList
          data={options}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          style={{flex: 1}}
          contentContainerStyle={{paddingTop: scale(20)}}
          showsVerticalScrollIndicator={false}
        />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('OTPverifyScreen');
          }}
          style={styles.loginBtn}>
          <Text style={styles.btnText}>FINISH</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MyAreaScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  master: {
    flex: 1,
    backgroundColor: Color.background,
    paddingHorizontal: scale(20),
    paddingVertical: scale(20),
  },
  optionItem: {
    paddingHorizontal: scale(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: scale(15),
  },

  optionLabel: {
    fontSize: scale(14),
    color: Color.black,
    fontWeight: '600',
  },
  loginBtn: {
    backgroundColor: Color.icon,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: scale(12),
    borderRadius: scale(10),
    alignSelf: 'center',
    marginTop: scale(20),
  },
  btnText: {
    color: Color.background,
    fontSize: scale(14),
    fontWeight: '800',
    letterSpacing: 2,
  },
  headingText: {
    fontSize: scale(16),
    color: Color.black,
    fontWeight: '600',
  },
  checkedIcon: {
    height: scale(20),
    width: scale(20),
    resizeMode: 'contain',
    tintColor: Color.subBg,
  },
  unCheckedIcon: {
    height: scale(20),
    width: scale(20),
    resizeMode: 'contain',
    tintColor: Color.lightGrey,
  },
});
