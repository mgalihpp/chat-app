import ChatBox from "./components/Chat/ChatBox";
import Layout from "./components/Layout";
import { ThemeProvider } from "./components/theme-provider";

export default function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Layout>
          <ChatBox />
        </Layout>
      </ThemeProvider>
    </>
  );
}
