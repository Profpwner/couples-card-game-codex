import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { fetchPacks, PackSummary } from '../lib/api';

type Props = NativeStackScreenProps<RootStackParamList, 'MarketplaceList'>;

export default function MarketplaceList({ navigation }: Props) {
  const [packs, setPacks] = useState<PackSummary[]>([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    fetchPacks().then(setPacks).catch(console.error);
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return packs;
    return packs.filter(p => p.title.toLowerCase().includes(term));
  }, [packs, q]);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 8 }}>Marketplace</Text>
      <TextInput
        placeholder="Search packs"
        value={q}
        onChangeText={setQ}
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 6, marginBottom: 8 }}
      />
      <FlatList
        data={filtered}
        keyExtractor={item => item.pack_id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('MarketplaceDetail', { packId: item.pack_id })}
          >
            <Text style={{ fontSize: 18, paddingVertical: 8 }}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
