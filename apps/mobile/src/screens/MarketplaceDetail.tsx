import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Button, ScrollView, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { fetchPackDetail, PackDetail, Review, fetchReviews, postReview, followCreator, unfollowCreator, getFollowStatus } from '../lib/api';

type Props = NativeStackScreenProps<RootStackParamList, 'MarketplaceDetail'>;

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return <Text accessibilityLabel={`Rating ${full} of 5`}>{'★'.repeat(full)}{'☆'.repeat(5-full)}</Text>;
}

export default function MarketplaceDetail({ route }: Props) {
  const { packId } = route.params;
  const [pack, setPack] = useState<PackDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetchPackDetail(packId)
      .then(p => { if (alive) setPack(p); })
      .catch(e => { if (alive) setError(e.message || 'Failed to load'); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [packId]);

  const userId = 'demo-user'; // TODO: replace with real auth context
  const [reviews, setReviews] = useState<Review[]>([]);
  const [sort, setSort] = useState<'newest' | 'highest' | 'lowest'>('newest');
  const [visible, setVisible] = useState(5);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [followBusy, setFollowBusy] = useState(false);
  const [reviewBusy, setReviewBusy] = useState(false);

  useEffect(() => {
    fetchReviews(packId).then(setReviews).catch(console.error);
  }, [packId]);

  useEffect(() => {
    if (!pack?.creator_id) return;
    getFollowStatus(pack.creator_id, userId).then(setIsFollowing).catch(console.error);
  }, [pack?.creator_id]);

  const handleSubmitReview = async () => {
    try {
      setReviewBusy(true);
      const newRev = await postReview(packId, userId, rating, reviewText);
      setReviews([newRev, ...reviews]);
      setReviewText('');
      // Reset visible to show new item and give a lightweight feedback text
      setVisible(v => Math.max(v, 5));
    } catch (e) {
      console.error(e);
    } finally {
      setReviewBusy(false);
    }
  };

  const toggleFollow = async () => {
    try {
      if (!pack?.creator_id) return;
      setFollowBusy(true);
      if (isFollowing) await unfollowCreator(pack.creator_id, userId);
      else await followCreator(pack.creator_id, userId);
      setIsFollowing(!isFollowing);
    } catch (e) {
      console.error(e);
    } finally {
      setFollowBusy(false);
    }
  };

  const avgRating = useMemo(() => {
    if (!reviews.length) return 0;
    return reviews.reduce((a, b) => a + (b.rating || 0), 0) / reviews.length;
  }, [reviews]);

  const sorted = useMemo(() => {
    const arr = [...reviews];
    if (sort === 'highest') arr.sort((a,b) => b.rating - a.rating || Date.parse(b.created_at) - Date.parse(a.created_at));
    else if (sort === 'lowest') arr.sort((a,b) => a.rating - b.rating || Date.parse(b.created_at) - Date.parse(a.created_at));
    else arr.sort((a,b) => Date.parse(b.created_at) - Date.parse(a.created_at));
    return arr;
  }, [reviews, sort]);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {loading && <ActivityIndicator accessibilityLabel="Loading" />}
      {error && <Text style={{ color: 'crimson' }}>Error: {error}</Text>}
      <Text style={{ fontSize: 24, marginBottom: 8 }}>
        {pack?.title ?? 'Loading...'}
      </Text>
      {pack?.description ? <Text style={{ color: '#444', marginBottom: 8 }}>{pack.description}</Text> : null}
      <View style={{ marginBottom: 8 }}>
        <Text>Average Rating: <Stars rating={avgRating} /> ({reviews.length})</Text>
      </View>
      <Button title={isFollowing ? 'Unfollow Creator' : 'Follow Creator'} disabled={followBusy} onPress={toggleFollow} />

      <Text style={{ fontSize: 20, marginTop: 16 }}>Your Review</Text>
      <Text>Rating: {rating}</Text>
      <Slider
        minimumValue={1}
        maximumValue={5}
        step={1}
        value={rating}
        onValueChange={setRating}
        style={{ marginVertical: 8 }}
      />
      <TextInput
        placeholder="Write your review..."
        value={reviewText}
        onChangeText={setReviewText}
        style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 8 }}
      />
      <Button title="Submit Review" disabled={reviewBusy} onPress={handleSubmitReview} />

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16, marginBottom: 8 }}>
        <Text style={{ fontSize: 20, marginRight: 12 }}>Reviews</Text>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => { setSort('newest'); setVisible(5); }} style={{ marginRight: 8 }}>
            <Text style={{ color: sort === 'newest' ? '#333' : '#888' }}>Newest</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setSort('highest'); setVisible(5); }} style={{ marginRight: 8 }}>
            <Text style={{ color: sort === 'highest' ? '#333' : '#888' }}>Highest</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setSort('lowest'); setVisible(5); }}>
            <Text style={{ color: sort === 'lowest' ? '#333' : '#888' }}>Lowest</Text>
          </TouchableOpacity>
        </View>
      </View>
      {sorted.slice(0, visible).map(r => (
        <View key={r.review_id} style={{ marginVertical: 8 }}>
          <Text style={{ fontWeight: 'bold' }}>Rating: <Stars rating={r.rating} /></Text>
          {r.review_text ? <Text>{r.review_text}</Text> : null}
          <Text style={{ fontSize: 12, color: '#666' }}>{new Date(r.created_at).toLocaleString()}</Text>
        </View>
      ))}
      {visible < sorted.length && (
        <Button title="Load more" onPress={() => setVisible(v => v + 5)} />
      )}
    </ScrollView>
  );
}
