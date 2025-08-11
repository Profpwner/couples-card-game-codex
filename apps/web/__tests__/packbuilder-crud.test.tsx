import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PackBuilder from '../components/PackBuilder';

jest.mock('../components/AuthContext', () => ({
  useAuth: () => ({ user: { userId: 'u1' } }),
}));

describe('PackBuilder CRUD (JSON storage)', () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
  });

  it('adds a card via modal and saves', async () => {
    render(<PackBuilder />);
    const packInput = screen.getByPlaceholderText('e.g. p1');
    fireEvent.change(packInput, { target: { value: 'p999' } });
    fireEvent.click(screen.getByText('Add Card'));
    const input = screen.getByPlaceholderText('Type card text');
    fireEvent.change(input, { target: { value: 'New Card' } });
    fireEvent.click(screen.getByText('Add'));

    expect(screen.getByText('New Card')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Save'));
    await waitFor(() => expect((global.fetch as jest.Mock)).toHaveBeenCalled());
    const calls = (global.fetch as jest.Mock).mock.calls;
    const last = calls[calls.length - 1];
    const body = JSON.parse(last[1].body);
    expect(body.cards).toContain('New Card');
  });

  it('edits and deletes a card then saves', async () => {
    render(<PackBuilder />);
    const packInput = screen.getByPlaceholderText('e.g. p1');
    fireEvent.change(packInput, { target: { value: 'p777' } });

    // Edit Card 1
    fireEvent.click(screen.getAllByText('Edit')[0]);
    const editInput = screen.getByLabelText('Edit card text');
    fireEvent.change(editInput, { target: { value: 'Card 1 Edited' } });
    fireEvent.click(screen.getByText('Apply'));
    expect(screen.getByText('Card 1 Edited')).toBeInTheDocument();

    // Delete Card 2
    const card2 = screen.getByText('Card 2').closest('li')!;
    const delBtn = card2.querySelector('button:last-of-type')!; // Delete button
    fireEvent.click(delBtn);
    await waitFor(() => expect(screen.queryByText('Card 2')).toBeNull());

    // Save final
    fireEvent.click(screen.getByText('Save'));
    await waitFor(() => expect((global.fetch as jest.Mock)).toHaveBeenCalled());
    const calls = (global.fetch as jest.Mock).mock.calls;
    const last = calls[calls.length - 1];
    const body = JSON.parse(last[1].body);
    expect(body.cards).toContain('Card 1 Edited');
    expect(body.cards).not.toContain('Card 2');
  });
});
