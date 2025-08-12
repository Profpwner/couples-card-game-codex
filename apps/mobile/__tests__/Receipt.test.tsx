import React from 'react';
import { render, act } from '@testing-library/react-native';
import ReceiptScreen from '../src/screens/ReceiptScreen';

jest.useFakeTimers();

describe('ReceiptScreen', () => {
  it('transitions from pending to success', () => {
    const { getByText } = render(<ReceiptScreen route={{ params: { purchaseId: 'pc_1', packId: 'p1', amountCents: 499 } }} />);
    expect(getByText(/Status: Pending/i)).toBeTruthy();
    act(() => { jest.advanceTimersByTime(1500); });
    expect(getByText(/Purchase complete/i)).toBeTruthy();
  });
});
