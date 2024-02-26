import {View, Text} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

//import screens
import HomeScreen from '../Screens/HomeScreen';
import SplashScreen from '../Screens/SplashScreen';
import SignUpScreen from '../Screens/SignUpScreen';
import LoginScreen from '../Screens/LoginScreen';
import OTPverifyScreen from '../Screens/OTPverifyScreen';
import BookNowScreen from '../Screens/BookNowScreen';
import BookVenueScreen from '../Screens/BookVenueScreen';
import FeedBackScreen from '../Screens/FeedBackScreen';
import HelpScreen from '../Screens/HelpScreen';
import HostMatchScreen from '../Screens/HostMatchScreen';
import LoginInfoScreen from '../Screens/LoginInfoScreen';
import MyAreaScreen from '../Screens/MyAreaScreen';
import MyBookingScreen from '../Screens/MyBookingScreen';
import MyConnectionScreen from '../Screens/MyConnectionScreen';
import MyMatchesScreen from '../Screens/MyMatchesScreen';
import MySkillScreen from '../Screens/MySkillScreen';
import MySportScreen from '../Screens/MySportScreen';
import RateFriendScreen from '../Screens/RateFriendScreen';
import VenueDetailScreen from '../Screens/VenueDetailScreen';

const Stack = createNativeStackNavigator();

const Navigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="OTPverifyScreen" component={OTPverifyScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="BookNowScreen" component={BookNowScreen} />
        <Stack.Screen name="BookVenueScreen" component={BookVenueScreen} />
        <Stack.Screen name="FeedBackScreen" component={FeedBackScreen} />
        <Stack.Screen name="HelpScreen" component={HelpScreen} />
        <Stack.Screen name="HostMatchScreen" component={HostMatchScreen} />
        <Stack.Screen name="LoginInfoScreen" component={LoginInfoScreen} />
        <Stack.Screen name="MyAreaScreen" component={MyAreaScreen} />
        <Stack.Screen name="MyBookingScreen" component={MyBookingScreen} />
        <Stack.Screen
          name="MyConnectionScreen"
          component={MyConnectionScreen}
        />
        <Stack.Screen name="MyMatchesScreen" component={MyMatchesScreen} />
        <Stack.Screen name="MySkillScreen" component={MySkillScreen} />
        <Stack.Screen name="RateFriendScreen" component={RateFriendScreen} />
        <Stack.Screen name="MySportScreen" component={MySportScreen} />
        <Stack.Screen name="VenueDetailScreen" component={VenueDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
