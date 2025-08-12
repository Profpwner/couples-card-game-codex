import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import MarketplaceList from '../src/screens/MarketplaceList';
import { NavigationContainer } from '@react-navigation/native';
import * as api from '../src/lib/api';

jest.mock('../src/lib/api');

describe('MarketplaceList', () => {
  it('renders a list of packs', async () => {
    (api.fetchPacks as jest.Mock).mockResolvedValue([
      { pack_id: '1', title: 'Pack One' },
      { pack_id: '2', title: 'Pack Two' },
    ]);
    const { getByText } = render(
      <NavigationContainer>
        <MarketplaceList navigation={{ navigate: jest.fn() } as any} />
      </NavigationContainer>
    );
    await waitFor(() => expect(getByText('Pack One')).toBeTruthy());
    expect(getByText('Pack Two')).toBeTruthy();
  });
});