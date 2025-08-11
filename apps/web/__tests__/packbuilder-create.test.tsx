import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PackBuilder from '../components/PackBuilder';

jest.mock('../components/AuthContext', () => ({
  useAuth: () => ({ user: { userId: 'u1', isCreator: true }, loading: false, isAuthenticated: true }),
}));

describe('PackBuilder create pack', () => {
  beforeEach(() => {
    // First call: POST /api/creator/packs, second: GET /api/creator/packs/:id/cards
    // @ts-ignore
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ packId: 'new-pack-id' }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ cards: [] }) });
  });

  it('POSTs creatorId and title, then updates packId field', async () => {
    render(<PackBuilder />);
    const titleInput = screen.getByPlaceholderText('New pack title');
    fireEvent.change(titleInput, { target: { value: 'My Pack' } });
    fireEvent.click(screen.getByText('Create Pack'));

    await waitFor(() => expect((global.fetch as jest.Mock)).toHaveBeenCalled());
    const calls = (global.fetch as jest.Mock).mock.calls;
    const [url, opts] = calls[0];
    expect(url).toBe('/api/creator/packs');
    expect(opts.method).toBe('POST');
    const body = JSON.parse(opts.body);
    expect(body).toEqual({ creatorId: 'u1', title: 'My Pack' });

    // After creation, the component fetches cards for the new id
    await waitFor(() => expect((global.fetch as jest.Mock).mock.calls.length).toBeGreaterThan(1));
    const second = (global.fetch as jest.Mock).mock.calls.find(([url]) => typeof url === 'string' && url.includes('/api/creator/packs/new-pack-id/cards')) as any;
    expect(second).toBeTruthy();

    // The pack id input should reflect the new id
    const packInput = screen.getByPlaceholderText('e.g. p1') as HTMLInputElement;
    expect(packInput.value).toBe('new-pack-id');
  });
});
