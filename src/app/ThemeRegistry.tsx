'use client';
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    primary: { main: '#00338D' },
    background: { default: '#f5f7fa' },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
  },
  shape: { borderRadius: 8 },
  components: {
    MuiPaper:  { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } } },
  },
});

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
