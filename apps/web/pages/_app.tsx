import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { AuthProvider } from '../components/AuthContext';
import { Toaster, toast } from 'react-hot-toast';
import React from 'react';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [routeError, setRouteError] = React.useState('');

  React.useEffect(() => {
    const onError = (err: any, url: string) => {
      const msg = `Failed to load ${url}`;
      setRouteError(msg);
      toast.error(msg);
    };
    router.events.on('routeChangeError', onError);
    return () => { router.events.off('routeChangeError', onError); };
  }, [router.events]);

  return (
    <AuthProvider>
      <div className="sr-only" aria-live="assertive">{routeError}</div>
      <Component {...pageProps} />
      <Toaster position="bottom-right" />
    </AuthProvider>
  );
}

export default MyApp;
