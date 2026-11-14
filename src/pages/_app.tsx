import type { AppProps } from "next/app";
import ErrorBoundary from "@/components/atoms/ErrorBoundary";
import InitProvider from '@/providers/Index';
import '../styles/globals.scss';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <InitProvider>
      <ErrorBoundary>
        <Component {...pageProps} />
      </ErrorBoundary>
    </InitProvider>
  );
}
