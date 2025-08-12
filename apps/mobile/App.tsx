import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import MarketplaceList from './src/screens/MarketplaceList';
import MarketplaceDetail from './src/screens/MarketplaceDetail';
import PurchaseScreen from './src/screens/PurchaseScreen';

export type RootStackParamList = {
  Home: undefined;
  MarketplaceList: undefined;
  MarketplaceDetail: { packId: string };
  Purchase: { packId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="MarketplaceList" component={MarketplaceList} />
        <Stack.Screen name="MarketplaceDetail" component={MarketplaceDetail} />
        <Stack.Screen name="Purchase" component={PurchaseScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}