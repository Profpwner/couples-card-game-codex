import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PackBuilder from '../components/PackBuilder';

jest.mock('../components/AuthContext', () => ({
  useAuth: () => ({ user: { userId: 'u1' } }),
}));

describe('PackBuilder save cards', () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = jest.fn()
      // load cards for packId (empty)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ cards: [] }) })
      // save response
      .mockResolvedValueOnce({ ok: true, json: async () => ({ ok: true }) });
  });

  it('sends PUT to /api/creator/packs/:id/cards with card content array', async () => {
    render(<PackBuilder />);
    // Enter pack id
    const input = screen.getByPlaceholderText('e.g. p1');
    fireEvent.change(input, { target: { value: 'p123' } });
    // Click Save
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => expect((global.fetch as jest.Mock)).toHaveBeenCalled());
    const calls = (global.fetch as jest.Mock).mock.calls;
    // The second call is the PUT save
    const [url, opts] = calls[1];
    expect(url).toBe('/api/creator/packs/p123/cards');
    expect(opts.method).toBe('PUT');
    const body = JSON.parse(opts.body);
    expect(Array.isArray(body.cards)).toBe(true);
    expect(body.cards).toEqual(['Card 1', 'Card 2', 'Card 3']);
  });
});
