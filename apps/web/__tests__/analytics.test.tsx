import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AnalyticsPage from '../pages/analytics';

jest.mock('../components/AuthContext', () => ({
  RequireAuth: ({ children }: any) => <>{children}</>,
  useAuth: () => ({ user: { userId: 'u1' }, loading: false, isAuthenticated: true }),
}));

describe('Analytics page', () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = jest.fn()
      // sales
      .mockResolvedValueOnce({ ok: true, json: async () => ({ packsSold: 7, revenueCents: 9900 }) })
      // engagement
      .mockResolvedValueOnce({ ok: true, json: async () => ({ readers: 256, avgSessionSec: 312 }) });
  });

  it('renders sales and engagement metrics', async () => {
    render(<AnalyticsPage />);
    await waitFor(() => expect(screen.getByText(/Packs sold:/)).toBeInTheDocument());
    expect(screen.getByText('Packs sold: 7')).toBeInTheDocument();
    expect(screen.getByText('Revenue: $99.00')).toBeInTheDocument();
    expect(screen.getByText('Readers: 256')).toBeInTheDocument();
    expect(screen.getByText('Avg session: 312s')).toBeInTheDocument();
  });
});

