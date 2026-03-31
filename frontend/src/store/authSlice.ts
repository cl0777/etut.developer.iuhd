import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../types';

type AuthState = {
  token: string | null;
  user: User | null;
};

const TOKEN_KEY = 'bilim_token';

function loadInitial(): AuthState {
  const token = localStorage.getItem(TOKEN_KEY);
  const raw = localStorage.getItem('bilim_user');
  let user: User | null = null;
  if (raw) {
    try {
      user = JSON.parse(raw) as User;
    } catch {
      user = null;
    }
  }
  return { token, user };
}

const authSlice = createSlice({
  name: 'auth',
  initialState: loadInitial(),
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ user: User; accessToken: string }>,
    ) {
      state.user = action.payload.user;
      state.token = action.payload.accessToken;
      localStorage.setItem(TOKEN_KEY, action.payload.accessToken);
      localStorage.setItem('bilim_user', JSON.stringify(action.payload.user));
    },
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem('bilim_user');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
