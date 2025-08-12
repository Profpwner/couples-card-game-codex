import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { AuthProvider } from '../components/AuthContext';
import { Toaster } from 'react-hot-toast';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
      <Toaster position="bottom-right" />
    </AuthProvider>
  );
}

export default MyApp;
