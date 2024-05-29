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
import VendorHomeScreen from '../Screens/VendorHomeScreen';
import MyHolidays from '../Screens/MyHolidays';
import AddHoliday from '../Screens/AddHoliday';
import MyProfile from '../Screens/MyProfile';
import MyProfileEdit from '../Screens/MyProfileEdit';
import MyVenueVendorScreen from '../Screens/MyVenueVendorScreen';
import MyBookingVendor from '../Screens/MyBookingVendor';
import VendorMyOfferScreen from '../Screens/VendorMyOfferScreen';
import AddOffer from '../Screens/AddOffer';
import VendorProfileEdit from '../Screens/VendorProfileEdit';
import BeTrainerScreen from '../Screens/BeTrainerScreen';
import FindTrainer from '../Screens/FindTrainer';
import HotOfferScreen from '../Screens/HotOfferScreen';
import ReferEarnScreen from '../Screens/ReferEarnScreen';
import SportsShopScreen from '../Screens/SportsShopScreen';
import UPcoinScreen from '../Screens/UPcoinScreen';
import ViewProfileScreen from '../Screens/ViewProfileScreen';
import BusinessAnalytics from '../Screens/BusinessAnalytics';
import AboutApp from '../Screens/AboutApp';

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
        {/* vendor flow */}
        <Stack.Screen name="VendorHomeScreen" component={VendorHomeScreen} />
        <Stack.Screen name="MyHolidays" component={MyHolidays} />
        <Stack.Screen name="AddHoliday" component={AddHoliday} />
        <Stack.Screen name="MyProfile" component={MyProfile} />
        <Stack.Screen name="MyProfileEdit" component={MyProfileEdit} />
        <Stack.Screen
          name="MyVenueVendorScreen"
          component={MyVenueVendorScreen}
        />
        <Stack.Screen name="MyBookingVendor" component={MyBookingVendor} />
        <Stack.Screen
          name="VendorMyOfferScreen"
          component={VendorMyOfferScreen}
        />
        <Stack.Screen name="AddOffer" component={AddOffer} />
        <Stack.Screen name="VendorProfileEdit" component={VendorProfileEdit} />
        <Stack.Screen name="BeTrainerScreen" component={BeTrainerScreen} />
        <Stack.Screen name="FindTrainer" component={FindTrainer} />
        <Stack.Screen name="HotOfferScreen" component={HotOfferScreen} />
        <Stack.Screen name="ReferEarnScreen" component={ReferEarnScreen} />
        <Stack.Screen name="SportsShopScreen" component={SportsShopScreen} />
        <Stack.Screen name="UPcoinScreen" component={UPcoinScreen} />
        <Stack.Screen name="ViewProfileScreen" component={ViewProfileScreen} />
        <Stack.Screen name="BusinessAnalytics" component={BusinessAnalytics} />
        <Stack.Screen name="AboutApp" component={AboutApp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
