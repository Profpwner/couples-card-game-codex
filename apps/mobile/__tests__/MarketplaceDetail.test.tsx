import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import MarketplaceDetail from '../src/screens/MarketplaceDetail';
import * as api from '../src/lib/api';

jest.mock('../src/lib/api');

describe('MarketplaceDetail', () => {
  const mockPack = {
    pack_id: 'p1',
    creator_id: 'c1',
    title: 'Pack One',
    description: 'Desc',
    created_at: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    (api.fetchPackDetail as jest.Mock).mockResolvedValue(mockPack);
    (api.fetchReviews as jest.Mock).mockResolvedValue([]);
    (api.getFollowStatus as jest.Mock).mockResolvedValue(false);
    (api.followCreator as jest.Mock).mockResolvedValue(undefined);
    (api.unfollowCreator as jest.Mock).mockResolvedValue(undefined);
  });

  it('loads pack detail and uses creator_id for follow status and actions', async () => {
    const { getByText } = render(
      // Provide minimal props for NativeStackScreenProps
      <MarketplaceDetail
        route={{ key: 'detail', name: 'MarketplaceDetail', params: { packId: 'p1' } } as any}
        navigation={{} as any}
      />
    );

    await waitFor(() => expect(getByText('Pack One')).toBeTruthy());

    expect(api.fetchPackDetail).toHaveBeenCalledWith('p1');
    expect(api.fetchReviews).toHaveBeenCalledWith('p1');
    // Follow status should be checked with creator_id
    await waitFor(() => expect(api.getFollowStatus).toHaveBeenCalledWith('c1', expect.any(String)));

    // Initially not following -> button should allow Follow Creator
    const button = getByText('Follow Creator');
    fireEvent.press(button);
    expect(api.followCreator).toHaveBeenCalledWith('c1', expect.any(String));
  });
});
