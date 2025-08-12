import React from 'react';
import { render, screen } from '@testing-library/react';
import Layout from '../components/Layout';

// Mock auth hook to avoid requiring provider in tests
jest.mock('../components/AuthContext', () => ({
  useAuth: () => ({
    loading: false,
    isAuthenticated: false,
    user: null,
    refresh: jest.fn(),
    logout: jest.fn(),
  }),
}));

describe('Layout component', () => {
  it('renders children and navigation link', () => {
    render(
      <Layout>
        <p>Hello</p>
      </Layout>
    );
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
