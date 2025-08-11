import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PackBuilder from '../components/PackBuilder';

jest.mock('../components/AuthContext', () => ({
  useAuth: () => ({ user: { userId: 'u1' } }),
}));

describe('PackBuilder autosave and error state', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('autosaves current cards after debounce when packId is set', async () => {
    // @ts-ignore
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    render(<PackBuilder />);

    // Set pack id
    const packInput = screen.getByPlaceholderText('e.g. p1');
    fireEvent.change(packInput, { target: { value: 'p1' } });

    // Advance debounce timer
    jest.advanceTimersByTime(900);

    await waitFor(() => expect((global.fetch as jest.Mock)).toHaveBeenCalled());
    const calls = (global.fetch as jest.Mock).mock.calls;
    const putCall = calls.find(([, opts]) => opts && opts.method === 'PUT');
    expect(putCall).toBeTruthy();
    expect(putCall![0]).toBe('/api/creator/packs/p1/cards');
    const body = JSON.parse(putCall![1].body);
    expect(body.cards).toContain('Card 1');
  });

  it('shows error state when autosave fails', async () => {
    // First autosave attempt responds not ok
    // @ts-ignore
    global.fetch = jest.fn().mockResolvedValue({ ok: false, json: async () => ({}) });
    render(<PackBuilder />);
    const packInput = screen.getByPlaceholderText('e.g. p1');
    fireEvent.change(packInput, { target: { value: 'p2' } });

    jest.advanceTimersByTime(900);
    await waitFor(() => expect((global.fetch as jest.Mock)).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByText(/Error:/)).toBeInTheDocument());
  });
});
