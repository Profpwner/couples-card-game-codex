import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import PackBuilder from '../components/PackBuilder';

jest.mock('../components/AuthContext', () => ({
  useAuth: () => ({ user: { userId: 'u1' } }),
}));

describe('PackBuilder', () => {
  it('renders initial cards', () => {
    render(<PackBuilder />);
    expect(screen.getByText('Card 1')).toBeInTheDocument();
    expect(screen.getByText('Card 2')).toBeInTheDocument();
    expect(screen.getByText('Card 3')).toBeInTheDocument();
  });

  it('opens and closes Add Card modal', () => {
    render(<PackBuilder />);
    fireEvent.click(screen.getByText('Add Card'));
    expect(screen.getByText('Add a new card')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Close'));
    expect(screen.queryByText('Add a new card')).toBeNull();
  });
});
