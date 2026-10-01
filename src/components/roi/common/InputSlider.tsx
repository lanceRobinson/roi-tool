'use client';
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';

interface Props {
  label: string;
  value: number;    // fraction 0–1
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  formatValue?: (v: number) => string;
}

export default function InputSlider({ label, value, onChange, min = 0, max = 1, step = 0.05, formatValue }: Props) {
  const [draft, setDraft] = useState<string | null>(null);

  const fmt = formatValue ?? ((v: number) => `${(v * 100).toFixed(0)}%`);

  // Strip trailing % so the input shows just the numeric part
  const displayText = fmt(value).replace(/%$/, '').trim();

  const commit = (raw: string) => {
    setDraft(null);
    const num = parseFloat(raw);
    if (!isNaN(num)) onChange(Math.max(min, Math.min(max, num / 100)));
  };

  return (
    <Box sx={{ mb: 0.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.25 }}>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
        <Box sx={{
          display: 'flex', alignItems: 'center',
          border: '1px solid',
          borderColor: draft !== null ? 'primary.main' : 'divider',
          borderRadius: 0.75,
          bgcolor: draft !== null ? 'primary.50' : 'transparent',
          px: 0.5, py: 0.15,
          transition: 'border-color 0.15s, background-color 0.15s',
        }}>
          <InputBase
            value={draft !== null ? draft : displayText}
            onChange={e => setDraft(e.target.value)}
            onFocus={() => setDraft(displayText)}
            onBlur={e => commit(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') { commit(draft ?? ''); (e.target as HTMLInputElement).blur(); }
              if (e.key === 'Escape') { setDraft(null); (e.target as HTMLInputElement).blur(); }
            }}
            inputProps={{
              style: { textAlign: 'right', padding: 0, width: 40, fontSize: '0.75rem', fontWeight: 700 },
            }}
          />
          <Typography variant="caption" sx={{ fontWeight: 700, ml: 0.25, color: 'text.secondary', lineHeight: 1 }}>%</Typography>
        </Box>
      </Box>
      <Slider
        value={value}
        min={min}
        max={max}
        step={step}
        size="small"
        onChange={(_, v) => onChange(v as number)}
        sx={{ py: 0.5 }}
      />
    </Box>
  );
}
