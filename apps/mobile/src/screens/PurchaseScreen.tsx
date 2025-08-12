import React, { useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';

export default function PurchaseScreen({ route, navigation }: any) {
  const { packId } = route.params || { packId: 'unknown' };
  const [status, setStatus] = useState('');

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, marginBottom: 12 }}>Purchase Pack</Text>
      <Text style={{ marginBottom: 8 }}>Pack: {packId}</Text>
      <Text style={{ marginBottom: 16 }}>Price: $4.99</Text>
      <Button title="Approve" onPress={() => { setStatus('Purchased!'); Alert.alert('Success', 'Purchase complete'); }} />
      <View style={{ height: 8 }} />
      <Button title="Cancel" color="#888" onPress={() => { setStatus('Canceled'); navigation.goBack?.(); }} />
      {status ? <Text accessibilityLiveRegion="polite" style={{ marginTop: 12 }}>{status}</Text> : null}
    </View>
  );
}
