import ChatBox from "./components/Chat/ChatBox";
import Layout from "./components/Layout";
import { ThemeProvider } from "./components/theme-provider";
import { Button } from "./components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "./store";
import { SignInWithGoogle, setUser } from "./store/authSlice";
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";

export default function App() {
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      dispatch(setUser(JSON.parse(userData)));
    }
  }, [dispatch]);

  const handleSignIn = () => {
    dispatch(SignInWithGoogle());
  };

  return (
    <>
      {user ? (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Layout>
            <Routes>
              <Route path="/:uid" Component={ChatBox} />
            </Routes>
          </Layout>
        </ThemeProvider>
      ) : (
        <div className="flex h-screen items-center justify-center mx-auto">
          <Button onClick={handleSignIn}>Login</Button>
        </div>
      )}
    </>
  );
}
