'use client';
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

interface Props {
  label: string;
  value: string;
  sublabel?: string;
  accent?: boolean;
  large?: boolean;
}

export default function RoiMetricCard({ label, value, sublabel, accent = false, large = false }: Props) {
  return (
    <Paper variant="outlined" sx={{
      p: { xs: 2, md: large ? 3 : 2.5 },
      borderRadius: 2,
      borderColor: accent ? 'primary.main' : 'divider',
      borderWidth: accent ? 2 : 1,
      textAlign: 'center',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 0.5,
    }}>
      <Typography
        variant={large ? 'h3' : 'h4'}
        color={accent ? 'primary.main' : 'text.primary'}
        sx={{ lineHeight: 1, letterSpacing: '-0.02em', fontWeight: 800 }}
      >
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>{label}</Typography>
      {sublabel && <Typography variant="caption" color="text.disabled">{sublabel}</Typography>}
    </Paper>
  );
}
