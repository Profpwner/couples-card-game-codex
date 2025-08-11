import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PackBuilder from '../components/PackBuilder';

jest.mock('../components/AuthContext', () => ({
  useAuth: () => ({ user: { userId: 'u1' } }),
}));

describe('PackBuilder partial patch on edit', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('PATCHes edited card and skips next autosave PUT', async () => {
    // @ts-ignore
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    render(<PackBuilder />);

    const packInput = screen.getByPlaceholderText('e.g. p1');
    fireEvent.change(packInput, { target: { value: 'p1' } });

    // Edit first card
    fireEvent.click(screen.getAllByText('Edit')[0]);
    const editInput = screen.getByLabelText('Edit card text');
    fireEvent.change(editInput, { target: { value: 'Edited' } });
    fireEvent.click(screen.getByText('Apply'));

    await waitFor(() => expect((global.fetch as jest.Mock)).toHaveBeenCalled());
    const calls = (global.fetch as jest.Mock).mock.calls;
    // Find the PATCH call
    const patchCall = calls.find(([, opts]) => opts && opts.method === 'PATCH');
    expect(patchCall).toBeTruthy();
    expect(patchCall![0]).toBe('/api/creator/packs/p1/cards');
    const body = JSON.parse(patchCall![1].body);
    expect(body).toMatchObject({ index: 0, content: 'Edited' });

    // Advance timers to trigger autosave; it should be skipped once
    jest.advanceTimersByTime(900);
    const callsAfter = (global.fetch as jest.Mock).mock.calls;
    // Should not issue a PUT autosave immediately after PATCH
    const putAfter = callsAfter.find(([, opts]) => opts && opts.method === 'PUT');
    expect(putAfter).toBeUndefined();
  });
});
