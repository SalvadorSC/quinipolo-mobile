import React from 'react';
import { render, act } from '@testing-library/react-native';
import { Text } from 'react-native';
import { UserProvider, useUser } from '../UserContext';

// Mock expo-secure-store
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

// Mock Supabase
jest.mock('../../services/supabaseClient', () => ({
  supabase: {
    auth: {
      signOut: jest.fn(),
      getUser: jest.fn(),
    },
  },
}));

const TestComponent = () => {
  const { userData } = useUser();

  return (
    <>
      <Text testID="userId">{userData.userId}</Text>
      <Text testID="username">{userData.username}</Text>
      <Text testID="isAuthenticated">
        {userData.isAuthenticated.toString()}
      </Text>
      <Text testID="authInitialized">
        {userData.authInitialized.toString()}
      </Text>
    </>
  );
};

describe('UserContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('provides initial user data', () => {
    const { getByTestId } = render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    expect(getByTestId('userId').props.children).toBe('');
    expect(getByTestId('username').props.children).toBe('');
    expect(getByTestId('isAuthenticated').props.children).toBe('false');
    expect(getByTestId('authInitialized').props.children).toBe('false');
  });

  it('initializes auth state after loading', async () => {
    const { getByTestId } = render(
      <UserProvider>
        <TestComponent />
      </UserProvider>
    );

    await act(async () => {
      // Wait for the useEffect to complete
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(getByTestId('authInitialized').props.children).toBe('true');
  });
});
