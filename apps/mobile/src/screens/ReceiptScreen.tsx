import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import type { PurchaseStatus } from '../lib/mockPurchase';
import { simulateStatus } from '../lib/mockPurchase';

export default function ReceiptScreen({ route }: any) {
  const { packId, purchaseId, amountCents } = route.params || {};
  const [status, setStatus] = useState<PurchaseStatus>('pending');

  useEffect(() => {
    simulateStatus(setStatus);
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, marginBottom: 12 }}>Receipt</Text>
      <Text>Purchase ID: {purchaseId}</Text>
      <Text>Pack: {packId}</Text>
      <Text>Amount: ${(amountCents/100).toFixed(2)}</Text>
      <Text accessibilityLiveRegion="polite" style={{ marginTop: 12 }}>Status: {status === 'pending' ? 'Pending…' : status === 'success' ? 'Purchase complete' : 'Purchase failed'}</Text>
    </View>
  );
}
