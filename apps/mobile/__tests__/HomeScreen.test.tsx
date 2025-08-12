import React from 'react';
import { render } from '@testing-library/react-native';
import HomeScreen from '../src/screens/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';

describe('HomeScreen', () => {
  it('renders title and button', () => {
    const tree = render(
      <NavigationContainer>
        <HomeScreen navigation={{ navigate: jest.fn() } as any} />
      </NavigationContainer>
    );
    expect(tree.getByText('Home Screen (Placeholder)')).toBeTruthy();
    expect(tree.getByText('View Marketplace')).toBeTruthy();
  });
});