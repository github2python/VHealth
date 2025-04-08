import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isSignedIn: boolean;
  role: 'doctor' | 'patient' | null; // Add roles for more specific logic.
}

const initialState: AuthState = {
  isSignedIn: false,
  role: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn(state, action: PayloadAction<'doctor' | 'patient'>) {
      state.isSignedIn = true;
      state.role = action.payload;
    },
    signOut(state) {
      state.isSignedIn = false;
      state.role = null;
    },
  },
});

export const { signIn, signOut } = authSlice.actions;
export default authSlice.reducer;
