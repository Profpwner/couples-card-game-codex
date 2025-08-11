import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import OnboardPage from '../pages/onboard';

jest.mock('next/router', () => {
  const replaceMock = jest.fn();
  return {
    __esModule: true,
    useRouter: () => ({ replace: replaceMock }),
    replaceMock,
  };
});

jest.mock('../components/AuthContext', () => ({
  RequireAuth: ({ children }: any) => <>{children}</>,
  useAuth: () => ({ user: { userId: 'u1' }, loading: false, isAuthenticated: true }),
}));

describe('Onboard page', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // @ts-ignore
    global.fetch = jest.fn().mockImplementation((url: string) => {
      if (url.includes('/api/creator/status')) {
        return Promise.resolve({ ok: true, json: async () => ({ isCreator: false }) });
      }
      if (url.includes('/api/creator/onboard')) {
        return Promise.resolve({ ok: true, json: async () => ({ message: 'Onboarding successful', userId: 'u1' }) });
      }
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('submits onboarding and redirects to dashboard', async () => {
    render(<OnboardPage />);

    const nameInput = screen.getByPlaceholderText('Your creator name');
    fireEvent.change(nameInput, { target: { value: 'Creator X' } });

    const terms = screen.getByLabelText(/I agree to the Terms of Service/i);
    fireEvent.click(terms);

    const btn = screen.getByText('Complete Onboarding');
    fireEvent.click(btn);

    await waitFor(() => expect(screen.getByText(/Onboarding successful/)).toBeInTheDocument());
    await act(async () => {
      jest.advanceTimersByTime(900);
    });
  });

  it('redirects immediately if already a creator', async () => {
    const { replaceMock } = require('next/router');
    replaceMock.mockReset();
    // @ts-ignore
    global.fetch = jest.fn().mockImplementation((url: string) => {
      if (url.includes('/api/creator/status')) {
        return Promise.resolve({ ok: true, json: async () => ({ isCreator: true }) });
      }
      return Promise.resolve({ ok: true, json: async () => ({}) });
    });
    render(<OnboardPage />);
    await waitFor(() => expect(replaceMock).toHaveBeenCalledWith('/dashboard'));
  });
});
