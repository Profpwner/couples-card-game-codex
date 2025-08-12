import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PurchaseScreen from '../src/screens/PurchaseScreen';

describe('PurchaseScreen', () => {
  it('approves and announces purchase', () => {
    const { getByText } = render(<PurchaseScreen route={{ params: { packId: 'p1' } }} navigation={{ goBack: jest.fn() }} />);
    fireEvent.press(getByText('Approve'));
    expect(getByText('Purchased!')).toBeTruthy();
  });

  it('cancels and goes back', () => {
    const goBack = jest.fn();
    const { getByText } = render(<PurchaseScreen route={{ params: { packId: 'p1' } }} navigation={{ goBack }} />);
    fireEvent.press(getByText('Cancel'));
    expect(goBack).toHaveBeenCalled();
  });
});
