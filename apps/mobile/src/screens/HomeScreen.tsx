import React, { useEffect } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Home Screen (Placeholder)</Text>
      <Button title="View Marketplace" onPress={() => navigation.navigate('MarketplaceList')} />
    </ScrollView>
  );
}