import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { useState } from 'react';
import { uiTokens } from '../src/lib/designTokens';

const darkTheme = createTheme({
  spacing: 8,
  palette: {
    mode: 'dark',
    background: {
      default: uiTokens.color['bg.default'],
      paper: uiTokens.color['bg.subtle'],
    },
    text: {
      primary: uiTokens.color['text.primary'],
      secondary: uiTokens.color['text.muted'],
    },
    primary: {
      main: uiTokens.color['action.primary'],
    },
    divider: uiTokens.color['border.default'],
    success: { main: uiTokens.color['status.success'] },
    warning: { main: uiTokens.color['status.warning'] },
    error: { main: uiTokens.color['status.error'] },
    info: { main: uiTokens.color['status.info'] },
  },
  shape: { borderRadius: 10 },
  typography: {
    h1: { fontSize: '2rem', lineHeight: 1.25 },
    h2: { fontSize: '1.5rem', lineHeight: 1.25 },
    h3: { fontSize: '1.125rem', lineHeight: 1.3 },
    body1: { fontSize: '1rem', lineHeight: 1.5 },
    body2: { fontSize: '0.9rem', lineHeight: 1.45 },
    caption: { fontSize: '0.78rem', lineHeight: 1.4 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: 44,
          textTransform: 'none',
          transition: uiTokens.motion.standard,
        },
      },
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
