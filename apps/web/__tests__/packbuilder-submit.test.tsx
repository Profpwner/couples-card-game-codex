import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import PackBuilder from '../components/PackBuilder';

jest.mock('../components/AuthContext', () => ({
  useAuth: () => ({ user: { userId: 'u1' } }),
}));

describe('PackBuilder submit via proxy', () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ logId: 123 }) });
  });

  it('submits pack using /api/creator proxy', async () => {
    render(<PackBuilder />);
    const input = screen.getByPlaceholderText('e.g. p1');
    fireEvent.change(input, { target: { value: 'p123' } });
    fireEvent.click(screen.getByText('Submit Pack'));

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    expect(global.fetch).toHaveBeenCalledWith('/api/creator/packs/p123/submit', expect.objectContaining({
      method: 'POST',
      credentials: 'include',
    }));
    expect(await screen.findByText(/Submitted \(logId: 123\)/)).toBeInTheDocument();
  });
});
