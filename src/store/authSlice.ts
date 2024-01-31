/* eslint-disable @typescript-eslint/no-explicit-any */
import { auth, db } from "@/lib/firebase";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { AppDispatch, RootState } from ".";

interface User {
  username: string | null;
  photoUrl: string | null;
  email: string | null;
  uid: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: unknown | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<unknown | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setUser, setLoading, setError } = authSlice.actions;

export const SignInWithGoogle = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    if (user) {
      const userRef = doc(db, "users", user.uid); // Assuming "users" is your Firestore collection for user data
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        username: user.displayName,
        photoUrl: user.photoURL,
      });

      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          username: user.displayName,
          photoUrl: user.photoURL,
        })
      );

      dispatch(
        setUser({
          uid: user.uid,
          email: user.email,
          username: user.displayName,
          photoUrl: user.photoURL,
        })
      );
      dispatch(setLoading(false));
      window.location.reload();
    }
  } catch (error) {
    dispatch(setError(error));
    dispatch(setLoading(false));
  }
};

export const SignOut = () => async (dispatch: AppDispatch) => {
  dispatch(setLoading(true));
  try {
    await signOut(auth);
    localStorage.removeItem("user");
    dispatch(setUser(null));
    dispatch(setLoading(false));
    window.location.reload();
  } catch (error) {
    dispatch(setError(error));
    dispatch(setLoading(false));
  }
};

export const selectUser = (state: RootState) => state.auth.user;
export const selectLoading = (state: RootState) => state.auth.loading;
export const selectError = (state: RootState) => state.auth.error;

export default authSlice.reducer;
