import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PackBuilder from '../components/PackBuilder';

jest.mock('../components/AuthContext', () => ({
  useAuth: () => ({ user: { userId: 'u1' } }),
}));

describe('PackBuilder add (POST) and delete (DELETE) with partial updates', () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
  });

  it('POSTs when adding a new card and packId is set', async () => {
    render(<PackBuilder />);
    const packInput = screen.getByPlaceholderText('e.g. p1');
    fireEvent.change(packInput, { target: { value: 'p1' } });

    fireEvent.click(screen.getByText('Add Card'));
    const input = screen.getByPlaceholderText('Type card text');
    fireEvent.change(input, { target: { value: 'API Card' } });
    fireEvent.click(screen.getByText('Add'));

    await waitFor(() => expect((global.fetch as jest.Mock)).toHaveBeenCalled());
    const calls = (global.fetch as jest.Mock).mock.calls;
    const postCall = calls.find(([, opts]) => opts && opts.method === 'POST');
    expect(postCall).toBeTruthy();
    const [url, opts] = postCall!;
    expect(url).toBe('/api/creator/packs/p1/cards');
    const body = JSON.parse(opts.body);
    expect(body).toMatchObject({ index: expect.any(Number), content: 'API Card' });
  });

  it('DELETEs when removing a card and packId is set', async () => {
    render(<PackBuilder />);
    const packInput = screen.getByPlaceholderText('e.g. p1');
    fireEvent.change(packInput, { target: { value: 'p1' } });

    // Delete the first card
    fireEvent.click(screen.getAllByText('Delete')[0]);
    await waitFor(() => expect((global.fetch as jest.Mock)).toHaveBeenCalled());
    const delCall = (global.fetch as jest.Mock).mock.calls.find(([, opts]) => opts && opts.method === 'DELETE');
    expect(delCall).toBeTruthy();
    const [url, opts] = delCall!;
    expect(url).toContain('/api/creator/packs/p1/cards?index=');
  });
});
