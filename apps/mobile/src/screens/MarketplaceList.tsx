import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, RefreshControl } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { fetchPacks, PackSummary } from '../lib/api';

type Props = NativeStackScreenProps<RootStackParamList, 'MarketplaceList'>;

export default function MarketplaceList({ navigation }: Props) {
  const [packs, setPacks] = useState<PackSummary[]>([]);
  const [q, setQ] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [sort, setSort] = useState<'newest' | 'title'>('newest');

  const load = async () => {
    try {
      const data = await fetchPacks();
      setPacks(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    let items = packs;
    if (term) items = items.filter(p => p.title.toLowerCase().includes(term));
    if (sort === 'title') items = [...items].sort((a,b) => a.title.localeCompare(b.title));
    return items;
  }, [packs, q, sort]);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 8 }}>Marketplace</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <TextInput
          placeholder="Search packs"
          value={q}
          onChangeText={setQ}
          style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 6 }}
        />
        {q.length > 0 && (
          <TouchableOpacity onPress={() => setQ('')} style={{ marginLeft: 8, paddingVertical: 8, paddingHorizontal: 12, backgroundColor: '#eee', borderRadius: 6 }}>
            <Text>Clear</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={{ flexDirection: 'row', marginBottom: 8 }}>
        <TouchableOpacity onPress={() => setSort('newest')} style={{ marginRight: 8, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12, backgroundColor: sort === 'newest' ? '#ddd' : 'transparent' }}>
          <Text style={{ color: '#333', fontWeight: sort === 'newest' ? '700' : '400' }}>Newest</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSort('title')} style={{ paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12, backgroundColor: sort === 'title' ? '#ddd' : 'transparent' }}>
          <Text style={{ color: '#333', fontWeight: sort === 'title' ? '700' : '400' }}>Title</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filtered}
        keyExtractor={item => item.pack_id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} />}
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
